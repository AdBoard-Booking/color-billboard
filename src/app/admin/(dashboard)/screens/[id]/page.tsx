"use client";

import { useState, useEffect } from "react";
import {
  Monitor,
  MapPin,
  Building2,
  ArrowLeft,
  Activity,
  BarChart3,
  History,
  ExternalLink,
  ChevronRight,
  Trash2,
  Edit2,
  Save,
  X,
  Link2
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ScreenDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [screen, setScreen] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    location: ""
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/screens/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setScreen(data);
        setEditForm({
          name: data.name,
          location: data.location || ""
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch screen details:", err);
        setLoading(false);
      });
  }, [params.id]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/screens/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const updated = await res.json();
        setScreen({ ...screen, ...updated });
        setIsEditing(false);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update screen");
      }
    } catch (error) {
      console.error("Error updating screen:", error);
      alert("Failed to update screen");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/screens/${params.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/admin/screens");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete screen");
      }
    } catch (error) {
      console.error("Error deleting screen:", error);
      alert("Failed to delete screen");
    } finally {
      setDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 animate-pulse">
        <div className="h-6 w-32 bg-zinc-100 rounded mb-8" />
        <div className="h-20 w-1/2 bg-zinc-100 rounded-3xl mb-12" />
        <div className="grid grid-cols-3 gap-8">
          <div className="h-64 bg-zinc-100 rounded-[40px]" />
          <div className="h-64 bg-zinc-100 rounded-[40px]" />
          <div className="h-64 bg-zinc-100 rounded-[40px]" />
        </div>
      </div>
    );
  }

  if (!screen) {
    return (
      <div className="p-12 text-center">
        <h1 className="text-2xl font-black">Screen not found</h1>
        <Link href="/admin/screens" className="text-[#0060FF] font-bold">Back to Inventory</Link>
      </div>
    );
  }

  return (
    <div className="p-12 max-w-[1600px] mx-auto w-full">
      <Link
        href="/admin/screens"
        className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors mb-8 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-[0.2em]">Inventory</span>
      </Link>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center">
              <Monitor className="text-white" size={24} />
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black uppercase tracking-widest rounded-full flex items-center gap-1.5">
                <Activity size={10} /> Live Now
              </span>
              <span className="text-zinc-300 text-xs font-black uppercase tracking-widest">ID: {screen.id}</span>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4 max-w-xl">
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-900 uppercase italic bg-zinc-50 border-b-2 border-zinc-200 outline-none focus:border-[#0060FF] w-full"
                placeholder="Screen Name"
              />
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                  <MapPin size={16} className="text-zinc-400" />
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                    className="bg-transparent outline-none w-full font-medium text-zinc-600"
                    placeholder="Location"
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <h1 className="text-6xl font-black tracking-tighter text-zinc-900 uppercase italic">
                {screen.name}
              </h1>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-zinc-500 font-medium">
                  <MapPin size={16} />
                  <span>{screen.location}</span>
                </div>
                <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                <div className="flex items-center gap-1.5 text-zinc-500 font-medium">
                  <Building2 size={16} />
                  <span>{screen.publisher?.name}</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex gap-4">
          {isEditing ? (
            <>
              <button
                onClick={() => setIsEditing(false)}
                className="h-14 px-6 bg-zinc-50 text-zinc-600 rounded-2xl flex items-center gap-2 font-bold hover:bg-zinc-100 transition-colors"
              >
                <X size={20} /> Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={saving}
                className="h-14 px-8 bg-[#0060FF] text-white rounded-2xl flex items-center gap-2 font-bold hover:bg-[#004ECC] transition-all shadow-xl shadow-[#0060FF]/20 active:scale-95 disabled:opacity-50"
              >
                <Save size={20} /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="h-14 w-14 border border-zinc-100 text-zinc-400 rounded-2xl flex items-center justify-center hover:bg-zinc-50 transition-colors"
                title="Edit Screen Info"
              >
                <Edit2 size={20} />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="h-14 w-14 border border-red-100 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-50 transition-colors"
                title="Delete Screen"
              >
                <Trash2 size={20} />
              </button>
              <Link
                href={`/billboard/${screen.id}`}
                target="_blank"
                className="h-14 px-8 bg-zinc-900 text-white rounded-2xl flex items-center gap-3 font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-zinc-900/10 active:scale-95"
              >
                <ExternalLink size={20} />
                Visit Billboard
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white p-10 rounded-[40px] shadow-2xl"
            >
              <h3 className="text-3xl font-black tracking-tighter text-zinc-900 mb-4 uppercase italic">Delete Screen?</h3>
              <p className="text-zinc-500 font-medium leading-relaxed mb-8">
                This action will permanently remove <span className="text-zinc-900 font-black">{screen.name}</span> from the inventory. This cannot be undone.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="w-full py-5 bg-red-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-red-600 transition-all active:scale-95 disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Confirm Deletion"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-full py-5 bg-zinc-50 text-zinc-900 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-zinc-100 transition-all active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Stats Card */}
        <div className="bg-white border border-zinc-100 p-10 rounded-[40px] shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#0060FF]/5 rounded-xl flex items-center justify-center">
              <BarChart3 className="text-[#0060FF]" size={20} />
            </div>
            <h3 className="text-lg font-black uppercase italic tracking-tight">Performance</h3>
          </div>
          <div className="space-y-6">
            <div>
              <p className="text-4xl font-black tracking-tighter text-zinc-900">{screen._count?.interactions || 0}</p>
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Total Splashes</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-zinc-50 rounded-2xl">
                <p className="text-xl font-black text-zinc-900">
                  {screen.avgLag !== null && screen.avgLag !== undefined
                    ? `${(screen.avgLag / 1000).toFixed(2)}s`
                    : 'N/A'}
                </p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Avg Latency</p>
              </div>
              <div className="p-4 bg-zinc-50 rounded-2xl">
                <p className={`text-xl font-black ${screen.missedRate !== null && screen.missedRate !== undefined
                  ? screen.missedRate === 0
                    ? 'text-green-600'
                    : screen.missedRate < 5
                      ? 'text-yellow-600'
                      : 'text-red-600'
                  : 'text-zinc-900'
                  }`}>
                  {screen.missedRate !== null && screen.missedRate !== undefined
                    ? `${screen.missedRate.toFixed(1)}%`
                    : 'N/A'}
                </p>
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">Missed Rate</p>
              </div>
            </div>
          </div>
        </div>



      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white border border-zinc-100 p-10 rounded-[40px] shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center">
              <History className="text-zinc-400" size={20} />
            </div>
            <h3 className="text-lg font-black uppercase italic tracking-tight">Recent Splashes</h3>
          </div>
          <div className="space-y-4">
            {screen.interactions?.map((event: any, i: number) => {
              // Calculate lag if both timestamps are available
              const lag = event.clickedAt && event.displayedAt
                ? new Date(event.displayedAt).getTime() - new Date(event.clickedAt).getTime()
                : null;

              // Check if event was missed (clicked but not displayed)
              const isMissed = event.clickedAt && !event.displayedAt;

              return (
                <div key={event.id} className={`flex items-center justify-between p-4 rounded-2xl group transition-colors ${isMissed ? 'bg-red-50 border border-red-100' : 'bg-zinc-50 hover:bg-zinc-100'
                  }`}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner" style={{ backgroundColor: event.color }}>
                      <div className="w-4 h-4 rounded-full bg-white/20 backdrop-blur-sm" />
                    </div>
                    <div>
                      <p className="text-sm font-black uppercase tracking-tight">{event.userName || "Anonymous"}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: event.color }} />
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{new Date(event.timestamp).toLocaleTimeString()}</p>
                        {isMissed && (
                          <>
                            <div className="w-1 h-1 bg-red-300 rounded-full" />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-red-600">
                              MISSED
                            </p>
                          </>
                        )}
                        {lag !== null && (
                          <>
                            <div className="w-1 h-1 bg-zinc-300 rounded-full" />
                            <p className={`text-[10px] font-bold uppercase tracking-widest ${lag < 1000 ? 'text-green-500' : lag < 2000 ? 'text-yellow-500' : 'text-red-500'}`}>
                              {lag}ms lag
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest group-hover:text-zinc-500 transition-colors">
                    {event.deviceHash?.substring(0, 8)}...
                  </div>
                </div>
              );
            })}
            {(!screen.interactions || screen.interactions.length === 0) && (
              <div className="p-20 text-center">
                <p className="text-zinc-300 font-bold uppercase tracking-widest text-xs">No Recent Activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
