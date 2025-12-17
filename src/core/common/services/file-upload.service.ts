// import multer from 'multer';
// import path, { extname } from 'path';

// export class FileUploadService {
//   // local storage path
//   private readonly uploadPath = path.join(__dirname, '..', 'uploads');

//   //   Multer storage configuration
//   private storage = multer.diskStorage({
//     destination: (req, file, callback) => {
//       callback(null, this.uploadPath);
//     },
//     filename: (req, file, callback) => {
//       callback(null, `${Date.now()}${extname(file.originalname)}`);
//     },
//   });

//   //  handle file upload
//   getMulterInstance() {
//     return multer({ storage: this.storage }).single('document');
//   }

//   //   // Get the URL or path to the uploaded file
//   //   getFilePath(file: Express.Multer.File) {
//   //     return path.join(this.uploadPath, file.filename); // Full local path
//   //   }

//   //   // Optionally return the public URL or path for client-side access
//   //   getPublicFileUrl(file: Express.Multer.File) {
//   //     return `/uploads/${file.filename}`;
//   //   }
// }
