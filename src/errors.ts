export class GenderDataNotFound extends Error {
  constructor() {
    super("Gender data not found");
  }
}

export class UnsupportedFileType extends Error {
  constructor() {
    super(`Unsupported file type. Only WAV files are supported.`);
  }
}
