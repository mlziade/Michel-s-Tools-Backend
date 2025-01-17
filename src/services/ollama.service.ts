import { Injectable } from '@nestjs/common';
import axios from 'axios';

export type OllamaModels = "llama3.2:1b" | "phi3"

@Injectable()
export class OllamaService {
    constructor() {}

    /* 
    * Generate text using Ollama API
    * Docs: https://github.com/ollama/ollama/blob/main/docs/api.md#generate-a-completion
    */
    async generateText(prompt: string, model: OllamaModels): Promise<string> {
        const baseUrl = process.env.OLLAMA_URL;
        if (!baseUrl) {
            throw new Error('OLLAMA_URL is not defined');
        }

        const finalUrl = `${baseUrl}/api/generate`;

        const body = {
            model: model,
            prompt: prompt,
            stream: false,
        }

        try {
            const response = await axios.post(finalUrl, body);
            const generatedText = response.data.response;

            return generatedText;
        } catch (error) {
            console.error("🚀 ~ OllamaService ~ getOllama ~ error:", error);
            throw new Error('Error in OllamaService');
        }
    }

    /* 
    * Streams generated text using Ollama API
    * Docs: https://github.com/ollama/ollama/blob/main/docs/api.md#generate-a-completion
    */
    async streamText(prompt: string, model: OllamaModels): Promise<import('stream').Readable> {
        const baseUrl = process.env.OLLAMA_URL;
        if (!baseUrl) {
            throw new Error('OLLAMA_URL is not defined');
        }

        const finalUrl = `${baseUrl}/api/generate`;

        const body = {
            model: model,
            prompt: prompt,
            stream: true,
        }

        try {
            const response = await axios.post(finalUrl, body, {
                responseType: 'stream'
            });

            return response.data;
        } catch (error) {
            console.error("🚀 ~ OllamaService ~ streamText ~ error:", error);
            throw new Error('Error in OllamaService');
        }
    }
}
