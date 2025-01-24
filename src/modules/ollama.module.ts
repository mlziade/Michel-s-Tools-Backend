import { Module } from '@nestjs/common';
import { OllamaController } from 'src/controllers/ollama.controller';
import { OllamaService } from 'src/services/ollama.service';

@Module({
  providers: [
    OllamaService,
  ],
  controllers: [
    OllamaController,
  ],
  exports: [
    // OllamaService,
  ]
})
export class OllamaModule {}
