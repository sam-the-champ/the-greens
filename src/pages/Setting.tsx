// SettingsPage.tsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Leaf,
  Menu,
  X,
  Bell,
  Lock,
  Shield,
  Palette,
  Save,
  Trash2,
  LogOut,
  Settings,
} from "lucide-react";
import Navbar from "../components/Navbar";

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

const SettingsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [accent, setAccent] = useState("green");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(false);
  const [privacy, setPrivacy] = useState({
    dataSharing: false,
    tracking: true,
  });

  const saveChanges = () => {
    alert("✅ Settings saved successfully!");
  };

  const accentColors = ["green", "teal", "blue", "purple", "pink", "orange"];

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <Sidebar isOpen={sidebarOpen} toggle={() => setSidebarOpen(false)} />

      <main className="flex-1 p-4 sm:p-6 lg:pl-6 overflow-y-auto min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Menu
              className="text-gray-400 cursor-pointer lg:hidden"
              onClick={() => setSidebarOpen(true)}
            />
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="text-green-400" /> Settings
            </h2>
          </div>
          <button
            onClick={saveChanges}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-teal-400 text-black px-4 py-2 rounded-md font-semibold hover:scale-105 transition"
          >
            <Save size={16} /> Save Changes
          </button>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {/* Account Settings */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-850 p-6 rounded-xl border border-gray-800 shadow-lg"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Lock className="text-blue-400" /> Account Settings
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Change Password
                </label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="w-full bg-black/30 p-3 rounded text-gray-100 border border-gray-700"
                />
              </div>

              <div className="flex flex-wrap gap-3 mt-3">
                <button className="flex items-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white">
                  <Trash2 size={16} /> Delete Account
                </button>
                <button className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md text-gray-100">
                  <LogOut size={16} /> Log Out
                </button>
              </div>
            </div>
          </motion.section>

          {/* Theme & Display */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-850 p-6 rounded-xl border border-gray-800"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Palette className="text-purple-400" /> Theme & Display
            </h3>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
              <label className="flex items-center gap-2">
                <span>Dark Mode</span>
                <input
                  type="checkbox"
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                  className="accent-green-400 w-5 h-5"
                />
              </label>

              <div>
                <p className="text-sm text-gray-400 mb-2">Accent Color</p>
                <div className="flex gap-3">
                  {accentColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setAccent(color)}
                      className={`w-6 h-6 rounded-full border-2 ${
                        accent === color ? "border-white" : "border-transparent"
                      } bg-${color}-500`}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* Notifications */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-850 p-6 rounded-xl border border-gray-800"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell className="text-yellow-400" /> Notifications
            </h3>
            <div className="space-y-4">
              <label className="flex justify-between items-center">
                <span>Email Alerts</span>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={() => setEmailAlerts(!emailAlerts)}
                  className="accent-green-400 w-5 h-5"
                />
              </label>
              <label className="flex justify-between items-center">
                <span>Push Notifications</span>
                <input
                  type="checkbox"
                  checked={pushAlerts}
                  onChange={() => setPushAlerts(!pushAlerts)}
                  className="accent-green-400 w-5 h-5"
                />
              </label>
            </div>
          </motion.section>

          {/* Privacy & Security */}
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-850 p-6 rounded-xl border border-gray-800"
          >
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Shield className="text-teal-400" /> Privacy & Security
            </h3>
            <div className="space-y-4">
              <label className="flex justify-between items-center">
                <span>Data Sharing</span>
                <input
                  type="checkbox"
                  checked={privacy.dataSharing}
                  onChange={() =>
                    setPrivacy({
                      ...privacy,
                      dataSharing: !privacy.dataSharing,
                    })
                  }
                  className="accent-green-400 w-5 h-5"
                />
              </label>

              <label className="flex justify-between items-center">
                <span>Activity Tracking</span>
                <input
                  type="checkbox"
                  checked={privacy.tracking}
                  onChange={() =>
                    setPrivacy({ ...privacy, tracking: !privacy.tracking })
                  }
                  className="accent-green-400 w-5 h-5"
                />
              </label>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
