/**
 * Resizes and crops an image file to a specific target width and height using HTML5 Canvas.
 * Emulates "object-fit: cover" behavior.
 */
export const resizeImage = (
  file: File,
  targetWidth: number = 300,
  targetHeight: number = 450
): Promise<File> => {
  return new Promise((resolve, reject) => {
    // If the file is not an image, resolve immediately with the original file
    if (!file.type.startsWith("image/")) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Canvas 2D context is not supported."));
          return;
        }

        // Emulate object-fit: cover
        const scale = Math.max(targetWidth / img.width, targetHeight / img.height);
        const x = (targetWidth - img.width * scale) / 2;
        const y = (targetHeight - img.height * scale) / 2;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

        canvas.toBlob((blob) => {
          if (blob) {
            const resizedFile = new File([blob], file.name, {
              type: file.type || "image/png",
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          } else {
            reject(new Error("Failed to convert canvas to blob."));
          }
        }, file.type || "image/png");
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};
