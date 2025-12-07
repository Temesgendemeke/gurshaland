import { createClient } from "@supabase/supabase-js";
// import restaurants from "./json/clean/ride.json";
// import additionalRestaurants from "./json/clean/addisDelivery.json";
import dotenv from "dotenv";
import path from "path";
import restaurants from "./json/clean/restaurants.json";

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const populateDb = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error("Missing Supabase URL or Service Role Key in .env.local");
    }

    console.log(restaurants)

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error } = await supabase.from("restaurant").insert(restaurants);

    if (error) {
        console.error("Error populating database:", error);
    } else {
        console.log("Database populated successfully", data);
    }
}

// populateDb();

console.log(restaurants.length)
