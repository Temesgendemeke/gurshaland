const format_calories = (calorie: number)=>{
    if(!calorie) return 0
    return calorie >= 1000 ? `${calorie}kcl` : `${calorie}g`
}

export default format_calories;