"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import api from "@/app/Api_instance/api";
import { toast } from "sonner";
import {
  PlusCircle,
  Image as ImageIcon,
  MapPin,
  Clock,
  IndianRupee,
  ArrowLeft,
  Loader2,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export default function AddMealPage() {
  const router = useRouter();
  const containerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    hotelName: "",
    foodName: "",
    price: "",
    restaurantId: "",
    type: "veg",
    images: [""],
    expiryTime: "1",
  });

  // Entrance Animation
  useGSAP(
    () => {
      gsap.from(".animate-item", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power4.out",
      });
    },
    { scope: containerRef },
  );

  ///convert hours to ISO string for expiry time
  const convertToExpiryISO = (hours: number) => {
    const now = new Date(); // current time
    now.setHours(now.getHours() + hours); // add hours
    return now.toISOString(); // convert to ISO format
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const loggedUser =
      typeof window !== "undefined"
        ? JSON.parse(localStorage.getItem("bitehub_user") || "null")
        : null;

    // NOT LOGGED IN
    if (!loggedUser?.id) {
      toast.error("Restaurant not logged in!");
      setLoading(false);
      return;
    }

    // LOCATION NOT ADDED
    if (!loggedUser?.lat || !loggedUser?.lng) {
      toast.error("Please add your restaurant location before adding meals!.on your profile page");
      router.push("/HotelProfile"); // Redirect to profile page
      setLoading(false);
      return;
    }

    try {
      await api.post("/meals", {
        ...formData,
        image: formData.images[0] || "",
        restaurantId: loggedUser.id,
        restaurantLat: loggedUser.lat,   // save location in meal also 
        restaurantLng: loggedUser.lng,
        price: Number(formData.price),
        expiryTime: convertToExpiryISO(Number(formData.expiryTime)),
        id: Math.random().toString(36).substring(2, 9)
      });

      toast.success("Meal published to BiteHub!");
      router.push("/studentMeals");
    } catch (err) {
      toast.error("Failed to add meal");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#050505] text-[#fafafa] pt-10 pb-20 px-6"
    >
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.back()}
          className="animate-item flex items-center gap-2 text-gray-500 hover:text-[#fafafa] transition-colors mb-10 text-[10px] font-black uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* LEFT: INPUT FORM (7 Cols) */}
          <div className="lg:col-span-7 space-y-10">
            <div className="animate-item">
              <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-none">
                List a <br /> <span className="text-orange-500">New Meal</span>
              </h1>
              <p className="text-gray-600 uppercase tracking-[0.4em] text-[10px] mt-4 font-bold flex items-center gap-2">
                <Sparkles size={14} className="text-orange-500" /> Share your
                excess food with students
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="animate-item bg-[#0d0d0d] border border-white/5 p-8 md:p-12 rounded-[3rem] space-y-8 shadow-2xl"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 italic">
                    Hotel Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="The Grand Kitchen"
                    className="input-style"
                    onChange={(e) =>
                      setFormData({ ...formData, hotelName: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 italic">
                    Dish Name
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Chicken Mandi"
                    className="input-style"
                    onChange={(e) =>
                      setFormData({ ...formData, foodName: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 italic">
                    Price (₹)
                  </label>
                  <input
                    required
                    type="number"
                    placeholder="150"
                    className="input-style"
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 italic">
                    Type
                  </label>
                  <select
                    className="input-style appearance-none"
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value as any })
                    }
                  >
                    <option value="veg" className="bg-[#0d0d0d]">
                      Veg
                    </option>
                    <option value="non-veg" className="bg-[#0d0d0d]">
                      Non-Veg
                    </option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1 italic">
                  Image URLs (First image is primary)
                </label>
                {formData.images.map((img, idx) => (
                  <div key={idx} className="flex gap-3">
                    <input
                      required
                      type="url"
                      placeholder="https://unsplash.com/your-food-image"
                      className="input-style"
                      value={img}
                      onChange={(e) => {
                        const newImages = [...formData.images];
                        newImages[idx] = e.target.value;
                        setFormData({ ...formData, images: newImages });
                      }}
                    />
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const newImages = formData.images.filter((_, i) => i !== idx);
                          setFormData({ ...formData, images: newImages });
                        }}
                        className="bg-red-500/10 text-red-500 px-6 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-red-500 hover:text-[#fafafa] transition-all"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, images: [...formData.images, ""] })}
                  className="text-orange-500 text-[10px] font-black uppercase tracking-widest hover:text-[#fafafa] transition-colors flex items-center gap-2 mt-2"
                >
                  <PlusCircle size={14} /> Add Another Image
                </button>
              </div>

              <div className="space-y-2">
                <select
                  className="input-style"
                  onChange={(e) =>
                    setFormData({ ...formData, expiryTime: e.target.value })
                  }
                >
                  <option value="1">1 Hour</option>
                  <option value="2">2 Hours</option>
                  <option value="3">3 Hours</option>
                  <option value="4">4 Hours</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 py-6 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-orange-500 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-orange-600/20"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <PlusCircle size={18} /> Publish Meal
                  </>
                )}
              </button>
            </form>
          </div>

          {/* RIGHT: LIVE PREVIEW (5 Cols) */}
          <div className="lg:col-span-5 animate-item sticky top-32">
            <h3 className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-6 italic text-center">
              Live Preview
            </h3>

            {/* The actual meal card UI used in StudentMeals */}
            <div className="bg-[#0d0d0d] border border-orange-500/30 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
              <div className="relative h-64 w-full bg-neutral-900 flex items-center justify-center overflow-hidden">
                {formData.images[0] ? (
                  <img
                    src={formData.images[0]}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageIcon size={48} className="text-white/10" />
                )}
                {formData.images.length > 1 && (
                  <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-xl border border-white/5">
                    +{formData.images.length - 1} More
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span
                    className={`${formData.type === "veg" ? "bg-green-600" : "bg-red-600"} text-[9px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest`}
                  >
                    {formData.type}
                  </span>
                </div>
                <div className="absolute bottom-4 right-6 text-orange-500 font-black text-2xl drop-shadow-lg">
                  ₹{formData.price || "0"}
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                  <h3 className="text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">
                    {formData.hotelName || "RESTAURANT NAME"}
                  </h3>
                </div>
                <h2 className="text-3xl font-black uppercase italic leading-none mb-6">
                  {formData.foodName || "DISH TITLE"}
                </h2>
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Clock size={12} /> Ends in {formData.expiryTime || "--"}
                  </div>
                  <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center">
                    <ChevronRight size={16} />
                  </div>
                </div>
              </div>
            </div>

            <p className="text-[9px] text-gray-700 mt-6 text-center uppercase font-bold tracking-widest">
              * This is how students will see your post
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .input-style {
          width: 100%;
          background-color: #000;
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 1.25rem;
          border-radius: 1.25rem;
          outline: none;
          transition: all 0.3s;
          font-weight: 700;
          font-size: 0.875rem;
        }
        .input-style:focus {
          border-color: #f97316;
        }
      `}</style>
    </div>
  );
}
