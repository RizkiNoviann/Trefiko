export function resolveImageUrl(imagePath: string, apiBaseUrl: string) {
  if (!imagePath) {
    return '';
  }

  if (
    imagePath.startsWith('data:image/')
    || imagePath.startsWith('http://')
    || imagePath.startsWith('https://')
  ) {
    return imagePath;
  }

  return `${apiBaseUrl}${imagePath}`;
}
