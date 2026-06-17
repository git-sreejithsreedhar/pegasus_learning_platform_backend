import { diskStorage } from 'multer';

export const diskStorageConfig = diskStorage({
  destination: './uploads',
  filename: (req, file, callback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const safeName = file.originalname.replace(/\s+/g, '-');
    callback(null, `${uniqueSuffix}-${safeName}`);
  },
});
