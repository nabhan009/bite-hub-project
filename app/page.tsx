"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter();

  useEffect(() => {

    const storedUser = localStorage.getItem("bitehub_user");

    // No user logged in
    if (!storedUser) {
      router.push("/Login");
      return;
    }

    const user = JSON.parse(storedUser);

    //  Hotel Owner
    if (user.role === "hotel") {
      router.push("/HotelDashboard");
    }

    //  Student
    else if (user.role === "student") {
      router.push("/studentHome");
    }

    //  Unknown role
    else {
      router.push("/Login");
    }

  }, []);

  // Loading screen while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] text-white">
      <h1 className="text-4xl font-black italic tracking-tighter">
        Redirecting to <span className="text-orange-500">BiteHub...</span>
      </h1>
    </div>
  );
}
