import { supabase } from "../supabaseClient"

/**
 * Ensures that the required storage buckets exist
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const setupStorage = async () => {
  try {
    // Check if the avatars bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()

    if (listError) {
      console.error("Error checking storage buckets:", listError)
      return {
        success: false,
        message: `Error checking storage: ${listError.message}`,
      }
    }

    const avatarBucketExists = buckets.some((bucket) => bucket.name === "avatars")

    // Create the avatars bucket if it doesn't exist
    if (!avatarBucketExists) {
      const { error: createError } = await supabase.storage.createBucket("avatars", {
        public: true,
        fileSizeLimit: 1024 * 1024, // 1MB
        allowedMimeTypes: ["image/png", "image/jpeg", "image/gif"],
      })

      if (createError) {
        console.error("Error creating avatars bucket:", createError)
        return {
          success: false,
          message: `Error creating avatars bucket: ${createError.message}`,
        }
      }

      console.log("Created avatars storage bucket")
    }

    // Set up public access for the avatars bucket
    const { error: policyError } = await supabase.storage.from("avatars").createSignedUrl("test.txt", 60)

    if (policyError && policyError.message.includes("storage policy")) {
      // Need to create a policy for public access
      // This would typically be done in the Supabase dashboard
      console.warn("You may need to set up storage policies for the avatars bucket in the Supabase dashboard")
    }

    return {
      success: true,
      message: "Storage is properly set up",
    }
  } catch (error) {
    console.error("Error setting up storage:", error)
    return {
      success: false,
      message: `Unexpected error: ${error.message}`,
    }
  }
}
