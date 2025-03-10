import os
import json
import base64
from flask import Flask, request, jsonify
import cv2
import numpy as np
from tensorflow.keras.models import load_model
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

model = load_model('model.h5')

def image_to_base64(img):
    _, buffer = cv2.imencode('.png', img)
    return base64.b64encode(buffer).decode('utf-8')

def preprocess_image(image_path):
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (192, 192))
    img = img.astype('float32') / 255.0
    img = np.expand_dims(img, axis=-1)
    img = np.expand_dims(img, axis=0)
    return img

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['image']
    image_path = 'uploads/image.bmp'
    file.save(image_path)

    image = cv2.imread(image_path)
    image_preprocessed = preprocess_image(image_path)
    prediction = model.predict(image_preprocessed)

    mask = prediction[0]
    mask = (mask * 255).astype(np.uint8)
    mask_image = cv2.cvtColor(mask, cv2.COLOR_GRAY2BGRA)
    mask_resized = cv2.resize(mask_image, (image.shape[1], image.shape[0]))

    overlay = image.copy()
    red_color = np.array([0, 0, 255])
    overlay = np.asarray(overlay, dtype=np.uint8)

    if overlay.shape[:2] != mask_resized.shape[:2]:
        mask_resized = cv2.resize(mask_resized, (overlay.shape[1], overlay.shape[0]))

    overlay[mask_resized[:, :, 0] == 255] = red_color

    image_base64 = image_to_base64(image)
    mask_base64 = image_to_base64(mask_resized)
    overlay_base64 = image_to_base64(overlay)

    return jsonify({
        "image": image_base64,
        "mask": mask_base64,
        "overlay": overlay_base64
    })

@app.route('/config', methods=['GET'])
def get_config():
    with open('config.json') as config_file:
        config_data = json.load(config_file)
    return jsonify(config_data)

if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    
    app.run(debug=True)
