from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv
import logging

load_dotenv()

app = Flask(__name__, static_folder='../frontend', static_url_path='')
CORS(app)

logging.basicConfig(level=logging.INFO)

API_URL = "https://api.replicate.com/v1/predictions"
API_TOKEN = os.getenv("REPLICATE_API_TOKEN")

@app.route('/')
def serve_html():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('frontend', path)

@app.route('/segment', methods=['POST'])
def segment_image():
    data = request.json
    headers = {
        "Authorization": f"Token {API_TOKEN}",
        "Content-Type": "application/json",
    }
    payload = {
        "version": "fe97b453a6455861e3bac769b441ca1f1086110da7466dbb65cf1eecfd60dc83",
        "input": {
            "image": data['input']['image'],
            "prompt": "Point out and segment all distinct objects in the image",
            "points": [[0, 0]],  # Add a point prompt in the top-left corner
            "labels": [1],       # 1 indicates a foreground point
        }
    }
    app.logger.info(f"Sending request to Replicate API")
    response = requests.post(API_URL, json=payload, headers=headers)
    app.logger.info(f"Received response from Replicate API: {response.json()}")
    return jsonify(response.json()), response.status_code

@app.route('/status/<prediction_id>', methods=['GET'])
def check_status(prediction_id):
    headers = {
        "Authorization": f"Token {API_TOKEN}",
    }
    app.logger.info(f"Checking status for prediction: {prediction_id}")
    response = requests.get(f"{API_URL}/{prediction_id}", headers=headers)
    data = response.json()
    app.logger.info(f"Received status response: {data}")
    
    # Ensure the output is in the correct format
    if data['status'] == 'succeeded':
        output = data.get('output', [])
        if isinstance(output, list) and len(output) > 0:
            data['output'] = {
                'combined_mask': output[0],
                'individual_masks': output[1:]
            }
    
    return jsonify(data), response.status_code

if __name__ == '__main__':
    app.run(debug=True, port=3000)