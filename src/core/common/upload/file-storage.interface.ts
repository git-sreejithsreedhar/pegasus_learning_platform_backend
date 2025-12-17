export interface IFileStorage {
  save(file: Express.Multer.File): Promise<string>;
}
