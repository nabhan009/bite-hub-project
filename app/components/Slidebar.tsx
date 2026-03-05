// "use client";
// import { LayoutDashboard, Hotel, Users, History, Settings, LogOut } from "lucide-react";
// import Link from "next/link";
// import { useAuth } from "@/app/(auth)/Context";

// export const AdminSidebar = () => {
//   const menu = [
//     { name: "Overview", icon: <LayoutDashboard size={20} />, path: "/AdminDashboard" },
//     { name: "Hotels", icon: <Hotel size={20} />, path: "/HotelsManagment" },
//     { name: "Students", icon: <Users size={20} />, path: "/StudentManagement" },
//     { name: "Logs", icon: <History size={20} />, path: "/logs" },
//   ];
//   const {logout} = useAuth();

//   return (
//     <aside className="w-64 min-h-screen bg-[#0d0d0d] border-r border-white/5 p-6 flex flex-col">
//       <div className="mb-10 px-2">
//         <h2 className="text-xl font-black italic text-orange-500 uppercase">Admin<span className="text-white">Hub</span></h2>
//       </div>

//       <nav className="flex-1 space-y-2">
//         {menu.map((item) => (
//           <Link key={item.name} href={item.path} className="flex items-center gap-4 px-4 py-3 rounded-xl text-[#737373] hover:bg-orange-500/10 hover:text-orange-500 transition-all font-bold text-xs uppercase tracking-widest">
//             {item.icon}
//             {item.name}
//           </Link>
//         ))}

//       <button
//       onClick={logout}
//        className="flex items-center gap-4 px-4 py-3 text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-500/10 rounded-xl transition-all">
//         <LogOut size={20} />
//         Logout
//       </button>
//       </nav>
//     </aside>
//   );
// };



"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { LayoutDashboard, Hotel, Users, History, LogOut, UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/app/(auth)/Context";
import { usePathname } from "next/navigation";

export const AdminSidebar = () => {
  const sidebarRef = useRef(null);
  const menuRef = useRef(null);
  const pathname = usePathname();
  const { logout } = useAuth();

  const menu = [
    { name: "Overview", icon: <LayoutDashboard size={20} />, path: "/AdminDashboard" },
    { name: "Hotels", icon: <Hotel size={20} />, path: "/HotelsManagment" },
    { name: "Students", icon: <Users size={20} />, path: "/StudentManagement" },
    { name: "Meals", icon: <UtensilsCrossed size={20} />, path: "/MealsManagement" },
    { name: "Logs", icon: <History size={20} />, path: "/logs" },
  ];

  const handleHover = (isEntering: boolean) => {
    // Animate Sidebar Width
    gsap.to(sidebarRef.current, {
      width: isEntering ? 256 : 80, // 64rem (w-64) to 20rem (w-20)
      duration: 0.4,
      ease: "expo.out",
    });

    // Animate Text Labels & Logo expansion
    gsap.to(".nav-label", {
      opacity: isEntering ? 1 : 0,
      x: isEntering ? 0 : -10,
      duration: 0.3,
      stagger: isEntering ? 0.05 : 0,
    });
  };

  return (
    <aside
      ref={sidebarRef}
      onMouseEnter={() => handleHover(true)}
      onMouseLeave={() => handleHover(false)}
      className="fixed left-0 top-0 h-screen w-20 bg-[#0d0d0d] border-r border-white/5 flex flex-col z-[100] transition-all overflow-hidden"
    >
      {/* Logo Area */}
      <div className="h-24 flex items-center px-6">
        <h2 className="text-xl font-black italic text-orange-500 uppercase flex items-center">
          B<span className="nav-label opacity-0 pointer-events-none">ITEHUB</span>
        </h2>
      </div>

      {/* Navigation */}
      <nav ref={menuRef} className="flex-1 px-4 space-y-2">
        {menu.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={`flex items-center gap-4 px-3 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest relative group ${pathname === item.path
                ? "bg-orange-500 text-white"
                : "text-[#737373] hover:bg-white/5 hover:text-white"
              }`}
          >
            <div className="min-w-[24px] flex justify-center">
              {item.icon}
            </div>
            <span className="nav-label opacity-0 whitespace-nowrap pointer-events-none">
              {item.name}
            </span>

            {/* Tooltip for collapsed state */}
            {!sidebarRef.current && (
              <div className="absolute left-16 bg-orange-600 text-white px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {item.name}
              </div>
            )}
          </Link>
        ))}
      </nav>

      {/* Logout at bottom */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={logout}
          className="w-full flex items-center gap-4 px-3 py-3 text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-500/10 rounded-xl transition-all"
        >
          <div className="min-w-[24px] flex justify-center">
            <LogOut size={20} />
          </div>
          <span className="nav-label opacity-0 whitespace-nowrap pointer-events-none">
            Logout
          </span>
        </button>
      </div>
    </aside>
  );
};