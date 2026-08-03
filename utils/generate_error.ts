import { ApiError } from "next/dist/server/api-utils";

export default function generate_error(error: any){
    if(error instanceof ApiError){
        return error.message
    }else{
        return "An unexpected error occurred";
    }
}