import { PostgrestError } from "@supabase/supabase-js";



export type ActionResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

export async function HandleError<T>(
  promise: Promise<{ data: T | null; error: PostgrestError | null }>
): Promise<ActionResult<T>> {
  try {
    const { data, error } = await promise;
    
    if (error) {
      console.error("Action Error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as T };
  } catch (err) {
    console.error("Unexpected Action Error:", err);
    return { success: false, error: "An unexpected error occurred" };
  }
}
