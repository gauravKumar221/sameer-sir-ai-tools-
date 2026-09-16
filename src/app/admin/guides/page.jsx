'use client';
import React, { useEffect, useState } from 'react';
import { BookOpen, Plus, Search, Edit2, Trash2, FileText, Upload, X, ShieldCheck, Loader2 } from 'lucide-react';
export default function AdminGuidesPage() {
    const [guides, setGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [editingGuide, setEditingGuide] = useState(null);
    const [saving, setSaving] = useState(false);
    const [uploadingPdf, setUploadingPdf] = useState(false);
    const [formError, setFormError] = useState(null);
    // Form Fields
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('Web Development');
    const [price, setPrice] = useState(499);
    const [originalPrice, setOriginalPrice] = useState(1499);
    const [shortDescription, setShortDescription] = useState('');
    const [description, setDescription] = useState('');
    const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80');
    const [level, setLevel] = useState('Intermediate');
    const [previewPages, setPreviewPages] = useState(2);
    const [isActive, setIsActive] = useState(true);
    const [isFeatured, setIsFeatured] = useState(false);
    const [tags, setTags] = useState('Next.js, React, DRM');
    const [highlights, setHighlights] = useState('Production patterns\nSecurity best practices\nIn-depth examples');
    const [pdfFiles, setPdfFiles] = useState([]);
    const fetchGuides = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/guides');
            const data = await res.json();
            if (data.success && data.guides) {
                setGuides(data.guides);
            }
        }
        catch (err) {
            console.error('Error fetching admin guides:', err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchGuides();
    }, []);
    const openCreateModal = () => {
        setEditingGuide(null);
        setTitle('');
        setCategory('Web Development');
        setPrice(499);
        setOriginalPrice(1499);
        setShortDescription('');
        setDescription('');
        setCoverImage('https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80');
        setLevel('Intermediate');
        setPreviewPages(2);
        setIsActive(true);
        setIsFeatured(false);
        setTags('Next.js, Architecture');
        setHighlights('Architecture diagrams\nReal-world code samples\nDRM secured');
        setPdfFiles([]);
        setFormError(null);
        setModalOpen(true);
    };
    const openEditModal = (g) => {
        setEditingGuide(g);
        setTitle(g.title);
        setCategory(g.category);
        setPrice(g.price);
        setOriginalPrice(g.originalPrice || g.price * 2);
        setShortDescription(g.shortDescription);
        setDescription(g.description);
        setCoverImage(g.coverImage);
        setLevel(g.level || 'Intermediate');
        setPreviewPages(g.previewPages || 2);
        setIsActive(g.isActive ?? true);
        setIsFeatured(g.isFeatured ?? false);
        setTags(Array.isArray(g.tags) ? g.tags.join(', ') : '');
        setHighlights(Array.isArray(g.highlights) ? g.highlights.join('\n') : '');
        setPdfFiles(g.pdfFiles || []);
        setFormError(null);
        setModalOpen(true);
    };
    // Upload PDF file to secure non-public storage
    const handlePdfUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        setUploadingPdf(true);
        setFormError(null);
        const formData = new FormData();
        formData.append('file', file);
        try {
            const res = await fetch('/api/admin/guides/upload', {
                method: 'POST',
                body: formData,
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to upload PDF');
            }
            setPdfFiles((prev) => [
                ...prev,
                {
                    fileName: data.file.fileName,
                    fileKey: data.file.fileKey,
                    fileSize: data.file.fileSize,
                    pageCount: 5,
                    order: prev.length,
                },
            ]);
        }
        catch (err) {
            setFormError(err.message || 'PDF upload failed');
        }
        finally {
            setUploadingPdf(false);
        }
    };
    const handleRemovePdfFile = (index) => {
        setPdfFiles((prev) => prev.filter((_, i) => i !== index));
    };
    const handleSaveGuide = async (e) => {
        e.preventDefault();
        setSaving(true);
        setFormError(null);
        const payload = {
            title,
            category,
            price: Number(price),
            originalPrice: Number(originalPrice),
            shortDescription,
            description,
            coverImage,
            level,
            previewPages: Number(previewPages),
            isActive,
            isFeatured,
            tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
            highlights: highlights.split('\n').map((h) => h.trim()).filter(Boolean),
            pdfFiles,
        };
        try {
            const url = editingGuide ? `/api/admin/guides/${editingGuide._id}` : '/api/admin/guides';
            const method = editingGuide ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to save guide');
            }
            setModalOpen(false);
            fetchGuides();
        }
        catch (err) {
            setFormError(err.message || 'Error saving guide');
        }
        finally {
            setSaving(false);
        }
    };
    const handleDeleteGuide = async (id, guideTitle) => {
        if (!confirm(`Are you sure you want to delete "${guideTitle}"? This will remove all attached protected PDF files.`)) {
            return;
        }
        try {
            const res = await fetch(`/api/admin/guides/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                fetchGuides();
            }
            else {
                alert(data.error || 'Failed to delete');
            }
        }
        catch (err) {
            console.error('Delete error:', err);
        }
    };
    const filteredGuides = guides.filter((g) => g.title.toLowerCase().includes(search.toLowerCase()) ||
        g.category.toLowerCase().includes(search.toLowerCase()));
    return (<div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Course Guides Management</h1>
          <p className="text-xs text-slate-400 mt-1">
            Create, edit, attach encrypted PDF documents, and configure DRM reading parameters
          </p>
        </div>
        <button onClick={openCreateModal} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/20 transition-all hover:scale-105">
          <Plus className="h-4 w-4"/>
          <span>Add New Guide</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 max-w-md text-xs">
        <Search className="h-4 w-4 text-slate-400 mr-2 shrink-0"/>
        <input type="text" placeholder="Filter courses by title or category..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none"/>
      </div>

      {/* Guides Table */}
      {loading ? (<div className="py-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500"/>
        </div>) : (<div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Course Title</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">Price (₹)</th>
                  <th className="py-3.5 px-4 font-semibold">Sales</th>
                  <th className="py-3.5 px-4 font-semibold">PDF Files</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredGuides.map((g) => (<tr key={g._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white">
                      <div className="flex items-center gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={g.coverImage} alt={g.title} className="h-10 w-14 rounded-lg object-cover bg-slate-950 shrink-0"/>
                        <div className="min-w-0">
                          <span className="line-clamp-1 text-xs">{g.title}</span>
                          <span className="text-[10px] text-slate-500 font-mono">/{g.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="rounded bg-slate-800 px-2 py-0.5 text-[11px] font-medium text-slate-300">
                        {g.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-white">₹{g.price}</td>
                    <td className="py-3.5 px-4 font-semibold text-emerald-400">{g.salesCount || 0} enrolled</td>
                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1 text-[11px] text-purple-300 bg-purple-950/40 border border-purple-800/40 px-2 py-0.5 rounded w-fit">
                        <FileText className="h-3 w-3"/>
                        <span>{g.pdfFiles?.length || 0} PDF(s)</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${g.isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-500'}`}>
                        {g.isActive ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => openEditModal(g)} className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors" title="Edit Guide">
                          <Edit2 className="h-3.5 w-3.5"/>
                        </button>
                        <button onClick={() => handleDeleteGuide(g._id, g.title)} className="p-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 hover:text-rose-200 transition-colors" title="Delete Guide">
                          <Trash2 className="h-3.5 w-3.5"/>
                        </button>
                      </div>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>)}

      {/* Add / Edit Guide Modal */}
      {modalOpen && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-700 p-6 sm:p-8 shadow-2xl space-y-6 text-slate-200 my-8">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-400"/>
                <h3 className="text-base font-bold text-white">
                  {editingGuide ? 'Edit Course Guide' : 'Create New Course Guide'}
                </h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white">
                <X className="h-4 w-4"/>
              </button>
            </div>

            {formError && (<div className="rounded-xl bg-rose-950/60 border border-rose-800/60 p-3 text-xs text-rose-200">
                {formError}
              </div>)}

            <form onSubmit={handleSaveGuide} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-slate-300">Course Title *</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Next.js 15 Master Architecture Guide" className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white focus:outline-none focus:border-purple-500"/>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Category *</label>
                  <input type="text" required value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Web Development, AI, Security" className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white focus:outline-none focus:border-purple-500"/>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Target Level</label>
                  <select value={level} onChange={(e) => setLevel(e.target.value)} className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white focus:outline-none focus:border-purple-500">
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="All Levels">All Levels</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Price (₹ INR) *</label>
                  <input type="number" required min={0} value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white focus:outline-none focus:border-purple-500"/>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Original Price (for discount strikethrough)</label>
                  <input type="number" min={0} value={originalPrice} onChange={(e) => setOriginalPrice(Number(e.target.value))} className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white focus:outline-none focus:border-purple-500"/>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Short Summary</label>
                <input type="text" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} placeholder="One sentence summary for course cards" className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white focus:outline-none focus:border-purple-500"/>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-300">Full Description</label>
                <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white focus:outline-none focus:border-purple-500"/>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Cover Image URL</label>
                  <input type="url" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white focus:outline-none focus:border-purple-500"/>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-slate-300">Free Preview Pages Limit</label>
                  <input type="number" min={0} value={previewPages} onChange={(e) => setPreviewPages(Number(e.target.value))} className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white focus:outline-none focus:border-purple-500"/>
                </div>
              </div>

              {/* Secure PDF File Uploader Sub-section */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-emerald-400"/>
                    <span className="font-bold text-white">Protected PDF Documents ({pdfFiles.length})</span>
                  </div>
                  <label className="cursor-pointer flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold transition-all">
                    {uploadingPdf ? <Loader2 className="h-3.5 w-3.5 animate-spin"/> : <Upload className="h-3.5 w-3.5"/>}
                    <span>Upload PDF</span>
                    <input type="file" accept=".pdf,application/pdf" onChange={handlePdfUpload} disabled={uploadingPdf} className="hidden"/>
                  </label>
                </div>

                {pdfFiles.length === 0 ? (<p className="text-[11px] text-slate-500 italic">
                    No PDF file attached yet. Upload a .pdf document (it will be stored strictly in private encrypted storage).
                  </p>) : (<div className="space-y-2">
                    {pdfFiles.map((file, idx) => (<div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-brand-400"/>
                          <span className="font-medium text-white">{file.fileName}</span>
                          <span className="text-[10px] text-slate-500">({(file.fileSize / 1024).toFixed(0)} KB)</span>
                        </div>
                        <button type="button" onClick={() => handleRemovePdfFile(idx)} className="text-rose-400 hover:underline text-[11px]">
                          Remove
                        </button>
                      </div>))}
                  </div>)}
              </div>

              {/* Switches */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-purple-600"/>
                  <span className="text-white font-medium">Published (Visible in store)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-purple-600"/>
                  <span className="text-white font-medium">Featured Course</span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold disabled:opacity-50">
                  {saving ? <Loader2 className="h-4 w-4 animate-spin"/> : <span>Save Guide</span>}
                </button>
              </div>

            </form>

          </div>
        </div>)}

    </div>);
}
