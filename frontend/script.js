const API_URL = 'http://localhost:3000';

document.getElementById('segmentButton').addEventListener('click', segmentImage);

async function segmentImage() {
    const imageInput = document.getElementById('imageInput');
    const resultDiv = document.getElementById('result');

    if (!imageInput.files[0]) {
        alert('Please select an image first.');
        return;
    }

    try {
        const imageUrl = await uploadImage(imageInput.files[0]);
        console.log('Image uploaded successfully:', imageUrl);

        const response = await fetch(`${API_URL}/segment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                input: {
                    image: imageUrl,
                    prompt: "Segment the main object in the image",
                }
            }),
        });

        console.log('API Response Status:', response.status);
        const data = await response.json();
        console.log('API Response Data:', data);

        if (!response.ok) {
            throw new Error(`API request failed: ${data.detail || data.error || response.statusText}`);
        }
        
        if (data.error) {
            resultDiv.innerHTML = `Error: ${data.error}`;
        } else if (data.id) {
            await checkPredictionStatus(data.id);
        } else {
            resultDiv.innerHTML = 'Error: Unexpected response from server';
        }
    } catch (error) {
        console.error('Error details:', error);
        resultDiv.innerHTML = `An error occurred while processing the image: ${error.message}`;
    }
}

async function uploadImage(file) {
    // For now, we'll use a data URL
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

async function checkPredictionStatus(predictionId) {
    const resultDiv = document.getElementById('result');
    while (true) {
        const response = await fetch(`${API_URL}/status/${predictionId}`);
        const data = await response.json();

        if (data.status === 'succeeded') {
            displayResult(data.output);
            break;
        } else if (data.status === 'failed') {
            resultDiv.innerHTML = 'Prediction failed';
            break;
        }

        await new Promise(resolve => setTimeout(resolve, 1000));
    }
}

function displayResult(output) {
    const resultDiv = document.getElementById('result');
    if (output && output.combined_mask) {
        resultDiv.innerHTML = `
            <h2 class="text-xl font-bold mt-4 mb-2">Segmentation Result:</h2>
            <h3 class="text-lg font-semibold mt-2">Combined Mask:</h3>
            <img src="${output.combined_mask}" alt="Combined Segmentation Mask" class="max-w-full h-auto mb-4">
            <h3 class="text-lg font-semibold mt-2">Individual Masks:</h3>
            <div class="grid grid-cols-2 gap-2">
                ${output.individual_masks.map((mask, index) => `
                    <div>
                        <p class="text-sm font-medium">Mask ${index + 1}</p>
                        <img src="${mask}" alt="Segmentation Mask ${index + 1}" class="max-w-full h-auto">
                    </div>
                `).join('')}
            </div>
        `;
    } else {
        resultDiv.innerHTML = 'Error: Invalid output format';
    }
}