export const getImageUrl = (imagePath, cacheBust = '') => {
  if (!imagePath) return '';

  const appendCacheBust = (url) => {
    if (!cacheBust) return url;
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}v=${cacheBust}`;
  };

  if (imagePath.startsWith('http') || imagePath.startsWith('data:')) {
    return appendCacheBust(imagePath);
  }
  // In Next.js, local assets are served from the public directory
  return appendCacheBust(imagePath);
};
