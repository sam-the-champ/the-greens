import React from 'react'
import {
  BarChart3,
  Settings,
  User,
  Globe2,
  ShoppingBag,
} from "lucide-react";

const Navbar = () => {
   const isActive = (path: string) => {
    return location.pathname === path;
  };
  const getNavItemClass = (path: string) => {
    return `${
      isActive(path)
        ? `text-[#2ecc71]  "text-opacity-100" : "text-opacity-100"}`
        : ` "text-gray-400" : "text-gray-500"} hover:text-[#2ecc71]`
    } transition-colors duration-200`;
  };
  return (
       <nav>
        <ul className="space-y-4 text-gray-300 font-medium ">
          <li className="flex items-center gap-3 cursor-pointer hover:text-green-400 transition-colors ">
            <BarChart3 size={18} className={getNavItemClass("/")}/> <a href="/" className={getNavItemClass("/")}>Dashboard</a>
          </li>
          <li className="flex items-center gap-3 cursor-pointer hover:text-green-400 transition-colors">
            <Globe2 size={18} className={getNavItemClass("/CarbonTracker")}/> <a href="/CarbonTracker"className={getNavItemClass("/CarbonTracker")}>Carbon Tracker</a>
          </li>
          <li className="flex items-center gap-3 cursor-pointer hover:text-green-400 transition-colors">
            <ShoppingBag size={18} className={getNavItemClass("/EcoMarket")}/><a href="/EcoMarket" className={getNavItemClass("/EcoMarket")}>Eco Market</a> 
          </li>
          <li className="flex items-center gap-3 cursor-pointer hover:text-coral-400 transition-colors">
            <User size={18} className={getNavItemClass("/Profile")}/><a href="/Profile" className={getNavItemClass("/Profile")}>Profile</a>
          </li>
          <li className="flex items-center gap-3 cursor-pointer hover:text-green-500 transition-colors">
            <Settings size={18} className={getNavItemClass("/Settings")}/><a href="/Settings" className={getNavItemClass("/Settings")}>Settings</a> 
          </li>
        </ul>
        </nav>
  )
}

export default Navbar
