import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { OllamaGenerateRequestDto } from 'src/contracts/requests/ollama.contract.request';
import { OllamaService } from 'src/services/ollama.service';
import { Response } from 'express';
import { ApiKeyGuard } from 'src/guards/apikey.guard';

@Controller('ollama')
@UseGuards(ApiKeyGuard)
export class OllamaController {
  constructor(
    private readonly ollamaService: OllamaService,
  ) { }

  @Post('generate')
  async generateText(@Body() body: OllamaGenerateRequestDto): Promise<string> {
    const generatedText: string = await this.ollamaService.generateText(
      body.prompt,
      body.model
    );

    return generatedText;
  }

  @Post('generate/stream')
  async streamText(@Body() body: OllamaGenerateRequestDto, @Res() res: Response) {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

    // Use the service to initiate streaming
    const axiosStream = await this.ollamaService.streamText(
      body.prompt,
      body.model
    );

    axiosStream.pipe(res); // Pipe the stream directly to the response

    // Handle stream completion and errors
    axiosStream.on('end', () => {
      res.end(); // Close the response when streaming ends
    });

    axiosStream.on('error', (err) => {
      console.error('Stream error:', err);
      res.status(500).send('Error in streaming data');
    });
  } catch(error) {
    console.error('Error in streamText controller:', error);
    throw new Error('Error in streamText controller');
  }

}
