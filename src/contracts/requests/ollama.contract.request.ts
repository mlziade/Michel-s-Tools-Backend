import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { OllamaModels } from "src/services/ollama.service";

export class OllamaGenerateRequestDto {
    @ApiProperty({ 
        description: 'The prompt for the model', 
        example: 'Generate a summary for the following text...' 
    })
    @IsNotEmpty()
    @IsString()
    prompt: string;

    @ApiProperty({ 
        description: 'The model to be used', 
        enum: ["llama3.2:1b", "phi3"], 
        example: 'llama3.2:1b' 
    })
    @IsNotEmpty()
    @IsString()
    model: OllamaModels;
}