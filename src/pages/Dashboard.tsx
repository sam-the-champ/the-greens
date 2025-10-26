import React, { useState } from "react";
import {
  Leaf,
  AlertTriangle,
  Menu,
  X,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import ScoreCircle from "../components/ScoreCircle";
import Navbar from "../components/Navbar";


// Button and Card components as before
// ... (keep your Button, Card, CardHeader, CardTitle, CardContent definitions)
// Button Component
interface ButtonProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}
export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  onClick,
}) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 rounded-lg font-medium transition-transform transform hover:scale-105 bg-linear-to-r from-green-400 to-teal-400 shadow-lg text-black ${className}`}
  >
    {children}
  </button>
);

// Card Components
interface CardProps {
  children: React.ReactNode;
  className?: string;
  bgGradient?: string;
}
export const Card: React.FC<CardProps> = ({
  children,
  className,
  bgGradient,
}) => (
  <div
    className={`shadow-lg rounded-xl p-5 ${
      bgGradient || "bg-gray-900"
    } ${className}`}
  >
    {children}
  </div>
);

export const CardHeader: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => <div className="border-b border-gray-700 pb-2 mb-2">{children}</div>;

export const CardTitle: React.FC<{
  children: React.ReactNode;
  color?: string;
}> = ({ children, color }) => (
  <h3 className={`text-md font-semibold ${color || "text-gray-200"}`}>
    {children}
  </h3>
);

export const CardContent: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={`text-sm text-gray-300 ${className}`}>{children}</div>
);
// Data
const lineData = [
  { month: "Jan", score: 45 },
  { month: "Feb", score: 52 },
  { month: "Mar", score: 58 },
  { month: "Apr", score: 65 },
  { month: "May", score: 72 },
  { month: "Jun", score: 76 },
];

const userScore = 65;




// Sidebar
const Sidebar: React.FC<{ isOpen: boolean; toggle: () => void }> = ({
  isOpen,
  toggle,
}) => (
  <>
    {/* Overlay for mobile */}
    {isOpen && (
      <div
        onClick={toggle}
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
      ></div>
    )}
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: isOpen || window.innerWidth >= 1024 ? 0 : -300 }}
      transition={{ type: "spring", stiffness: 200, damping: 25 }}
      className="fixed lg:relative top-0 left-0 h-screen w-60 bg-linear-to-b from-gray-900 via-gray-800 to-gray-900 p-6 shadow-lg z-50 flex flex-col justify-between shrink-0 rounded-xl overflow-y-auto"
    >
      <div>
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center">
            <Leaf className="text-green-400 w-6 h-6" />
            <h1 className="text-lg font-bold text-gray-100">GreenScore</h1>
          </div>
          <X
            className="text-gray-400 cursor-pointer lg:hidden"
            onClick={toggle}
          />

        
        </div>
        <Navbar/>
        
      </div>

      <div className="mt-7 ">
        <img src="/let change.jpg" alt="" />
      </div>
      <div className="text-xs text-gray-500 text-center">© 2025 GreenScore</div>
    </motion.aside>
  </>
);

// Main Dashboard
const MainDashboard: React.FC<{ toggleSidebar: () => void }> = ({
  toggleSidebar,
}) => (
  <main className="flex-1 bg-gray-900 p-4 sm:p-6 min-h-screen overflow-y-auto rounded-xl">
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3 lg:hidden">
        <Menu
          className="text-gray-400 cursor-pointer"
          onClick={toggleSidebar}
        />
        <h2 className="text-xl font-bold text-gray-100">
          Your Environmental Impact
        </h2>
      </div>
      <div className="hidden lg:flex">
        <h2 className="text-xl font-bold text-gray-100">
          Your Environmental Impact
        </h2>
      </div>
      <Button>Add Activity</Button>
    </div>

    {/* Stats Cards */}
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      {/* Radial Carbon Score */}
      <Card
        className="flex flex-col items-center justify-center "
        bgGradient="bg-gradient-to-r from-gray-800 to-gray-700"
      >
        <CardHeader>
          <CardTitle color="text-green-400">Carbon Score</CardTitle>
        </CardHeader>
        <div className="flex flex-col items-center justify-center">
          <ResponsiveContainer width={120} height={120}>
            <ScoreCircle score={userScore} />
          </ResponsiveContainer>
        </div>
      </Card>

      <Card bgGradient="bg-gradient-to-r from-gray-800 to-gray-700">
        <CardHeader>
          <CardTitle color="text-teal-400">CO₂ Saved</CardTitle>
        </CardHeader>
        <CardContent className="text-lg font-bold text-teal-400">
          48kg
        </CardContent>
      </Card>
    </div>

    {/* Line Chart */}
    <Card bgGradient="bg-gray-800 mb-6">
      <CardHeader>
        <CardTitle color="text-teal-400">
          Monthly Green Score Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={lineData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1c1c1c" />
            <XAxis dataKey="month" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1c1c1c",
                borderRadius: "6px",
                color: "#e5e7eb",
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#16a34a"
              strokeWidth={3}
              isAnimationActive
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
    <Card bgGradient="bg-gray-800 mb-6">
      <CardHeader>
        <CardTitle color="text-teal-400">Monthly Green Score Update</CardTitle>
      </CardHeader>
      <CardContent>
          <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.youtube.com/embed/8q7_aV8eLUE?si=7gZUJnfofHcQAqKx"
              title="climate updates"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
      </CardContent>
    </Card>


    {/* Recent Actions & Alerts */}
    <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-4">
      <Card bgGradient="bg-gray-800">
        <CardHeader>
          <CardTitle color="text-teal-400">
            Recent Eco-Friendly Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-7">
            <li>🌱 Bike to work instead of driving</li>
            <li>🔋 Use solar energy for a day</li>
            <li>♻️ Recycle your plastic waste</li>
            <li>🥗 Eat 3 plant-based meals</li>
          </ul>
        </CardContent>
      </Card>
      <Card bgGradient="bg-gray-800">
        <CardHeader>
          <CardTitle color="text-yellow-400">
            Eco Alerts & Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-yellow-400 mb-3 ">
            <AlertTriangle size={16} /> High CO₂ emission day tomorrow
          </div>
          <div className="text-gray-300 text-sm">
            Tip: Reduce electricity usage and avoid unnecessary travel.
          </div>
        </CardContent>
      </Card>
      <div className="h-4">

      </div>
    </div>
  </main>
);

// Dashboard Wrapper
const GreenScoreDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-gray-900 overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggle={toggleSidebar} />
      <MainDashboard toggleSidebar={toggleSidebar} />
    </div>
  );
};



export default GreenScoreDashboard;
