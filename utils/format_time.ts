const format_time = (min: number)=>{
    if(!min){
        return 0
    }
    if(min >= 60){
        return `${min / 60}hr`
    }else{
        return `${min}min`
    }
}


export default format_time