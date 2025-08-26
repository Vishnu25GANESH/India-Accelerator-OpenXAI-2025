from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io
import cv2
import numpy as np

app = Flask(__name__)
CORS(app)

@app.route('/api/analyze', methods=['POST'])
def analyze_image():
    print("Received request to /api/analyze")
    if 'image' not in request.files:
        print("Error: No image file in request")
        return jsonify({'error': 'No image file provided'}), 400

    file = request.files['image']
    print(f"Processing file: {file.filename}")
    
    try:
        image_bytes = file.read()
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        # Convert to grayscale and apply threshold
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        _, thresh = cv2.threshold(gray, 127, 255, cv2.THRESH_BINARY)

        # Find contours
        contours, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        print(f"Found {len(contours)} contours.")
        
        if not contours:
            print("Error: No contours found")
            return jsonify({'error': 'No contours found in image'}), 400

        # Get the largest contour
        largest_contour = max(contours, key=cv2.contourArea)
        
        # Simplify the contour and convert to a serializable list
        contour_points = largest_contour.squeeze().tolist()

        print("Successfully processed contour, sending back to frontend.")
        return jsonify({'contour': contour_points})

    except Exception as e:
        print(f"An exception occurred: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
