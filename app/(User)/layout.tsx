"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
// import Navbar from "./components/navbar";
import { useAuth } from "../(auth)/Context";
import { useRouter } from "next/navigation";
import NavbarPersonalized from "../components/navbar";
import NavbarRestaurant from "../components/NavbarRestaurant";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const mainRef = useRef(null);
  const { user, loading } = useAuth();
const router = useRouter();

  useEffect(() => {
    // Smooth fade-in for any page that loads in this layout
    gsap.fromTo(mainRef.current, 
      { opacity: 0 }, 
      { opacity: 1, duration: 1, ease: "power2.out" }
    );
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/Login");
      } else if (user.role !== "student") {
        router.push("/HotelDashboard");
      }
    }
  }, [user, loading]);

  if (loading || !user) return null;

  return (
    <main ref={mainRef} className="bg-[#050505]">
      <NavbarPersonalized />
      {children}
    </main>
  );
}