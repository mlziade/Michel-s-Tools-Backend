import { IsNotEmpty, IsString } from "class-validator";
import { OllamaModels } from "src/services/ollama.service";

export class OllamaGenerateRequestDto {
    @IsNotEmpty()
    @IsString()
    prompt: string;

    @IsNotEmpty()
    @IsString()
    model: OllamaModels;
}