import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearUser, setUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import authService from "../appwrite/auth";
import InputBox from "../components/InputBox";
import SelectBox from "../components/SelectBox";

function Profile() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [gender, setGender] = useState(user?.gender || "");

  const handleLogout = async () => {
    await authService.logOut();
    dispatch(clearUser());
    navigate("/login");
  };

  const handleSave = () => {
    dispatch(setUser({ ...user, name, email, phone, gender }));
    // Later: Add Appwrite update API call here to save permanently
  };

  const avatar =
    gender === "male"
      ? "https://cdn-icons-png.flaticon.com/512/1999/1999625.png" // young boy
      : gender === "female"
      ? "https://cdn-icons-png.flaticon.com/512/6997/6997662.png" // young girl
      : "https://cdn-icons-png.flaticon.com/512/3177/3177440.png"; // default neutral

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
        {/* Name */}
        <InputBox
          label="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Email */}
        <InputBox
          label="Email"
          type="email"
          value={email}
          disabled
          onChange={(e) => setEmail(e.target.value)}
        />
            
          
      

        {/* Phone */}
       <InputBox
         label="Phone Number"
         type="tel"
         value={phone}
         onChange={(e) => setPhone(e.target.value)}
         placeholder="Enter phone number"
       />

        {/* Gender */}
        <SelectBox
          label="Gender"
          value={gender}
          options={[
            { value: "", label: "Select Gender" },
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
          ]}
          onChange={(e) => setGender(e.target.value)}
        >
          
        </SelectBox>
      </div>
      {/* Save + Logout Buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleSave}
          className="flex-1 py-3 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition"
        >
          Save Changes
        </button>
        <button
          onClick={handleLogout}
          className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
