"use server"
const generateImage = async (title: string) => {
    console.log("process.env.PEXELS_API_KEY", process.env.PIXELS_API_KEY)
    const image = await fetch(`https://api.pexels.com/v1/search?query=${title.split(':')[1].trim().replace(" ", "+")}&per_page=1`, {
        headers: {
            Authorization: process.env.PIXELS_API_KEY || ''
        }
    })
    console.log(image)
    const data = await image.json()
    return data.photos[0].src.original
}

export default generateImage