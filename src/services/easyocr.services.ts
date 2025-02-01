import axios from 'axios';
import * as fs from 'fs';

export type EasyOcrAvailableLanguages = "en" | "ch_sim" | "ch_tra" | "es" | "fr" | "pt"

export class EasyOcrService {
    constructor() {
    }

    async extractTextFromImage(file: Express.Multer.File, language: EasyOcrAvailableLanguages): Promise<string> {
        const baseUrl = process.env.OCR_URL;
        if (!baseUrl) {
            throw new Error('OCR_URL is not defined');
        }

        const finalUrl = `${baseUrl}/ocr/image`;

        // Create a Blob from the buffer
        const blob = new Blob([file.buffer], { type: file.mimetype });

        // Use FormData to properly send multipart/form-data
        const formData = new FormData();
        formData.append('language', language);
        formData.append('image', blob, file.originalname);

        try {
            const response = await axios.post(finalUrl, formData, {
                headers:{ 'Content-Type': 'multipart/form-data' },
            });
            const generatedText: string = response.data.result;

            return generatedText;
        } catch (error) {
            console.log("🚀 ~ EasyOcrService ~ extractTextFromImage ~ error:", error)
            throw new Error('Error while extracting text from image');
        }
    }
}