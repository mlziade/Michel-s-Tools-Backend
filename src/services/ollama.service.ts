import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import axios from 'axios';

export const OllamaModels = [];
export type OllamaModels = typeof OllamaModels[number];

/* 
* Ollama API ocumentation:
* https://github.com/ollama/ollama/blob/main/docs/api.md
*/
@Injectable()
export class OllamaService {
    constructor() { }

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
            if (error.response.includes(`model '${model}' not found`)) {
                throw new NotFoundException(`Model '${model}' is not available`);
            } else {
                throw new InternalServerErrorException('Error in Infering on Ollama API');
            }
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
            if (error.response.includes(`model '${model}' not found`)) {
                throw new NotFoundException(`Model '${model}' is not available`);
            } else {
                throw new InternalServerErrorException('Error in streaming inference on Ollama API');
            }
        }
    }

    /*
    * List available models using Ollama API
    * Docs: https://github.com/ollama/ollama/blob/main/docs/api.md#list-local-models
    */
    async listModels(): Promise<string[]> {
        const baseUrl = process.env.OLLAMA_URL;
        if (!baseUrl) {
            throw new Error('OLLAMA_URL is not defined');
        }

        const finalUrl = `${baseUrl}/api/tags`;

        try {
            const response = await axios.get(finalUrl);
            const availableModelsNames = response.data.models.map((model) => model.name);

            return availableModelsNames;
        } catch (error) {
            console.error("🚀 ~ OllamaService ~ listModels ~ error:", error);
            throw new InternalServerErrorException('Error in listing models on Ollama API');
        }
    }
}
