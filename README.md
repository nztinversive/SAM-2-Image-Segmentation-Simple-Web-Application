# SAM 2 Image Segmentation Web Application

This project is a web application that uses the Segment Anything Model 2 (SAM 2) via the Replicate API to perform image segmentation. Users can upload an image, and the application will segment objects in the image, returning both a combined mask and individual object masks.

## Features

- Image upload functionality
- Integration with Replicate's SAM 2 API for image segmentation
- Display of segmentation results, including combined and individual masks
- Simple and intuitive user interface

## Project Structure

- `frontend/`: Contains HTML and JavaScript files for the user interface
- `backend/`: Contains the Flask application for server-side processing
- `prompts/`: Contains guide for recreating the project
- `.env`: Stores the Replicate API token (not tracked in git)

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <project-directory>
   ```

2. Set up a virtual environment:
   ```bash
   python -m venv myenv
   source myenv/bin/activate  # On Windows, use `myenv\Scripts\activate`
   ```

3. Install the required Python packages:
   ```bash
   pip install flask flask-cors python-dotenv requests
   ```

4. Create a `.env` file in the `backend/` directory and add your Replicate API token:
   ```bash
   REPLICATE_API_TOKEN=your_api_token_here
   ```

5. Start the Flask server:
   ```bash
   python backend/app.py
   ```

6. Open `frontend/index.html` in a web browser or serve it using a local server.

## Usage

1. Open the application in a web browser.
2. Click on the file input to select an image for segmentation.
3. Click the "Segment Image" button to start the segmentation process.
4. Wait for the results to appear, showing the combined mask and individual object masks.

## Contributing

Contributions to improve the application are welcome. Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Replicate](https://replicate.com/) for providing the SAM 2 API
- [Segment Anything Model (SAM)](https://segment-anything.com/) by Meta AI