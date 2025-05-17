import { supabase } from "../supabaseClient"

/**
 * Checks if the required database tables exist
 * @returns {Promise<{success: boolean, message: string, missingTables: string[], missingBuckets: string[]}>}
 */
export const checkDatabaseSetup = async () => {
  try {
    // Check if the required tables exist
    const { data, error } = await supabase
      .from("information_schema.tables")
      .select("table_name")
      .eq("table_schema", "public")
      .in("table_name", ["projects", "project_members", "tasks"])

    if (error) {
      console.error("Error checking database setup:", error)
      return {
        success: false,
        message: `Error checking database: ${error.message}`,
        missingTables: ["projects", "project_members", "tasks"],
        missingBuckets: ["avatars"],
      }
    }

    // Check which tables are missing
    const existingTables = data.map((table) => table.table_name)
    const requiredTables = ["projects", "project_members", "tasks"]
    const missingTables = requiredTables.filter((table) => !existingTables.includes(table))

    // Check if the avatars bucket exists
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()

    if (bucketsError) {
      console.error("Error checking storage buckets:", bucketsError)
      return {
        success: false,
        message: `Error checking storage buckets: ${bucketsError.message}`,
        missingTables,
        missingBuckets: ["avatars"],
      }
    }

    const existingBuckets = buckets.map((bucket) => bucket.name)
    const missingBuckets = !existingBuckets.includes("avatars") ? ["avatars"] : []

    if (missingTables.length > 0 || missingBuckets.length > 0) {
      let message = ""
      if (missingTables.length > 0) {
        message += `Missing required tables: ${missingTables.join(", ")}. `
      }
      if (missingBuckets.length > 0) {
        message += `Missing required storage buckets: ${missingBuckets.join(", ")}. `
      }
      message += "Please run the SQL commands in src/utils/supabaseSchema.js"

      return {
        success: false,
        message,
        missingTables,
        missingBuckets,
      }
    }

    return {
      success: true,
      message: "Database is properly set up",
      missingTables: [],
      missingBuckets: [],
    }
  } catch (error) {
    console.error("Error checking database setup:", error)
    return {
      success: false,
      message: `Unexpected error: ${error.message}`,
      missingTables: ["projects", "project_members", "tasks"],
      missingBuckets: ["avatars"],
    }
  }
}
