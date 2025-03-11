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

models = {}
modelInfo = {}


def load_models():
    with open('config.json') as config_file:
        config_data = json.load(config_file)
        for model_info in config_data['models']:
            model_name = model_info['name']
            model_path = model_info['path']
            models[model_name] = load_model(model_path)
            modelInfo[model_name] = model_info


def image_to_base64(img):
    _, buffer = cv2.imencode('.png', img)
    return base64.b64encode(buffer).decode('utf-8')

def preprocess_image(image_path, input_shape):
    img = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, (input_shape[0], input_shape[1]))
    if len(input_shape) == 3 and input_shape[2] == 1:
        img = np.expand_dims(img, axis=0)
    else:
        img = img.astype('float32') / 255.0
        img = np.expand_dims(img, axis=-1)
        img = np.expand_dims(img, axis=0)
    return img

def process_text_output(prediction, image):
    prediction = np.argmax(prediction[0])
    prediction = 'Alcoholic' if prediction else 'Fit for duty'

    image_base64 = image_to_base64(image)

    return jsonify({
        "image": image_base64, 
        "prediction": str(prediction)
    })


def process_mask_output(prediction, image):
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

@app.route('/predict', methods=['POST'])
def predict():
    file = request.files['image']
    model_name = request.form['model']
    image_path = 'uploads/image.bmp'
    file.save(image_path)

    model_info = modelInfo[model_name]
    input_shape = model_info['input_shape']
    output_format = model_info['output_format']
    
    image = cv2.imread(image_path)

    image_preprocessed = preprocess_image(image_path, input_shape)
    prediction = models[model_name].predict(image_preprocessed)
    image = cv2.imread(image_path)

    if output_format == 'text':
        return process_text_output(prediction, image)
    elif output_format == 'mask':
        return process_mask_output(prediction, image)

    return jsonify({"message": "something went wrong"})

@app.route('/config', methods=['GET'])
def get_config():
    with open('config.json') as config_file:
        config_data = json.load(config_file)
    return jsonify(config_data)

if __name__ == '__main__':
    if not os.path.exists('uploads'):
        os.makedirs('uploads')
    
    load_models()
    app.run(debug=True)
