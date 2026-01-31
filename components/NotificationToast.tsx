
import React, { useEffect, useState } from 'react';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'system';
  action?: () => void;
}

interface NotificationToastProps {
  notifications: ToastMessage[];
  onDismiss: (id: string) => void;
}

const NotificationToast: React.FC<NotificationToastProps> = ({ notifications, onDismiss }) => {
  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
      {notifications.map((note) => (
        <div 
          key={note.id}
          className="pointer-events-auto w-80 bg-white/90 backdrop-blur-xl border border-blue-100 rounded-[1.5rem] shadow-2xl p-5 flex items-start gap-4 animate-in slide-in-from-right-full duration-500 hover:scale-105 transition-transform"
        >
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-200 relative">
            <i className={`fas ${note.type === 'order' ? 'fa-shopping-basket' : 'fa-info-circle'}`}></i>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex justify-between items-start">
              <h4 className="text-sm font-black text-slate-800 tracking-tight">{note.title}</h4>
              <button 
                onClick={() => onDismiss(note.id)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <i className="fas fa-times text-[10px]"></i>
              </button>
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">{note.message}</p>
            {note.action && (
              <button 
                onClick={() => {
                  note.action?.();
                  onDismiss(note.id);
                }}
                className="mt-2 text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline"
              >
                Lihat Detail <i className="fas fa-arrow-right ml-1"></i>
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
