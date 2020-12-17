export class FileNotFoundError {
  public code = 'ENOENT';
  constructor(public message: string = 'file not found') {}
}
