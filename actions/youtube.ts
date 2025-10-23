

export const findYoutubeVideo = async (searchQuery: string): Promise<string | null> => {
    try {
        console.log(`🔍 Searching YouTube for video: "${searchQuery}"`);
        const apiKey = process.env.YOUTUBE_API_KEY;
        if (!apiKey) {
            console.error("❌ YOUTUBE_API_KEY not configured");
            return null;
        }
        const encodedQuery = encodeURIComponent(searchQuery);
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodedQuery}&key=${apiKey}`;
        
        console.log(`🚀 Making request to YouTube API: ${url}`)
        const response = await fetch(url)
        const data = await response.json()
        console.log("📡 YouTube API response:", data)
        if (data.items && data.items.length > 0) {
            const videoId = data.items[0].id.videoId;
            console.log(`🎥 Found YouTube video: ${videoId}`);
            return videoId;
        } else {
            console.warn("⚠️ No YouTube video found");
            return null;
        }
    } catch (error) {
        console.error("❌ Error searching YouTube:", error);
        return null;
    }
};
