"use client";
import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import { Hotel, Trash2, ShieldAlert, ShieldCheck, MapPin } from "lucide-react";
import api from "@/app/Api_instance/api";
import { AdminSidebar } from "@/app/components/Slidebar";
import { toast } from "sonner";

export default function HotelManagement() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHotels = async () => {
    try {
      const res = await api.get("/restaurants");
      setHotels(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHotels(); }, []);

  const toggleHotel = async (id: string, status: boolean) => {
    await api.patch(`/restaurants/${id}`, { isBlocked: !status });
    toast.success(status ? "Partner Activated" : "Partner Suspended");
    fetchHotels();
  };

  return (
    <div className="flex min-h-screen bg-[#050505] text-[#fafafa]">
      <AdminSidebar />
      <main className="flex-1 ml-16 md:ml-20 p-4 md:p-10 overflow-x-hidden overflow-y-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Partner <span className="text-orange-500">Network</span></h1>
          <p className="text-[#737373] text-[10px] md:text-xs font-bold uppercase mt-2 tracking-widest">Kozhikode Restaurant Audit & Control</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotels.map((h) => (
            <div key={h.id} className="bg-[#0d0d0d] border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group hover:border-orange-500/30 transition-all">
              <div className={`absolute top-0 right-0 w-1 h-full ${h.isBlocked ? 'bg-red-500' : 'bg-green-500'}`} />

              <div className="flex justify-between items-start mb-6">
                <div className="p-4 bg-white/5 rounded-2xl text-orange-500">
                  <Hotel size={24} />
                </div>
                <span className={`text-[9px] font-black uppercase tracking-widest ${h.isBlocked ? 'text-red-500' : 'text-green-500'}`}>
                  {h.isBlocked ? "Suspended" : "Live Partner"}
                </span>
              </div>

              <h2 className="text-2xl font-bold mb-1">{h.hotelName}</h2>
              <p className="text-[#737373] text-[10px] font-bold uppercase flex items-center gap-1 mb-8"><MapPin size={10} /> {h.address}</p>

              <div className="flex gap-3">
                <button
                  onClick={() => toggleHotel(h.id, !!h.isBlocked)}
                  className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${h.isBlocked ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-[#141414] text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white'}`}
                >
                  {h.isBlocked ? "Activate" : "Suspend"}
                </button>
                <button
                  onClick={() => { if (confirm("Remove Hotel?")) api.delete(`/restaurants/${h.id}`).then(fetchHotels) }}
                  className="p-3 bg-white/5 text-[#404040] hover:text-white hover:bg-red-500 rounded-xl transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}