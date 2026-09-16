'use client';
import React, { useEffect, useState } from 'react';
import { Search, BookOpen, Coins, X, Loader2 } from 'lucide-react';
export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [allGuides, setAllGuides] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    // Grant Access Modal
    const [grantModalOpen, setGrantModalOpen] = useState(false);
    const [selectedUserForGrant, setSelectedUserForGrant] = useState(null);
    const [selectedGuideToGrant, setSelectedGuideToGrant] = useState('');
    const [grantLoading, setGrantLoading] = useState(false);
    // Points Adjustment Modal
    const [pointsModalOpen, setPointsModalOpen] = useState(false);
    const [selectedUserForPoints, setSelectedUserForPoints] = useState(null);
    const [pointsAmount, setPointsAmount] = useState(100);
    const [pointsReason, setPointsReason] = useState('Support Credit / Compensation');
    const [pointsLoading, setPointsLoading] = useState(false);
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/users');
            const data = await res.json();
            if (data.success) {
                setUsers(data.users || []);
                setAllGuides(data.allGuides || []);
                if (data.allGuides?.length > 0) {
                    setSelectedGuideToGrant(data.allGuides[0]._id);
                }
            }
        }
        catch (err) {
            console.error('Error fetching admin users:', err);
        }
        finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);
    // Handle Grant Access
    const handleGrantAccess = async (e) => {
        e.preventDefault();
        if (!selectedUserForGrant || !selectedGuideToGrant)
            return;
        setGrantLoading(true);
        try {
            const res = await fetch('/api/admin/users/grant-access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: selectedUserForGrant._id,
                    guideId: selectedGuideToGrant,
                    action: 'grant',
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to grant course');
            }
            setGrantModalOpen(false);
            fetchUsers();
        }
        catch (err) {
            alert(err.message || 'Error granting access');
        }
        finally {
            setGrantLoading(false);
        }
    };
    // Handle Revoke Access
    const handleRevokeAccess = async (userId, guideId, guideTitle) => {
        if (!confirm(`Are you sure you want to revoke access to "${guideTitle}"?`))
            return;
        try {
            const res = await fetch('/api/admin/users/grant-access', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    guideId,
                    action: 'revoke',
                }),
            });
            const data = await res.json();
            if (data.success) {
                fetchUsers();
            }
            else {
                alert(data.error || 'Failed to revoke access');
            }
        }
        catch (err) {
            console.error('Revoke access error:', err);
        }
    };
    // Handle Points Adjust
    const handleAdjustPoints = async (e) => {
        e.preventDefault();
        if (!selectedUserForPoints)
            return;
        setPointsLoading(true);
        try {
            const res = await fetch('/api/admin/users/adjust-points', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: selectedUserForPoints._id,
                    amount: Number(pointsAmount),
                    reason: pointsReason,
                }),
            });
            const data = await res.json();
            if (!res.ok || !data.success) {
                throw new Error(data.error || 'Failed to adjust points');
            }
            setPointsModalOpen(false);
            fetchUsers();
        }
        catch (err) {
            alert(err.message || 'Error adjusting points');
        }
        finally {
            setPointsLoading(false);
        }
    };
    const filteredUsers = users.filter((u) => u.name?.toLowerCase().includes(search.toLowerCase()) ||
        u.email?.toLowerCase().includes(search.toLowerCase()));
    return (<div className="space-y-8 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Users & Entitlements Manager</h1>
          <p className="text-xs text-slate-400 mt-1">
            View registered students, manually grant/revoke guide access, and adjust points balances
          </p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="flex items-center rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2 max-w-md text-xs">
        <Search className="h-4 w-4 text-slate-400 mr-2 shrink-0"/>
        <input type="text" placeholder="Search by student name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-transparent text-white placeholder-slate-500 focus:outline-none"/>
      </div>

      {/* Users Table */}
      {loading ? (<div className="py-20 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-500"/>
        </div>) : (<div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3.5 px-4 font-semibold">Student / User</th>
                  <th className="py-3.5 px-4 font-semibold">Role</th>
                  <th className="py-3.5 px-4 font-semibold">Points Balance</th>
                  <th className="py-3.5 px-4 font-semibold">Enrolled Guides</th>
                  <th className="py-3.5 px-4 font-semibold">Joined Date</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredUsers.map((u) => (<tr key={u._id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 font-medium">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-slate-800 text-purple-300 flex items-center justify-center font-bold text-xs">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-white block">{u.name}</span>
                          <span className="text-[11px] text-slate-400 font-mono">{u.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${u.role === 'admin'
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    : 'bg-slate-800 text-slate-300'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5 font-bold text-amber-300 font-mono">
                        <Coins className="h-3.5 w-3.5 text-amber-400"/>
                        <span>{u.points || 0} pts</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="space-y-1 max-w-xs">
                        {u.purchasedGuides?.length === 0 ? (<span className="text-slate-500 italic text-[11px]">No guides owned</span>) : (u.purchasedGuides?.map((item, idx) => {
                    const guideTitle = item.guideId?.title || 'Course Guide';
                    const guideId = item.guideId?._id || item.guideId;
                    return (<div key={idx} className="flex items-center justify-between p-1 px-2 rounded bg-slate-950 border border-slate-800 text-[11px]">
                                <span className="truncate max-w-[150px] text-slate-200">{guideTitle}</span>
                                <button onClick={() => handleRevokeAccess(u._id, guideId, guideTitle)} className="text-[10px] text-rose-400 hover:underline font-semibold ml-2" title="Revoke access">
                                  Revoke
                                </button>
                              </div>);
                }))}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button onClick={() => {
                    setSelectedUserForGrant(u);
                    setGrantModalOpen(true);
                }} className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 text-[11px] font-semibold transition-colors flex items-center gap-1">
                          <BookOpen className="h-3 w-3"/>
                          <span>Grant Guide</span>
                        </button>
                        <button onClick={() => {
                    setSelectedUserForPoints(u);
                    setPointsModalOpen(true);
                }} className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-[11px] font-semibold transition-colors flex items-center gap-1">
                          <Coins className="h-3 w-3"/>
                          <span>Adjust Points</span>
                        </button>
                      </div>
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>)}

      {/* Grant Course Access Modal */}
      {grantModalOpen && selectedUserForGrant && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-5 text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-purple-400"/>
                <span>Grant Course Access</span>
              </h3>
              <button onClick={() => setGrantModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4"/>
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Grant immediate DRM reader access to <strong className="text-white">{selectedUserForGrant.name}</strong> ({selectedUserForGrant.email}).
            </p>

            <form onSubmit={handleGrantAccess} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-400">Select Guide to Grant</label>
                <select value={selectedGuideToGrant} onChange={(e) => setSelectedGuideToGrant(e.target.value)} className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white focus:outline-none focus:border-purple-500">
                  {allGuides.map((g) => (<option key={g._id} value={g._id}>
                      {g.title} (₹{g.price})
                    </option>))}
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setGrantModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold">
                  Cancel
                </button>
                <button type="submit" disabled={grantLoading} className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold disabled:opacity-50">
                  {grantLoading ? 'Granting...' : 'Grant Access Now'}
                </button>
              </div>
            </form>
          </div>
        </div>)}

      {/* Adjust Points Modal */}
      {pointsModalOpen && selectedUserForPoints && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-slate-900 border border-slate-700 p-6 shadow-2xl space-y-5 text-slate-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Coins className="h-4 w-4 text-amber-400"/>
                <span>Adjust Points Balance</span>
              </h3>
              <button onClick={() => setPointsModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-4 w-4"/>
              </button>
            </div>

            <div className="text-xs text-slate-300 space-y-1">
              <p>User: <strong className="text-white">{selectedUserForPoints.name}</strong></p>
              <p>Current Balance: <strong className="text-amber-300 font-mono">{selectedUserForPoints.points || 0} pts</strong></p>
            </div>

            <form onSubmit={handleAdjustPoints} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-slate-400">Points Amount (+ to add, - to deduct)</label>
                <input type="number" required value={pointsAmount} onChange={(e) => setPointsAmount(Number(e.target.value))} placeholder="e.g. 100 or -50" className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white font-mono focus:outline-none focus:border-amber-500"/>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-400">Reason for Ledger Audit Log *</label>
                <input type="text" required value={pointsReason} onChange={(e) => setPointsReason(e.target.value)} placeholder="e.g. Compensation bonus, Giveaway prize" className="w-full rounded-xl bg-slate-950 border border-slate-800 py-2 px-3 text-white focus:outline-none focus:border-amber-500"/>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setPointsModalOpen(false)} className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold">
                  Cancel
                </button>
                <button type="submit" disabled={pointsLoading} className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold disabled:opacity-50">
                  {pointsLoading ? 'Saving...' : 'Apply Adjustment'}
                </button>
              </div>
            </form>
          </div>
        </div>)}

    </div>);
}
