"use client";
import React, { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import {
  History, Search, Download, Filter,
  Hash, Clock, CheckCircle2, XCircle,
  ArrowRightLeft
} from "lucide-react";
import api from "@/app/Api_instance/api";
import { AdminSidebar } from "@/app/components/Slidebar";
import { toast } from "sonner";

export default function AdminLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Fetching from your ordered meals endpoint
        const res = await api.get("/mealsOrdered");
        setLogs(res.data);
      } catch (err) {
        toast.error("Failed to sync live logs");
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  useEffect(() => {
    if (!loading) {
      gsap.fromTo(".log-row",
        { opacity: 0, x: -10 },
        { opacity: 1, x: 0, stagger: 0.03, duration: 0.4, ease: "power2.out", clearProps: "all" }
      );
    }
  }, [loading, filter, search]);

  const filteredLogs = logs.filter(log => {
    // Use (log.property || "") to ensure we always have a string before calling toLowerCase
    const orderCode = (log.bookingRef || "").toLowerCase();
    const customerName = (log.customerName || "").toLowerCase();
    const searchLower = search.toLowerCase();

    const matchesSearch = orderCode.includes(searchLower) ||
      customerName.includes(searchLower);

    const matchesFilter = filter === "All" || log.status === filter;

    return matchesSearch && matchesFilter;
  });

  const exportData = () => {
    toast.success("Preparing monthly report for download...");
    // Logic for CSV export would go here
  };

  return (
    <div ref={containerRef} className="flex min-h-screen bg-[#050505] text-[#fafafa] font-sans">
      <AdminSidebar />

      <main className="flex-1 ml-16 md:ml-20 p-4 md:p-10 overflow-x-hidden overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter italic leading-none">
              Live <span className="text-orange-500">Logs</span>
            </h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-2">
              Auditing the flow of surplus food
            </p>
          </div>

          <button
            onClick={exportData}
            className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 hover:text-[#fafafa] transition-all shadow-xl"
          >
            <Download size={14} /> Export Monthly Data
          </button>
        </header>

        {/* --- FILTERS --- */}
        <div className="flex flex-col xl:flex-row gap-4 mb-8 w-full">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#404040]" size={18} />
            <input
              className="w-full bg-[#0d0d0d] border border-white/5 p-4 pl-14 rounded-2xl outline-none focus:border-orange-500/50 transition-all font-bold text-sm"
              placeholder="Search Order Code or Student Name..."
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap bg-[#0d0d0d] p-1.5 rounded-2xl border border-white/5 gap-1">
            {["All", "Pre-booked", "Collected"].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filter === t ? 'bg-orange-500 text-[#fafafa] shadow-lg shadow-orange-500/20' : 'text-gray-500 hover:text-[#fafafa]'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* --- LOG TABLE --- */}
        <div className="bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] overflow-x-auto shadow-2xl">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-white/[0.02] border-b border-white/5">
              <tr>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Transaction ID</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Details</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500">Status</th>
                <th className="p-6 text-[10px] font-black uppercase tracking-widest text-gray-500 text-right">Verification Code</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id} className="log-row border-b border-white/[0.02] hover:bg-white/[0.01] transition-colors">
                  <td className="p-6 font-mono text-[11px] text-[#404040]">
                    #TX-{log.id.toString().padStart(5, '0')}
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-white/5 rounded-lg text-orange-500">
                        <ArrowRightLeft size={14} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#fafafa]">{log.mealName}</p>
                        <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tighter">
                          {log.customerName} @ {log.hotelName}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <StatusBadge status={log.status || "Collected"} />
                  </td>
                  <td className="p-6 text-right">
                    <div className="inline-flex items-center gap-2 bg-[#141414] border border-white/5 px-4 py-2 rounded-xl group hover:border-orange-500/50 transition-all cursor-help">
                      <Hash size={12} className="text-orange-500" />
                      <span className="font-mono font-black text-xs text-[#fafafa] tracking-widest">
                        {log.bookingRef || "N/A"}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredLogs.length === 0 && (
            <div className="py-24 text-center border-t border-white/5 bg-white/[0.01]">
              <History size={40} className="mx-auto mb-4 text-[#202020]" />
              <p className="text-[10px] font-black text-[#404040] uppercase tracking-[0.3em]">No Transactions Found</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    "Pre-booked": "bg-blue-500/10 text-blue-400 border-blue-500/20 icon-clock",
    "Collected": "bg-green-500/10 text-green-400 border-green-500/20 icon-check",
    "Expired": "bg-red-500/10 text-red-400 border-red-500/20 icon-x"
  };

  const currentStyle = styles[status] || styles["Collected"];

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${currentStyle}`}>
      <div className={`w-1 h-1 rounded-full bg-current`} />
      <span className="text-[9px] font-black uppercase tracking-widest">{status}</span>
    </div>
  );
}