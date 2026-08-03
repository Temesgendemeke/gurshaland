import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import {z} from "zod"


const env = createEnv({
    server: {
        GOOGLE_GENERATIVE_AI_API_KEY: z.string().min(1),
        SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
        YOUTUBE_API_KEY: z.string().min(1),
    },
    client: {
        NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
        NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
        NEXT_PUBLIC_URL: z.string().url(),
    },
    runtimeEnv: process.env,
    clientPrefix: "NEXT_PUBLIC_",
    emptyStringAsUndefined: true    
});


export default env;