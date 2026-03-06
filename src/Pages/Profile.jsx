import React, { useState ,useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearUser, setUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import InputBox from "../components/InputBox";
import SelectBox from "../components/SelectBox";
import AuthButton from "../components/AuthButton";
import { use } from "react";

function Profile() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [phone, setPhone] = useState("");
const [gender, setGender] = useState("");
const [newPassword, setNewPassword] = useState("");
const [currentPassword, setCurrentPassword] = useState("");
const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (user) {
        setName(user.name || user.profile?.name || "");
        setEmail(user.email || user.profile?.email || "");
        setPhone(user.profile?.phone || "");
        setGender(user.profile?.gender || "");
    }
  }, [user]);

  const handleLogout = async () => {
    // Backend removed: just clear local user and navigate to login
    dispatch(clearUser());
    navigate("/login");
  };

  const handleSave = async () => {
    // Local-only update: update redux state with new values
    setLoading(true);
    try {
      const updatedUser = {
        ...user,
        name,
        profile: {
          ...(user?.profile || {}),
          name,
          phone,
          gender,
        },
      };
      dispatch(setUser(updatedUser));
      alert("Profile updated (local)");
    } catch (e) {
      alert(e?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };


  const handlePasswordChange = async () => {
    // No backend: notify user that password change isn't implemented
    if (!newPassword || !currentPassword) return alert("Enter both current and new password");
    alert("Password change is not available (backend removed).");
  };

  const avatar =
    gender === "male"
      ? "https://cdn-icons-png.flaticon.com/512/1999/1999625.png"
      : gender === "female"
      ? "https://cdn-icons-png.flaticon.com/512/6997/6997662.png"
      : "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-4">
        <h1 className="text-2xl font-bold mb-4">You are not logged in</h1>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-[512px] py-5 mx-auto">
      {/* Avatar */}
      <div className="flex flex-col items-center">
        <img
          src={avatar}
          alt="Profile Avatar"
          className="w-28 h-28 rounded-full object-cover"
        />
      </div>

      {/* Editable Info */}
      <div className="mt-6 space-y-5">
        <InputBox label="Username" value={name} onChange={(e) => setName(e.target.value)} />
        <InputBox label="Email" type="email" value={email} disabled />
        <InputBox
          label="Phone Number"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Enter phone number"
        />
        <SelectBox
          label="Gender"
          value={gender}
          options={[
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]}
          onChange={(e) => setGender(e.target.value)}
        />
      </div>

      {/* Save + Logout */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <AuthButton
          label={loading ? "Saving..." : "Save Changes"}
          onClick={handleSave}
          variant="primary"
          disabled={loading}
        />
        <AuthButton label="Logout" onClick={handleLogout} variant="ghost" />
      </div>

      {/* Password Change */}
      <div className="mt-8 space-y-3">
        <InputBox
          label="New Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
        />
        <AuthButton
          label={loading ? "Updating..." : "Change Password"}
          onClick={handlePasswordChange}
          variant="secondary"
          disabled={loading}
        />
      </div>
    </div>
  );
}

export default Profile;
