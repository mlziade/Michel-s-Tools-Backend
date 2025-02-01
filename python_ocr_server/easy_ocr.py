from flask import Flask, request, jsonify
import easyocr
import json

# Available languages for EasyOCR
available_languages = {
    "en",      # English
    "ch_sim",  # Chinese (Simplified)
    "ch_tra",  # Chinese (Traditional)
    "es",      # Spanish
    "fr",      # French
    "pt"       # Portuguese (Including Brazilian Portuguese)
}

def ocr(image_bytes: bytes, language: str) -> str:
    """
    Perform OCR on the provided image bytes using the specified language.
    
    Args:
        image_bytes (bytes): The image data in bytes.
        language (str): The language code for OCR.
    
    Returns:
        str: The OCR result in JSON format.
    """
    if language not in available_languages:
        raise ValueError(f"Language {language} is not supported by EasyOCR.")
    
    reader = easyocr.Reader([language])
    results = reader.readtext(image_bytes)
    text_array = [res[1] for res in results]
    return json.dumps({"result": text_array})

# Initialize the Flask app
app = Flask(__name__)

@app.route('/ocr/image', methods=['POST'])
def ocr_route():
    """
    Flask route to handle OCR requests.
    
    Returns:
        Response: The OCR result or an error message in JSON format.
    """
    print("Request received: /ocr/image")
    try:
        print(request.form)
        language = request.form['language']
        image = request.files['image'].read()

        result = ocr(image, language)
        return jsonify(json.loads(result))

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)
