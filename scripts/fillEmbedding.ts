import { google } from '@ai-sdk/google';
import { embed } from "ai";
import "dotenv/config"
import { createClient } from "@supabase/supabase-js";


const model = google.textEmbedding("text-embedding-004")
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)


async function generateEmbedding(text: string){
    const {embedding} = await embed({
        model,
        value:text,
        providerOptions:{
            google:{
                outputDimensions: 768,
                taskType: "SEMANTIC_SIMILARITY"
            }
        }
    })
    return embedding
}


async function main(){
    const {data: restaurants} = await supabase.from("restaurant").select("*").is("embedding", null)

    if(!restaurants){
        console.log("No restaurants found")
        return
    }


    for(const r of restaurants){    
        const text = r.name + " " + r.description + " " + r.address + " " + r.menu
        const embedding = await generateEmbedding(text)
        console.log(embedding)
        console.log(r.id)
        const {error} = await supabase.from("restaurant").update({embedding: embedding}).eq("id", r.id)
        if(error){
            console.log(error)
            break
        }
    }
    console.log("Done")
}

main()