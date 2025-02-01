from flask import Flask, request, jsonify
import easyocr
import json
import fitz # PyMuPDF

# Available languages for EasyOCR
available_languages = {
    "en",      # English
    "es",      # Spanish
    "fr",      # French
    "pt"       # Portuguese (Including Brazilian Portuguese)
}

reader = easyocr.Reader(available_languages)

def ocr_image(image_bytes: bytes) -> str:
    """
    Perform OCR on the provided image using the specified language.

    Args:
        image_bytes (bytes): The image data in bytes.

    Returns:
        str: The OCR result in JSON format.
    """
    results = reader.readtext(image_bytes)
    text_array = [res[1] for res in results]
    return json.dumps({"result": text_array})

def ocr_pdf(pdf_bytes: bytes, language: str) -> str:
    """
    Perform OCR on the provided PDF file using the specified language.

    Args:
        pdf_bytes (bytes): The PDF file data in bytes.
        language (str): The language code for OCR.

    Returns:
        str: The OCR result in JSON format.
    """
    if language not in available_languages:
        raise ValueError(f"Language {language} is not supported by EasyOCR.")
    
    if not pdf_bytes:
        raise ValueError("PDF file is empty.")
    
    # Open the PDF file using PyMuPDF
    pdf_file = fitz.open("pdf", pdf_bytes)

    result_per_page: list[list[str]] = []

    number_of_pages = pdf_file.page_count
    for page_number in range(number_of_pages):
        page = pdf_file[page_number]
        pix = page.get_pixmap()
        image_bytes = pix.tobytes("png")

        # Recognize text using EasyOCR
        result = reader.readtext(image_bytes)
        text_array = [res[1] for res in result]
        result_per_page.append(text_array)    
    
    return json.dumps({
        "number_of_pages": number_of_pages,
        "result": result_per_page,
    })

# Initialize the Flask app
app = Flask(__name__)

@app.route('/ocr/image', methods=['POST'])
def extract_from_image():
    """
    Flask route to handle OCR requests.

    Request:
        language (str): The language code for OCR.
        image (file): The image file to process.
    
    Returns:
        Response: The OCR result or an error message in JSON format.
    """
    print("Request received: /ocr/image")
    try:
        language = request.form['language']
        if language not in available_languages:
            raise ValueError(f"Language {language} is not supported by EasyOCR.")
        image = request.files['image'].read()

        result = ocr_image(image, language)
        return jsonify(json.loads(result))

    except Exception as e:
        return jsonify({"error": str(e)}), 400
    
@app.route('/ocr/pdf', methods=['POST'])
def extract_from_pdf():
    """
    Flask route to handle OCR requests for PDF files.

    Request:
        language (str): The language code for OCR.
        pdf (file): The PDF file to be processed.
    
    Returns:
        Response: The OCR result or an error message in JSON format.
    """
    try:
        language = request.form['language']
        if language not in available_languages:
            raise ValueError(f"Language {language} is not supported by EasyOCR.")
        pdf = request.files['pdf'].read()

        result = ocr_pdf(pdf, language)
        return jsonify(json.loads(result))

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)