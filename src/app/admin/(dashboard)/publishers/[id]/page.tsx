"use client";

import { useState, useEffect } from "react";
import {
  Building2,
  ArrowLeft,
  Edit2,
  Trash2,
  Save,
  X,
  Monitor,
  MapPin,
  ExternalLink,
  Plus,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function PublisherDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [publisher, setPublisher] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`/api/admin/publishers/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        setPublisher(data);
        setEditForm({
          name: data.name,
        });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch publisher details:", err);
        setLoading(false);
      });
  }, [params.id]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/publishers/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      if (res.ok) {
        const updated = await res.json();
        setPublisher({ ...publisher, ...updated });
        setIsEditing(false);
      } else {
        const data = await res.json();
        alert(data.error || "Failed to update publisher");
      }
    } catch (error) {
      console.error("Error updating publisher:", error);
      alert("Failed to update publisher");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/publishers/${params.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/admin/publishers");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete publisher");
      }
    } catch (error) {
      console.error("Error deleting publisher:", error);
      alert("Failed to delete publisher");
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="h-64 bg-zinc-100 rounded-[40px]" />
          <div className="h-64 bg-zinc-100 rounded-[40px]" />
          <div className="h-64 bg-zinc-100 rounded-[40px]" />
        </div>
      </div>
    );
  }

  if (!publisher) {
    return (
      <div className="p-12 text-center">
        <h1 className="text-2xl font-black">Publisher not found</h1>
        <Link href="/admin/publishers" className="text-[#FF00FF] font-bold underline">Back to Partner Network</Link>
      </div>
    );
  }

  return (
    <div className="p-12 max-w-[1600px] mx-auto w-full">
      <Link
        href="/admin/publishers"
        className="flex items-center gap-2 text-zinc-400 hover:text-zinc-900 transition-colors mb-8 group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
        <span className="text-xs font-bold uppercase tracking-[0.2em]">Partner Network</span>
      </Link>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center">
              <Building2 className="text-white" size={24} />
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-zinc-50 text-zinc-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                Active Partner
              </span>
              <span className="text-zinc-300 text-xs font-black uppercase tracking-widest">ID: {publisher.id}</span>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-4 max-w-xl">
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-900 uppercase italic bg-zinc-50 border-b-2 border-zinc-200 outline-none focus:border-[#FF00FF] w-full"
                placeholder="Publisher Name"
              />
            </div>
          ) : (
            <h1 className="text-6xl font-black tracking-tighter text-zinc-900 uppercase italic leading-none">
              {publisher.name}
            </h1>
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
                className="h-14 px-8 bg-[#FF00FF] text-white rounded-2xl flex items-center gap-2 font-bold hover:bg-[#CC00CC] transition-all shadow-xl shadow-[#FF00FF]/20 active:scale-95 disabled:opacity-50"
              >
                <Save size={20} /> {saving ? "Saving..." : "Save Changes"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="h-14 w-14 border border-zinc-100 text-zinc-400 rounded-2xl flex items-center justify-center hover:bg-zinc-50 transition-colors"
                title="Edit Publisher Name"
              >
                <Edit2 size={20} />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="h-14 w-14 border border-red-100 text-red-500 rounded-2xl flex items-center justify-center hover:bg-red-50 transition-colors"
                title="Delete Publisher"
              >
                <Trash2 size={20} />
              </button>
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
              <h3 className="text-3xl font-black tracking-tighter text-zinc-900 mb-4 uppercase italic">Delete Partner?</h3>
              <p className="text-zinc-500 font-medium leading-relaxed mb-8">
                This action will permanently remove <span className="text-zinc-900 font-black">{publisher.name}</span> from the network. This cannot be undone.
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

      <div className="grid grid-cols-1 gap-12">
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#FF00FF]/5 rounded-xl flex items-center justify-center">
                <Monitor className="text-[#FF00FF]" size={20} />
              </div>
              <h2 className="text-2xl font-black uppercase italic tracking-tight">Owned Screens</h2>
            </div>
            <Link
              href="/admin/screens/add"
              className="text-xs font-black text-[#FF00FF] hover:underline uppercase tracking-widest flex items-center gap-2"
            >
              Connect New Screen <Plus size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {publisher.screens?.map((screen: any, index: number) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                key={screen.id}
              >
                <Link
                  href={`/admin/screens/${screen.id}`}
                  className="group block bg-white border border-zinc-100 p-8 rounded-[40px] shadow-sm hover:shadow-xl transition-all"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 bg-zinc-50 rounded-xl flex items-center justify-center group-hover:bg-[#FF00FF]/5 transition-colors">
                      <Monitor className="text-zinc-900 group-hover:text-[#FF00FF] transition-colors" size={24} />
                    </div>
                    <ArrowRight size={20} className="text-zinc-200 group-hover:text-zinc-900 transition-colors" />
                  </div>
                  <h3 className="text-xl font-black text-zinc-900 mb-2 truncate uppercase italic">{screen.name}</h3>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <MapPin size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-tight truncate">{screen.location || "No location set"}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
            {(!publisher.screens || publisher.screens.length === 0) && (
              <div className="col-span-full border-2 border-dashed border-zinc-100 rounded-[40px] p-20 text-center bg-zinc-50/50">
                <p className="text-zinc-300 font-bold uppercase tracking-widest text-xs">No Screens Connected to this Publisher</p>
                <Link href="/admin/screens/add" className="text-[#FF00FF] font-black uppercase text-[10px] mt-4 tracking-widest block hover:underline">
                  Connect Now →
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
