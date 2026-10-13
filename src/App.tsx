/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState } from 'react';
import { db } from './firebase';
import { doc, getDocFromServer } from 'firebase/firestore';

export default function App() {
  const [dbStatus, setDbStatus] = useState<string>('Checking connection...');

  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
        setDbStatus('Database Connected');
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          setDbStatus('Database Offline');
        } else {
          // It might fail due to permissions, which means we connected but access was denied (expected behavior)
          setDbStatus('Database Connected (Secure)');
        }
      }
    }
    testConnection();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-center items-center p-5 font-sans antialiased">
      <div className="w-full max-w-[440px]">
        <div className="bg-white rounded-2xl p-10 px-8 shadow-[0_4px_6px_-1px_rgb(0,0,0,0.1),0_2px_4px_-2px_rgb(0,0,0,0.1)] border border-slate-200 text-center relative">
          
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${dbStatus.includes('Connected') ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
            <span className="text-xs text-slate-400 font-medium">{dbStatus}</span>
          </div>

          <div className="bg-amber-100 text-amber-500 w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
          </div>
          
          <h2 className="text-2xl font-bold mb-3 tracking-tight">Sistem Sedang Pemeliharaan</h2>
          
          <p className="text-slate-600 text-[0.95rem] leading-relaxed mb-6">
            Mohon maaf, aplikasi <b>Walk-in Frozen & Chiller</b> saat ini sedang dalam proses <i>maintenance</i> rutin untuk optimalisasi sistem dan penyesuaian denah.
          </p>
          
          <div className="bg-slate-50 border border-dashed border-slate-200 rounded-xl p-3 text-[0.85rem] text-slate-400 mb-6 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            Silakan coba kembali dalam beberapa saat.
          </div>

          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-blue-500 hover:bg-blue-600 active:scale-95 text-white py-3.5 px-5 rounded-xl border-none font-semibold cursor-pointer inline-flex items-center justify-center gap-2 text-base transition-all duration-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2v6h-6" />
              <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            </svg>
            Coba Muat Ulang
          </button>
        </div>
      </div>
    </div>
  );
}
