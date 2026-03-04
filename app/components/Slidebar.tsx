"use client";
import { LayoutDashboard, Hotel, Users, History, Settings, LogOut } from "lucide-react";
import Link from "next/link";

const AdminSidebar = () => {
  const menu = [
    { name: "Overview", icon: <LayoutDashboard size={20} />, path: "/admin" },
    { name: "Hotels", icon: <Hotel size={20} />, path: "/admin/hotels" },
    { name: "Students", icon: <Users size={20} />, path: "/admin/students" },
    { name: "Logs", icon: <History size={20} />, path: "/admin/logs" },
    { name: "Settings", icon: <Settings size={20} />, path: "/admin/settings" },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#0d0d0d] border-r border-white/5 p-6 flex flex-col">
      <div className="mb-10 px-2">
        <h2 className="text-xl font-black italic text-orange-500 uppercase">Admin<span className="text-white">Hub</span></h2>
      </div>
      
      <nav className="flex-1 space-y-2">
        {menu.map((item) => (
          <Link key={item.name} href={item.path} className="flex items-center gap-4 px-4 py-3 rounded-xl text-[#737373] hover:bg-orange-500/10 hover:text-orange-500 transition-all font-bold text-xs uppercase tracking-widest">
            {item.icon}
            {item.name}
          </Link>
        ))}
      </nav>

      <button className="flex items-center gap-4 px-4 py-3 text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-500/10 rounded-xl transition-all">
        <LogOut size={20} />
        Logout
      </button>
    </aside>
  );
};