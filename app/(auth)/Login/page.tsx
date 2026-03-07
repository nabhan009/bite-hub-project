"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "../../Api_instance/api";
import { toast } from "sonner"
import { useAuth } from "@/app/(auth)/Context";
export default function Login() {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  
  // const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  useEffect(() => {
    // 1. Split Text Animation on Load
    if (titleRef.current) {
      const text = titleRef.current.innerText;
      titleRef.current.innerHTML = text
        .split("")
        .map((char) => `<span class="inline-block char">${char === " " ? "&nbsp;" : char}</span>`)
        .join("");

      gsap.fromTo(
        ".char",
        { opacity: 0, y: 20, rotateX: -90 },
        { opacity: 1, y: 0, rotateX: 0, stagger: 0.03, duration: 0.8, ease: "back.out(1.7)" }
      );
    }

    // 2. Ambient background movement
    gsap.to(glowRef.current, {
      y: "+=20",
      x: "-=10",
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, []);

  // --- GSAP Text Hover Logic ---
  const handleTitleHover = (enter: boolean) => {
    gsap.to(".char", {
      color: enter ? "#f97316" : "#fafafa",
      y: enter ? -2 : 0,
      rotateY: enter ? 20 : 0,
      stagger: {
        amount: 0.2,
        from: "center"
      },
      duration: 0.3
    });
  };

  const handleInputFocus = (target: string, enter: boolean) => {
    gsap.to(`.label-${target}`, {
      x: enter ? 5 : 0,
      color: enter ? "#f97316" : "#737373",
      duration: 0.3,
      ease: "power2.out"
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  const res = await login(email, password);

  if (!res.success) {
    toast.error(res.message);
  } else {
    toast.success("Welcome to BiteHub!");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden font-sans">
      <div ref={glowRef} className="absolute top-1/4 -right-20 w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full" />

      <div ref={formRef} className="w-full max-w-md z-10 p-10 bg-[#0d0d0d] border border-white/[0.05] rounded-[2.5rem] shadow-2xl relative">
        <div className="mb-10 text-center" onMouseEnter={() => handleTitleHover(true)} onMouseLeave={() => handleTitleHover(false)}>
          <h2 ref={titleRef} className="text-4xl font-black text-[#fafafa] tracking-tight mb-3 cursor-default">
            Welcome Back
          </h2>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] opacity-70">
            Fueling students • Reducing waste
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="label-email block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              required
              onFocus={() => handleInputFocus("email", true)}
              onBlur={() => handleInputFocus("email", false)}
              className="w-full p-4 rounded-2xl bg-[#141414] border border-white/[0.03] text-[#fafafa] focus:border-orange-600 outline-none transition-all placeholder:text-[#333]"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="label-password block text-xs font-black text-gray-500 uppercase tracking-widest ml-1">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              required
              onFocus={() => handleInputFocus("password", true)}
              onBlur={() => handleInputFocus("password", false)}
              className="w-full p-4 rounded-2xl bg-[#141414] border border-white/[0.03] text-[#fafafa] focus:border-orange-600 outline-none transition-all placeholder:text-[#333]"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="w-full mt-4 bg-orange-600 hover:bg-orange-500 text-[#fafafa] font-black py-4 rounded-2xl transition-all shadow-[0_10px_30px_rgba(234,88,12,0.2)] active:scale-95 uppercase tracking-widest text-sm">
            Enter BiteHub
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/Register" className="text-gray-500 text-sm hover:text-orange-500 transition-colors inline-block group">
            New here? <span className="text-orange-500 font-bold group-hover:underline underline-offset-4">Create account</span>
          </Link>
        </div>
      </div>
    </div>
  );
}