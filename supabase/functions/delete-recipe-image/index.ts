import { serve } from "https://deno.land/std@0.203.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js"

const BUCKET = "gurshaland-bucket";


const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
)

interface DeleteFileRequest {
    path: string
}

interface DeleteFileResponse {
    success: boolean
    error?: unknown
}

serve(async (req: Request): Promise<Response> => {
    const { path }: DeleteFileRequest = await req.json()

    const { error }: { error: unknown } = await supabase.storage
        .from(BUCKET) 
        .remove([path])

    if (error) {
        const response: DeleteFileResponse = { success: false, error }
        return new Response(JSON.stringify(response), { status: 400 })
    }

    const response: DeleteFileResponse = { success: true }
    return new Response(JSON.stringify(response), { status: 200 })
})
