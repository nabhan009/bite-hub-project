// import React from 'react'
// import Link from 'next/link'
// function Footer() {
//   return (
//     <div>
//     {/* --- FOOTER --- */}
//       <footer className="py-20 bg-[#080808] border-t border-white/5 text-center">
//         <h2 className="text-3xl font-black italic mb-10">BITE<span className="text-orange-500">HUB</span></h2>
//         <div className="flex flex-wrap justify-center gap-10 opacity-50 font-bold text-[10px] tracking-widest uppercase">
//           <Link href="studentHome">Home</Link>
//           <Link href="studentMeals">Meals</Link>
//           <Link href="studentAbout">About</Link>
//           <Link href="studentContact">Contact</Link>
//         </div>
//       </footer>

//     </div>
//   )
// }

// export default Footer




"use client";

import React, { useEffect, useRef ,useState} from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useAuth } from '../(auth)/Context';
/**
 * HOVER TEXT COMPONENT (Internal)
 * Handles the smooth GSAP rolling animation for links
 */
type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "student" | "hotel";
  isloggingIn?: boolean;
  createdAt?: string;
  mealsOrdered?: string[];
  preBookedMeals?: string[];
  pin?: string;
};

const FooterLink = ({ children, href }: { children: string; href: string }) => {
  const containerRef = useRef<HTMLAnchorElement>(null);
  useGSAP(() => {
    const defaultText = containerRef.current?.querySelector('[data-type="default"]');
    const hoverText = containerRef.current?.querySelector('[data-type="hover"]');

    if (!defaultText || !hoverText) return;

    const tl = gsap.timeline({ paused: true });

    tl.to(defaultText, { 
      y: '-100%', 
      opacity: 0, 
      duration: 0.4, 
      ease: 'power2.inOut' 
    }, 0)
    .fromTo(hoverText, 
      { y: '100%', opacity: 0 }, 
      { y: '0%', opacity: 1, duration: 0.4, ease: 'power2.inOut' }, 0);

    const enter = () => tl.play();
    const leave = () => tl.reverse();

    const el = containerRef.current;
    el?.addEventListener('mouseenter', enter);
    el?.addEventListener('mouseleave', leave);

    return () => {
      el?.removeEventListener('mouseenter', enter);
      el?.removeEventListener('mouseleave', leave);
    };
  }, { scope: containerRef });

  return (
    <Link 
      href={href}
      ref={containerRef}
      className="relative inline-block cursor-pointer overflow-hidden py-1"
    >
      <span 
        data-type="default" 
        className="block text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 transition-colors"
      >
        {children}
      </span>
      <span 
        data-type="hover" 
        className="absolute top-1 left-0 block text-[10px] font-bold tracking-[0.2em] uppercase text-orange-500 italic"
      >
        {children}
      </span>
    </Link>
  );
};

/**
 * MAIN FOOTER COMPONENT
 */
export default function Footer() {
      const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
    const storedUser = localStorage.getItem("bitehub_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  
  const links = [
    { name: 'Home', href: '/studentHome' },
    { name: 'Meals', href: '/studentMeals' },
    { name: 'About', href: '/studentAbout' },
    { name: 'Contact', href: '/studentContact' },
  ];
  const Ownerlinks = [
    { name: 'Dashboard', href: '/ownerHome' },
    { name: 'post', href: '/ownerMeals' },
    { name: 'History', href: '/ownerAbout' },
    { name: 'Contact', href: '/ownerContact' },
  ];

  return (
    <footer className="relative w-full bg-[#080808] py-20 border-t border-white/5 overflow-hidden">
      
      {/* Subtle Background Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />

      <div className="container mx-auto px-6 flex flex-col items-center">
        
        {/* Brand Logo */}
        <div className="mb-12 group cursor-default">
          <h2 className="text-4xl font-black italic tracking-tighter text-[#fafafa] transition-transform duration-500 group-hover:scale-105">
            BITE<span className="text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.3)]">HUB</span>
          </h2>
        </div>

        {/* Navigation with GSAP Hover Effect */}
        <nav className="flex flex-wrap justify-center gap-x-12 gap-y-6">
          {user?.role === "student" ? (
            links.map((link) => (
              <FooterLink key={link.name} href={link.href}>
                {link.name}
              </FooterLink>
            ))
          ) : (
            Ownerlinks.map((link) => (
              <FooterLink key={link.name} href={link.href}>
                {link.name}
              </FooterLink>
            ))
          )}
        </nav>

        {/* Bottom Details */}
        <div className="mt-20 flex flex-col items-center gap-4">
          <div className="h-px w-12 bg-white/10" />
          <p className="text-[9px] text-gray-600 font-medium uppercase tracking-[0.4em]">
            © 2026 BiteHub • Culinary Excellence
          </p>
        </div>

      </div>
    </footer>
  );
}