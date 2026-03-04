"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Mail, Phone, MapPin, Send, Instagram, Twitter, Facebook } from "lucide-react";
import { toast } from "sonner";

export default function ContactPage() {
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Entrance animation for the layout
      tl.from(".contact-header", { 
        y: 100, 
        opacity: 0, 
        duration: 1, 
        ease: "power4.out" 
      })
      .from(".contact-info-item", { 
        x: -50, 
        opacity: 0, 
        stagger: 0.1, 
        duration: 0.8, 
        ease: "power3.out" 
      }, "-=0.5")
      .from(".contact-form", { 
        scale: 0.95, 
        opacity: 0, 
        duration: 1, 
        ease: "expo.out" 
      }, "-=0.8");

      // Magnetic effect for social icons
      const icons = document.querySelectorAll(".social-icon");
      icons.forEach((icon) => {
        icon.addEventListener("mousemove", (e: any) => {
          const { offsetX, offsetY, target } = e;
          const { clientWidth, clientHeight } = target;
          const x = (offsetX - clientWidth / 2) / 2;
          const y = (offsetY - clientHeight / 2) / 2;
          gsap.to(icon, { x, y, duration: 0.3 });
        });
        icon.addEventListener("mouseleave", () => {
          gsap.to(icon, { x: 0, y: 0, duration: 0.3 });
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-white p-6 pt-32 selection:bg-orange-500/30">
      <div className="max-w-7xl mx-auto">
        
        {/* --- HEADER --- */}
        <header className="contact-header mb-20 text-center lg:text-left">
          <h1 className="text-7xl md:text-9xl font-black uppercase tracking-tighter leading-none">
            Get In <br />
            <span className="text-orange-500 italic">Touch.</span>
          </h1>
          <p className="mt-6 text-gray-500 font-bold uppercase tracking-[0.4em] text-xs">
            Have a question? The BiteHub team is here to help.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          
          {/* --- LEFT: INFO --- */}
          <div className="space-y-12">
            <div className="contact-info-item group cursor-default">
              <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest mb-2 italic">/ Support Email</p>
              <h3 className="text-3xl md:text-4xl font-bold hover:text-orange-500 transition-colors">hello@bitehub.com</h3>
            </div>

            <div className="contact-info-item group cursor-default">
              <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest mb-2 italic">/ Call Us</p>
              <h3 className="text-3xl md:text-4xl font-bold">+1 (555) BITE-HUB</h3>
            </div>

            <div className="contact-info-item">
              <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest mb-2 italic">/ Office</p>
              <p className="text-xl text-gray-400 max-w-sm">
                123 Culinary Drive, <br />
                Foodie District, NY 10012
              </p>
            </div>

            {/* Social Icons */}
            <div className="contact-info-item flex gap-6 pt-10">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <div key={i} className="social-icon bg-[#0d0d0d] p-5 rounded-full border border-white/5 cursor-pointer hover:border-orange-500/50 transition-colors">
                  <Icon size={24} className="text-white" />
                </div>
              ))}
            </div>
          </div>

          {/* --- RIGHT: FORM --- */}
          <div className="contact-form bg-[#0d0d0d] p-10 md:p-16 rounded-[3rem] border border-white/5 relative shadow-2xl overflow-hidden">
            {/* Subtle glow background */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-600/10 blur-[100px] rounded-full" />
            
            <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Your Name</label>
                  <input type="text" required className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl outline-none focus:border-orange-500 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Email Address</label>
                  <input type="email" required className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl outline-none focus:border-orange-500 transition-all" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-600">Your Message</label>
                <textarea rows={5} required className="w-full bg-black/50 border border-white/10 p-4 rounded-2xl outline-none focus:border-orange-500 transition-all resize-none" />
              </div>

              <button className="w-full bg-orange-600 hover:bg-orange-500 text-white py-6 rounded-2xl font-black uppercase tracking-[0.3em] text-xs transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-orange-600/20">
                <Send size={16} /> Send Message
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}