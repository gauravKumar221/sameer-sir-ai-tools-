'use client';
import React from 'react';
export default function WatermarkOverlay({ userEmail, userName, userId }) {
    const timestamp = new Date().toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
    const watermarkText = `LICENSED TO: ${userEmail.toUpperCase()} (${userName}) • USER ID: ${userId || 'AUTHENTICATED'} • ${timestamp}`;
    return (<div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-around overflow-hidden select-none opacity-[0.09] dark:opacity-[0.14]" style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
        }}>
      {[0, 1, 2, 3, 4, 5].map((row) => (<div key={row} className="flex whitespace-nowrap -rotate-12 transform justify-around text-[13px] font-mono font-bold tracking-widest text-slate-900 dark:text-white">
          <span>{watermarkText}</span>
          <span>{watermarkText}</span>
        </div>))}
    </div>);
}
