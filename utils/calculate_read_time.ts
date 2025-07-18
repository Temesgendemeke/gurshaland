import format_time from "./format_time"

const calculate_read_time = (blog: any)=>{
    const WPM = 300
    const texts= JSON.stringify(blog)
    const wordCount = texts.trim().split(/\s+/).length
    return format_time(Math.ceil(wordCount / WPM))
}

export default calculate_read_time