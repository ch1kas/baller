import * as path from 'path';
import { diskStorage } from 'multer';
import slugify from 'slugify';
export const slugi = (string: string, unique = false) => {
  let slug = `${slugify(string.normalize('NFC'), {
    lower: true,
    strict: true,
    remove: /[*+~.()`'/"\\!:@]/g,
  })}`;
  if (unique) slug += `-${(Math.random() + 1).toString(36).substring(7)}`;
  return slug;
};

export const imageFileInterceptorOptions = {
  storage: diskStorage({
    destination: './uploads/filemanager/temp/images',
    filename: (req, file, cb) => {
      const filename: string = slugi(path.parse(file.originalname).name, true);

      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    },
  }),
};
