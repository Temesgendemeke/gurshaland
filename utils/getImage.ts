"use server";

const generateImage = async (title: string, foodOnly = false) => {
  let query = (title || "").trim();
  if (!query) {
    throw new Error("Empty image search query");
  }

  // Always force food context for Pexels results
  if (foodOnly) {
    const lower = query.toLowerCase();
    const hasFoodWord = /\b(food|dish|meal|cuisine|plate|bowl|stew|bread|salad|meat|chicken|fish|rice|soup|sauce|drink|beverage|tea|coffee|juice|injera|wat|tibs|kitfo)\b/.test(lower);
    if (!hasFoodWord) {
      query = `${query} Ethiopian food dish`;
    } else {
      query = `${query} food`;
    }
  }

  const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`;
  const response = await fetch(url, {
    headers: {
      Authorization: process.env.PEXELS_API_KEY || "",
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
  return photo.src.large;
};

export default generateImage;
