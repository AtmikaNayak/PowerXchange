import { supabase } from "./supabase";

/**
 * Notify users who wishlisted a book that it's now available
 * @param {string} bookId - The book ID
 * @param {object} book - Book details (with title, etc.)
 */
export const notifyWishlistUsers = async (bookId, book) => {
  try {
    // Find all users who have this book in their wishlist
    const { data: wishlistEntries, error: wishlistError } = await supabase
      .from("wishlist")
      .select("user_id")
      .eq("book_id", bookId);

    if (wishlistError) {
      console.error("Error fetching wishlist entries:", wishlistError);
      return;
    }

    if (!wishlistEntries || wishlistEntries.length === 0) {
      console.log(`No users in wishlist for book ${bookId}`);
      return;
    }

    // Get book title for notification
    let bookTitle = book?.title || "A book";
    
    // Create notifications for each user
    const notifications = wishlistEntries.map(entry => ({
      user_id: entry.user_id,
      type: "wishlist_available",
      title: "📚 Your Wishlist Book is Available!",
      message: `"${bookTitle}" is now available for purchase. Check it out before it's gone!`,
      created_at: new Date(),
    }));

    const { error: insertError } = await supabase
      .from("notifications")
      .insert(notifications);

    if (insertError) {
      console.error("Error creating notifications:", insertError);
    } else {
      console.log(`Notified ${wishlistEntries.length} users about book ${bookId}`);
    }
  } catch (err) {
    console.error("Error in notifyWishlistUsers:", err);
  }
};
