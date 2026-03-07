"use client";
import React, { useEffect, useState } from "react";
import { gsap } from "gsap";
import { UserX, ShieldCheck, Trash2, Search, Users, Mail } from "lucide-react";
import api from "@/app/Api_instance/api";
import { AdminSidebar } from "@/app/components/Slidebar";
import { toast } from "sonner";

export default function StudentManagement() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchStudents = async () => {
    try {
      const res = await api.get("/users");
      let data = (res.data);
      data = data.filter((u: any) => u.role === "student");
      setStudents(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  useEffect(() => {
    if (!loading) {
      gsap.fromTo(".student-row",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, stagger: 0.05, clearProps: "all" }
      );
    }
  }, [loading, students]);

  const handleStatus = async (id: string, blocked: boolean) => {
    await api.patch(`/users/${id}`, { isBlocked: !blocked });
    toast.info(blocked ? "Student Access Restored" : "Student Access Restricted");
    fetchStudents();
  };

  const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex min-h-screen bg-[#050505] text-[#fafafa]">
      <AdminSidebar />
      <main className="flex-1 ml-16 md:ml-20 p-4 md:p-10 overflow-x-hidden overflow-y-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-black uppercase tracking-tighter italic">Student <span className="text-orange-500">Directory</span></h1>
          <p className="text-gray-500 text-[10px] md:text-xs font-bold uppercase mt-2 tracking-widest">Manage community access and verification</p>
        </header>

        <div className="relative mb-6">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#404040]" size={18} />
          <input
            className="w-full bg-[#0d0d0d] border border-white/5 p-4 pl-14 rounded-2xl outline-none focus:border-orange-500/50 transition-all font-bold text-sm"
            placeholder="Search by student name..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="bg-[#0d0d0d] border border-white/5 rounded-[2rem] overflow-x-auto">
          <table className="w-full text-left min-w-[500px]">
            <thead className="bg-white/[0.02] border-b border-white/5">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase text-gray-500">Student Info</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-500">Status</th>
                <th className="p-6 text-[10px] font-black uppercase text-gray-500 text-right">Control</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} className="student-row border-b border-white/[0.02] hover:bg-white/[0.01]">
                  <td className="p-6 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 font-black">{s.name[0]}</div>
                    <div>
                      <p className="font-bold text-sm">{s.name}</p>
                      <p className="text-[10px] text-[#404040] flex items-center gap-1"><Mail size={10} /> {s.email}</p>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${s.isBlocked ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                      {s.isBlocked ? "Restricted" : "Verified"}
                    </span>
                  </td>
                  <td className="p-6 text-right space-x-2">
                    <button onClick={() => handleStatus(s.id, !!s.isBlocked)} className="p-2 bg-white/5 rounded-lg hover:bg-orange-500 transition-all">
                      {s.isBlocked ? <ShieldCheck size={16} /> : <UserX size={16} />}
                    </button>
                    <button onClick={() => { if (confirm("Delete student?")) api.delete(`/users/${s.id}`).then(fetchStudents) }} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-[#fafafa] transition-all">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}