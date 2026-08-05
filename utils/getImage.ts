"use server"
const generateImage = async (title: string) => {
  const query = (title || "").split(":")[1]?.trim() || title.trim();
  if (!query) {
    throw new Error("Empty image search query");
  }
  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`;
  const response = await fetch(url, {
    headers: {
      Authorization: process.env.PIXELS_API_KEY || "",
    },
  });
  if (!response.ok) {
    throw new Error(`Pexels request failed: ${response.status}`);
  }
  const data = await response.json();
  const photo = data.photos?.[0];
  if (!photo) {
    throw new Error("No Pexels photos found");
  }
  return photo.src.original;
}

export default generateImage
