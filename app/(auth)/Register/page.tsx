"use client";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Link from "next/link";
import { useRouter } from "next/navigation";
import api from "@/app/Api_instance/api";

export default function Register() {
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const inputsRef = useRef<(HTMLElement | null)[]>([]);

  
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    isloggingIn: false
  });

  useEffect(() => {
    const tl = gsap.timeline();

    // 1. Split Text Animation for Title
    if (titleRef.current) {
      const text = titleRef.current.innerText;
      titleRef.current.innerHTML = text
        .split("")
        .map((char) => `<span class="inline-block char">${char === " " ? "&nbsp;" : char}</span>`)
        .join("");

      tl.fromTo(
        ".char",
        { opacity: 0, y: 20, rotateX: -90 },
        { opacity: 1, y: 0, rotateX: 0, stagger: 0.03, duration: 0.8, ease: "back.out(1.7)" }
      );
    }

    // 2. Form Container Entrance
    tl.fromTo(
      containerRef.current,
      { opacity: 0, y: 40, filter: "blur(10px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "expo.out" },
      "-=0.6"
    );

    // 3. Staggered Inputs Reveal
    const elements = inputsRef.current.filter(Boolean);
    tl.fromTo(
      elements,
      { opacity: 0, x: -10 },
      { opacity: 1, x: 0, stagger: 0.1, duration: 0.4, ease: "power2.out" },
      "-=0.4"
    );

    // 4. Ambient Background Glow
    gsap.to(glowRef.current, {
      y: "+=30",
      x: "-=20",
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  }, []);

  // --- Animation Helpers ---
  const handleTitleHover = (enter: boolean) => {
    gsap.to(".char", {
      color: enter ? "#f97316" : "#fafafa",
      y: enter ? -3 : 0,
      stagger: { amount: 0.2, from: "center" },
      duration: 0.3
    });
  };

  const handleInputFocus = (index: number, enter: boolean) => {
    gsap.to(`.label-tag-${index}`, {
      x: enter ? 4 : 0,
      color: enter ? "#f97316" : "#737373",
      duration: 0.3
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formData.password.length < 6) return alert("Password too short!");

      const checkUser = await api.get(`/users?email=${formData.email}`);
      if (checkUser.data.length > 0) return alert("User already exists!");

      const newUser = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
      };

      await api.post("/users", newUser);
      localStorage.setItem("bitehub_user", JSON.stringify(newUser));
      
      alert("Welcome to the mission!");
      router.push(newUser.role === "hotel" ? "/hotel-dashboard" : "/student-feed");
    } catch (err) {
      console.error(err);
      alert("Registration failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] relative overflow-hidden font-sans">
      {/* Background Glows */}
      <div ref={glowRef} className="absolute top-1/4 -right-20 w-96 h-96 bg-orange-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-orange-900/5 blur-[150px] rounded-full" />

      <div
        ref={containerRef}
        className="w-full max-w-md z-10 p-10 bg-[#0d0d0d] border border-white/[0.05] rounded-[2.5rem] shadow-2xl relative"
      >
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

        <div className="mb-10 text-center" onMouseEnter={() => handleTitleHover(true)} onMouseLeave={() => handleTitleHover(false)}>
          <h2 ref={titleRef} className="text-4xl font-black text-[#fafafa] tracking-tight mb-3 cursor-default">
            Create Account
          </h2>
          <p className="text-[#737373] text-xs font-bold uppercase tracking-[0.2em] opacity-70">
            Join the mission to end food waste
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          {[
            { label: "Full Name", type: "text", key: "name", placeholder: "John Doe" },
            { label: "Email", type: "email", key: "email", placeholder: "name@example.com" },
            { label: "Password", type: "password", key: "password", placeholder: "••••••••" }
          ].map((field, i) => (
            <div key={field.key} ref={(el) => { inputsRef.current[i] = el; }} className="space-y-2">
              <label className={`label-tag-${i} block text-xs font-black text-[#737373] uppercase tracking-widest ml-1`}>
                {field.label}
              </label>
              <input
                type={field.type}
                placeholder={field.placeholder}
                required
                className="w-full p-4 rounded-2xl bg-[#141414] border border-white/[0.03] text-white focus:border-orange-600 outline-none transition-all placeholder:text-[#333]"
                onFocus={() => handleInputFocus(i, true)}
                onBlur={() => handleInputFocus(i, false)}
                onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
              />
            </div>
          ))}

          <div ref={(el) => { inputsRef.current[3] = el; }} className="space-y-2">
            <label className="label-tag-3 block text-xs font-black text-[#737373] uppercase tracking-widest ml-1">I am a...</label>
            <select
              className="w-full p-4 rounded-2xl bg-[#141414] border border-white/[0.03] text-white focus:border-orange-600 outline-none appearance-none cursor-pointer transition-all"
              onFocus={() => handleInputFocus(3, true)}
              onBlur={() => handleInputFocus(3, false)}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="student">Student/Customer (Food Claimer)</option>
              <option value="hotel">Hotel / Restaurant (Provider)</option>
            </select>
          </div>

          <button ref={(el) => { inputsRef.current[4] = el; }} className="w-full mt-4 bg-orange-600 hover:bg-orange-500 text-white font-black py-4 rounded-2xl transition-all shadow-[0_10px_30px_rgba(234,88,12,0.2)] active:scale-95 uppercase tracking-widest text-sm">
            Sign Up
          </button>
        </form>

        <div className="mt-8 text-center">
          <Link href="/Login" className="text-[#737373] text-sm hover:text-orange-500 transition-colors inline-block group">
            Already have an account? <span className="text-orange-500 font-bold group-hover:underline underline-offset-4">Login</span>
          </Link>
        </div>
      </div>
    </div>
  );
}