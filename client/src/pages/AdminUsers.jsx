import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    checkAdminAndLoad();
  }, [filter]);

  async function checkAdminAndLoad() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/login");
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", session.user.id)
      .single();

    if (!profileData || profileData.role !== "admin") {
      navigate("/home");
      return;
    }

    fetchUsers();
  }

  async function fetchUsers() {
    setLoading(true);
    let query = supabase.from("profiles").select("*");

    if (filter === "verified") {
      query = query.eq("status", "approved");
    } else if (filter === "pending") {
      query = query.eq("status", "pending");
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = await query;
    if (!error) setUsers(data);
    setLoading(false);
  }

  function viewUserDetails(user) {
    setSelectedUser(user);
    setShowModal(true);
  }

  async function handleVerify(userId, isVerified) {
    setActionLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ status: isVerified ? "pending" : "approved" })
      .eq("id", userId);

    if (!error) fetchUsers();
    setActionLoading(false);
  }

  async function handleBlock(userId, isBlocked) {
    setActionLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ is_blocked: !isBlocked })
      .eq("id", userId);

    if (!error) fetchUsers();
    setActionLoading(false);
  }

  async function handleDelete(userId) {
    if (!userId) {
      alert("Invalid user ID");
      return;
    }

    setActionLoading(true);
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", userId);

    if (error) {
      alert("Error deleting user: " + error.message);
    } else {
      alert("User deleted successfully!");
      fetchUsers();
    }

    setShowModal(false);
    setShowDeleteConfirm(false);
    setSelectedUser(null);
    setActionLoading(false);
  }

  const filteredUsers = users.filter((user) =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.college?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER + TABLE unchanged */}

      {/* Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
          <div className="bg-white rounded-xl p-6 max-w-3xl mx-4 my-8 w-full">

            {showDeleteConfirm ? (
              <>
                <h3 className="text-xl font-bold mb-4">Delete User</h3>
                <p className="mb-6">
                  Are you sure you want to delete <strong>{selectedUser.full_name}</strong>?
                </p>
                <button onClick={() => handleDelete(selectedUser.id)}>Confirm</button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-4">User Details</h3>

                <div className="space-y-6">
                  <p>{selectedUser.full_name}</p>
                </div>

                <div className="flex gap-3 mt-6">
                  <button onClick={() => setSelectedUser(null)}>Close</button>
                  <button onClick={() => setShowDeleteConfirm(true)}>Delete</button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}