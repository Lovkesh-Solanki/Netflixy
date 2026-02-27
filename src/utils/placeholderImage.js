// Placeholder image generator - No external requests!
// Creates inline SVG data URIs

export const getPlaceholderImage = (text = 'No Image', width = 300, height = 450) => {
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect fill='%23222' width='${width}' height='${height}'/%3E%3Ctext fill='%23666' x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16'%3E${encodeURIComponent(text)}%3C/text%3E%3C/svg%3E`;
};

export const getPosterPlaceholder = (title) => {
  return getPlaceholderImage(title || 'No Poster', 300, 450);
};

export const getBannerPlaceholder = (title) => {
  return getPlaceholderImage(title || 'No Banner', 1920, 1080);
};