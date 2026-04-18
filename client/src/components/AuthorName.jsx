import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import checkmark from "../assets/checklist.png";

export default function AuthorName({ authorName, authorId, className = "", showTick = true }) {
  const [isApproved, setIsApproved] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!authorId || !showTick) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const fetchAuthorStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("authors")
          .select("is_approved")
          .eq("id", authorId)
          .single();

        if (!error && data) {
          setIsApproved(data.is_approved === true);
        }
      } catch (err) {
        console.error("Error fetching author status:", err);
      }
      setLoading(false);
    };

    fetchAuthorStatus();
  }, [authorId, showTick]);

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span>{authorName}</span>
      {isApproved && (
        <img src={checkmark} alt="Verified" className="w-3.5 h-3.5 object-contain" />
      )}
    </span>
  );
}
