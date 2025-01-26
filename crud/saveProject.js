const { createClient } = require("@supabase/supabase-js");

// Supabase credentials (ambil dari environment variable)
const supabaseUrl = process.env.VITE_SUPABASE_DATABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// Inisialisasi Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: "Method not allowed" }),
    };
  }

  try {
    const data = JSON.parse(event.body);

    const { error } = await supabase.from("projects").insert([data]);

    if (error) {
      throw error;
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ msg: "Project saved successfully" }),
    };
  } catch (error) {
    console.error("Error saving project:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to save project: " + error.message,
      }),
    };
  }
};
