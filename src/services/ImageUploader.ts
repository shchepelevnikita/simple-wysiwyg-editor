export const ImageUploader = {
  async getBase64FromFile(file: Blob) {
    const reader = new FileReader();

    return await new Promise((resolve, reject) => {
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject(reader.error);
      };
      reader.readAsDataURL(file);
    });
  }
};
