"use server";
import { google } from "@ai-sdk/google";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { embed } from "ai";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { SupabaseClient } from "@supabase/supabase-js";

function getSupabase() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
    // Try service role key first (admin), then anon key (public)
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        "";

    if (!url || !key) {
        throw new Error(
            "Supabase URL and Key must be defined in environment variables",
        );
    }

    return new SupabaseClient(url, key);
}

export async function chunkText(text: string) {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const docs = await splitter.splitText(text);
    for (let doc of docs) {
        await embedAndSave(doc);
    }
}

export async function chunkPDF(pdf: Blob) {
    // load pdf
    const loader = new PDFLoader(pdf);
    const docs = await loader.load();
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 120,
    });

    for (let doc of docs) {
        const chunks = await splitter.splitText(doc.pageContent);
        for (let chunk of chunks) {
            await embedAndSave(chunk);
        }
    }
}

export async function embedAndSave(text: string) {
    try {
        const { embedding } = await embed({
            model: google.embedding("gemini-embedding-001"),
            value: text,
            providerOptions: {
                google: {
                    outputDimensions: 3072,
                    taskType: "SEMANTIC_SIMILARITY",
                },
            },
        });
        const { error } = await getSupabase().from("app_knowledge").insert(
            {
                text,
                embedding,
            },
        );
        if (error) throw error;
    } catch {
        console.log("Failed to embed and save");
        throw new Error("Failed to embed and save");
    }
}

export async function FeedAI(text: string, pdf?: Blob) {
    if (text) {
        await chunkText(text);
    }
    if (pdf) {
        await chunkPDF(pdf);
    }
    return true;
}

export async function query(text: string) {
    // embeed
    const { embedding } = await embed({
        model: google.embedding("gemini-embedding-001"),
        value: text,
        providerOptions: {
            google: {
                outputDimensions: 3072,
                taskType: "SEMANTIC_SIMILARITY",
            },
        },
    });

    // query
    const { data, error } = await getSupabase().rpc("retrieve_app_knowledge", {
        query_embedding: embedding,
    });
    if (error) throw error;
    return data;
}
