import { Injectable } from '@nestjs/common';
import * as Tesseract from 'tesseract.js';

@Injectable()
export class OcrService {
    async extractTextFromBuffer(imageBuffer: Buffer): Promise<string> {
        try {
            // Convert the Buffer to a Base64 string
            const base64Image = imageBuffer.toString('base64');
            const base64ImageURI = `data:image/png;base64,${base64Image}`; // Assuming the image is PNG. Adjust if needed.

            // Use Tesseract.js to process the Base64 image
            const { data } = await Tesseract.recognize(base64ImageURI, 'eng', {
                // logger: (info) => console.log(info), // Log progress or debugging information
            });

            return data.text;
        } catch (error) {
            console.error('Error during OCR processing:', error);
            throw new Error('Failed to extract text from image buffer');
        }
    }
}
