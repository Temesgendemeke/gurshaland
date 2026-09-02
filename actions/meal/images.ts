"use server";

export async function getMealImage(searchTerm: string): Promise<string | null> {
  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) return null;

  const query = `${searchTerm} food dish`;

  try {
    const url = `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=5&orientation=landscape`;
    const response = await fetch(url, {
      headers: { Authorization: apiKey },
    });

    if (!response.ok) return null;

    const data = await response.json();
    return data.photos?.[0]?.src?.large ?? null;
  } catch {
    return null;
  }
}
