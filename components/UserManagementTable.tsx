
import React, { useState } from 'react';
import { User, UserStatus, UserRole } from '../types';

interface UserManagementTableProps {
  users: User[];
  onToggleStatus: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

const UserManagementTable: React.FC<UserManagementTableProps> = ({ users, onToggleStatus, onDeleteUser }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Manajemen Pengguna</h2>
          <p className="text-sm text-slate-500">Kelola pelanggan dan staf administratif.</p>
        </div>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <i className="fas fa-search"></i>
          </span>
          <input 
            type="text" 
            placeholder="Cari nama atau email..."
            className="pl-10 pr-4 py-2 border border-slate-200 rounded-lg w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">User</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Role</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Kontak</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredUsers.map(user => (
              <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} className="w-10 h-10 rounded-full bg-slate-200" alt={user.name} />
                    <div>
                      <p className="font-semibold text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    user.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-700">{user.phone}</p>
                  <p className="text-xs text-slate-400 truncate max-w-[150px]">{user.address}</p>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.status === UserStatus.ACTIVE ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user.status === UserStatus.ACTIVE ? 'bg-green-600' : 'bg-red-600'}`}></span>
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button 
                    onClick={() => onToggleStatus(user.id)}
                    className={`p-2 rounded text-xs font-medium ${
                      user.status === UserStatus.ACTIVE ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'
                    }`}
                    title={user.status === UserStatus.ACTIVE ? 'Block User' : 'Unblock User'}
                  >
                    <i className={`fas ${user.status === UserStatus.ACTIVE ? 'fa-ban' : 'fa-check'}`}></i>
                  </button>
                  <button 
                    onClick={() => onDeleteUser(user.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                    title="Delete User"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagementTable;
