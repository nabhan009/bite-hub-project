"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
import { useAuth } from "../(auth)/Context";
import { useRouter } from "next/navigation";
import NavbarPersonalized from "../components/navbar";
import NavbarRestaurant from "../components/NavbarRestaurant";

// @ts-ignore
import Lenis from '@studio-freight/lenis';

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  const mainRef = useRef(null);
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // --- Smooth Scrolling (Lenis) ---
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0, 0)

    // --- Smooth fade-in for page loads ---
    gsap.fromTo(mainRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: "power2.out" }
    );

    return () => {
      lenis.destroy();
    };
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