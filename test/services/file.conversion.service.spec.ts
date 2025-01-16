import { Test, TestingModule } from '@nestjs/testing';
import { FileConversionService } from './file.conversion.service';

describe('FileConversionService', () => {
  let service: FileConversionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileConversionService],
    }).compile();

    service = module.get<FileConversionService>(FileConversionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
