import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import checkmark from "../assets/checklist.png";

export default function UserBadge({ userName, userId, className = "", showTick = true }) {
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId || !showTick) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const fetchUserStatus = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("status, is_blocked")
          .eq("id", userId)
          .single();

        if (!error && data) {
          // User is verified if status is 'approved' and not blocked
          setIsVerified(data.status === "approved" && !data.is_blocked);
        }
      } catch (err) {
        console.error("Error fetching user status:", err);
      }
      setLoading(false);
    };

    fetchUserStatus();
  }, [userId, showTick]);

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      <span>{userName}</span>
      {isVerified && (
        <img src={checkmark} alt="Verified" className="w-3.5 h-3.5 object-contain" />
      )}
    </span>
  );
}
