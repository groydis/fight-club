export interface FileStorage {
  upload(path: string, file: Buffer, contentType: string): Promise<string>;
}
