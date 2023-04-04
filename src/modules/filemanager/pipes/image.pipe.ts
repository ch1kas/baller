import { HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';

const IMAGE_REG_EXP = /(jpg|jpeg|png|webp)$/;

export const imagePipe = new ParseFilePipeBuilder()
  .addFileTypeValidator({
    fileType: IMAGE_REG_EXP,
  })
  .build({
    errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
  });
