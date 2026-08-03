export function parseMarkdownJSON<T>(mdJson: string): T {
    const cleaned = mdJson
      .replace(/^```json\s*/, '')
      .replace(/```$/, '')
      .trim();
  
    return JSON.parse(cleaned) as T;
  }