import { Test, TestingModule } from '@nestjs/testing';
import { FileConversionController } from './file.conversion.controller';

describe('FileConversionController', () => {
  let controller: FileConversionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FileConversionController],
    }).compile();

    controller = module.get<FileConversionController>(FileConversionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
