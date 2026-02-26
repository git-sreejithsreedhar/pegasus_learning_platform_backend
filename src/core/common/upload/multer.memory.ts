import { memoryStorage } from 'multer';

export const CloudMulterOptions = {
  storage: memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
};
