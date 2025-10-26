// ProfilePage.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Leaf,
  Menu,
  X,
  Settings,
  Edit3,
  Save,
  Bell,
  Shield,
  Star,
  Award,
} from "lucide-react";
import Navbar from "../components/Navbar";

type ProfileData = {
  name: string;
  email: string;
  location: string;
  bio: string;
  ecoScore: number;
  carbonSaved: number;
};

const Sidebar: React.FC<{ isOpen: boolean; toggle: () => void }> = ({
  isOpen,
  toggle,
}) => (
  <>
    {isOpen && (
      <div
        onClick={toggle}
        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
      />
    )}
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: isOpen || window.innerWidth >= 1024 ? 0 : -300 }}
      transition={{ type: "spring", stiffness: 250, damping: 30 }}
      className="fixed lg:relative top-0 left-0 h-screen w-60 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-6 shadow-lg z-50 flex flex-col justify-between rounded-xl overflow-y-auto"
    >
      <div>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Leaf className="text-green-400 w-6 h-6" />
            <h1 className="text-lg font-bold text-gray-100">GreenScore</h1>
          </div>
          <X
            className="text-gray-400 cursor-pointer lg:hidden"
            onClick={toggle}
          />
        </div>
        <Navbar />
      </div>

      <div className="text-xs text-gray-500 text-center">© 2025 GreenScore</div>
    </motion.aside>
  </>
);

const ProfilePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileData>({
    name: "Olalekan Samson Ogundimu",
    email: "samson@example.com",
    location: "Lagos, Nigeria",
    bio: "Eco-conscious developer and sustainability advocate 🌱",
    ecoScore: 87,
    carbonSaved: 124.5,
  });

  const handleChange = (field: keyof ProfileData, value: string | number) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(false)} />

      <main className="flex-1 p-4 sm:p-6 lg:pl-6 overflow-y-auto min-h-screen text-gray-100">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Menu
              className="text-gray-400 cursor-pointer lg:hidden"
              onClick={() => setSidebarOpen(true)}
            />
            <h2 className="text-2xl font-bold">My Profile</h2>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-400 text-black px-4 py-2 rounded-md font-semibold hover:scale-105 transition"
          >
            {editing ? <Save size={16} /> : <Edit3 size={16} />}
            {editing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>

        {/* Profile Overview */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-gray-850 p-6 rounded-xl border border-gray-800 shadow-lg flex flex-col md:flex-row gap-6 mb-8"
        >
          <div className="flex-shrink-0">
            <img
              src="/avatar.jpg"
              alt="User avatar"
              className="w-32 h-32 rounded-full border-4 border-green-400 object-cover"
            />
          </div>

          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400">Full Name</label>
                {editing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full bg-black/30 text-gray-100 p-2 rounded mt-1"
                  />
                ) : (
                  <p className="font-semibold">{profile.name}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-400">Email</label>
                {editing ? (
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full bg-black/30 text-gray-100 p-2 rounded mt-1"
                  />
                ) : (
                  <p>{profile.email}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-400">Location</label>
                {editing ? (
                  <input
                    type="text"
                    value={profile.location}
                    onChange={(e) => handleChange("location", e.target.value)}
                    className="w-full bg-black/30 text-gray-100 p-2 rounded mt-1"
                  />
                ) : (
                  <p>{profile.location}</p>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="text-sm text-gray-400">Bio</label>
                {editing ? (
                  <textarea
                    value={profile.bio}
                    onChange={(e) => handleChange("bio", e.target.value)}
                    rows={3}
                    className="w-full bg-black/30 text-gray-100 p-2 rounded mt-1"
                  />
                ) : (
                  <p>{profile.bio}</p>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Eco Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-850 p-6 rounded-xl border border-gray-800 flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-400">Eco Score</p>
              <h3 className="text-3xl font-bold text-green-400">
                {profile.ecoScore}
              </h3>
            </div>
            <Star className="text-green-400 w-10 h-10" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-850 p-6 rounded-xl border border-gray-800 flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-gray-400">Carbon Saved</p>
              <h3 className="text-3xl font-bold text-teal-400">
                {profile.carbonSaved} kg
              </h3>
            </div>
            <Leaf className="text-teal-400 w-10 h-10" />
          </motion.div>
        </div>

        {/* Achievements */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-850 p-6 rounded-xl border border-gray-800 mb-8"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Award className="text-yellow-400" /> Achievements
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              "Plastic-Free Hero",
              "Solar Supporter",
              "Tree Planter",
              "Vegan Explorer",
            ].map((badge) => (
              <div
                key={badge}
                className="bg-black/30 p-4 rounded-lg text-center border border-gray-800 hover:scale-105 transition"
              >
                <p className="text-green-400 font-semibold">{badge}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Settings */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-850 p-6 rounded-xl border border-gray-800"
        >
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Settings className="text-blue-400" /> Preferences
          </h3>
          <div className="flex flex-col gap-4">
            <label className="flex items-center justify-between bg-black/30 p-3 rounded-md">
              <span className="flex items-center gap-2">
                <Bell className="text-green-400" /> Notifications
              </span>
              <input
                type="checkbox"
                defaultChecked
                className="accent-green-400 w-5 h-5"
              />
            </label>

            <label className="flex items-center justify-between bg-black/30 p-3 rounded-md">
              <span className="flex items-center gap-2">
                <Shield className="text-teal-400" /> Privacy Mode
              </span>
              <input type="checkbox" className="accent-teal-400 w-5 h-5" />
            </label>
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default ProfilePage;
