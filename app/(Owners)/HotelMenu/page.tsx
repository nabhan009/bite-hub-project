"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, PlusCircle, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import api from "@/app/Api_instance/api";
import NavbarRestaurant from "@/app/components/NavbarRestaurant";
import Footer from "@/app/components/footer";

interface MenuItem {
    id: string;
    hotelId: string;
    foodName: string;
    price: number;
    type: "veg" | "non-veg";
    image: string;
    description: string;
}

export default function HotelMenuPage() {
    const router = useRouter();
    const [loggedUser, setLoggedUser] = useState<any>(null);
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        foodName: "",
        price: "",
        type: "veg",
        image: "",
        description: "",
    });

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("bitehub_user") || "null");
        if (!user || (user.role !== "hotel" && user.role !== "restaurant")) {
            router.push("/");
            return;
        }
        setLoggedUser(user);
        fetchMenu(user.id);
    }, []);

    const fetchMenu = async (hotelId: string) => {
        try {
            const res = await api.get(`/menus?hotelId=${hotelId}`);
            setMenuItems(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Failed to load menu");
        }
    };

    const handleAddMenu = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!loggedUser) return;
        setLoading(true);

        try {
            await api.post("/menus", {
                ...formData,
                hotelId: loggedUser.id,
                hotelName: loggedUser.hotelName,
                price: Number(formData.price),
                id: Math.random().toString(36).substring(2, 9)
            });
            toast.success("Menu item added successfully!");
            setFormData({
                foodName: "",
                price: "",
                type: "veg",
                image: "",
                description: "",
            });
            setShowForm(false);
            fetchMenu(loggedUser.id);
        } catch (err) {
            toast.error("Failed to add menu item");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (itemId: string) => {
        try {
            await api.delete(`/menus/${itemId}`);
            toast.success("Item removed");
            fetchMenu(loggedUser.id);
        } catch (err) {
            toast.error("Failed to delete item");
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] text-[#fafafa] pt-32 pb-20 px-4 md:px-10">
            <NavbarRestaurant />
            <div className="max-w-6xl mx-auto space-y-12">
                <header className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div className="space-y-4">
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic">
                            Menu <span className="text-orange-500">Manager</span>
                        </h1>
                        <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">
                            Manage your regular menu listings
                        </p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-black uppercase text-[10px] tracking-widest hover:bg-orange-500 hover:text-white transition-all shadow-xl"
                    >
                        {showForm ? "Cancel" : <><PlusCircle size={16} /> Add Item</>}
                    </button>
                </header>

                {showForm && (
                    <form onSubmit={handleAddMenu} className="bg-[#0d0d0d] border border-white/5 p-8 md:p-12 rounded-[3.5rem] shadow-2xl relative overflow-hidden">
                        <h3 className="text-2xl font-black uppercase tracking-tighter italic mb-8">Add New <span className="text-orange-500">Item</span></h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Food Name</label>
                                <input
                                    required
                                    type="text"
                                    className="w-full bg-black border border-white/5 p-4 rounded-2xl outline-none focus:border-orange-500 transition-all text-sm font-bold"
                                    value={formData.foodName}
                                    onChange={(e) => setFormData({ ...formData, foodName: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Price (₹)</label>
                                <input
                                    required
                                    type="number"
                                    className="w-full bg-black border border-white/5 p-4 rounded-2xl outline-none focus:border-orange-500 transition-all text-sm font-bold"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Type</label>
                                <select
                                    className="w-full bg-black border border-white/5 p-4 rounded-2xl outline-none focus:border-orange-500 transition-all text-sm font-bold uppercase"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value as "veg" | "non-veg" })}
                                >
                                    <option value="veg">Veg</option>
                                    <option value="non-veg">Non-Veg</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Image URL</label>
                                <input
                                    required
                                    type="url"
                                    className="w-full bg-black border border-white/5 p-4 rounded-2xl outline-none focus:border-orange-500 transition-all text-sm font-bold"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                />
                            </div>

                            <div className="md:col-span-2 space-y-2">
                                <label className="text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">Description</label>
                                <textarea
                                    required
                                    className="w-full bg-black border border-white/5 p-4 rounded-2xl outline-none focus:border-orange-500 transition-all text-sm font-bold resize-none h-24"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="mt-8 bg-orange-600 hover:bg-orange-500 w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all shadow-xl shadow-orange-500/20 disabled:opacity-50"
                        >
                            {loading ? "Adding..." : "Publish Menu Item"}
                        </button>
                    </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {menuItems.map(item => (
                        <div key={item.id} className="bg-[#0d0d0d] border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl group flex flex-col h-full">
                            <div className="relative h-48 sm:h-56 bg-black overflow-hidden shrink-0">
                                {item.image ? (
                                    <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-white/10"><ImageIcon size={48} /></div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />
                                <div className="absolute top-4 left-4">
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${item.type === 'veg' ? 'bg-green-500/10 border-green-500/20 text-green-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                                        {item.type}
                                    </span>
                                </div>
                            </div>
                            <div className="p-6 md:p-8 flex flex-col flex-1">
                                <h3 className="text-xl font-black uppercase tracking-tight mb-2 truncate">{item.foodName}</h3>
                                <p className="text-gray-500 text-xs line-clamp-2 mb-6 flex-1 italic">{item.description}</p>
                                <div className="flex items-center justify-between border-t border-white/5 pt-6">
                                    <span className="text-2xl font-black text-orange-500">₹{item.price}</span>
                                    <button onClick={() => handleDelete(item.id)} className="w-10 h-10 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {menuItems.length === 0 && !showForm && (
                        <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 bg-[#0d0d0d] rounded-[3rem] border border-dashed border-white/5">
                            <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">No menu items found. Add your first item!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
