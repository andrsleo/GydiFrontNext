'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Mock data - replace with real API calls
const users = [
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan.perez@example.com',
    phone: '+52 555 123 4567',
    role: 'AFFILIATE',
    status: 'active',
    totalCommissions: 12450,
    referrals: 48,
    joinedAt: '2025-01-15',
    lastActive: '2025-10-20',
  },
  {
    id: 2,
    name: 'María González',
    email: 'maria.gonzalez@example.com',
    phone: '+52 555 234 5678',
    role: 'AFFILIATE',
    status: 'active',
    totalCommissions: 8320,
    referrals: 32,
    joinedAt: '2025-02-10',
    lastActive: '2025-10-19',
  },
  {
    id: 3,
    name: 'Carlos Rodríguez',
    email: 'carlos.rodriguez@example.com',
    phone: '+52 555 345 6789',
    role: 'HOST',
    status: 'active',
    properties: 5,
    joinedAt: '2024-11-20',
    lastActive: '2025-10-20',
  },
  {
    id: 4,
    name: 'Ana López',
    email: 'ana.lopez@example.com',
    phone: '+52 555 456 7890',
    role: 'AFFILIATE',
    status: 'inactive',
    totalCommissions: 2150,
    referrals: 12,
    joinedAt: '2025-08-05',
    lastActive: '2025-09-15',
  },
  {
    id: 5,
    name: 'Roberto Sánchez',
    email: 'roberto.sanchez@example.com',
    phone: '+52 555 567 8901',
    role: 'HOST',
    status: 'active',
    properties: 3,
    joinedAt: '2025-03-12',
    lastActive: '2025-10-18',
  },
];

const stats = [
  {
    name: 'Total Usuarios',
    value: '127',
    change: '+12 este mes',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    name: 'Afiliados Activos',
    value: '89',
    change: '70% del total',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    name: 'Hosts Activos',
    value: '38',
    change: '30% del total',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    name: 'Nuevos (7 días)',
    value: '8',
    change: '+3 desde ayer',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
];

const roleConfig = {
  AFFILIATE: { label: 'Afiliado', color: 'bg-blue-100 text-blue-800' },
  HOST: { label: 'Host', color: 'bg-purple-100 text-purple-800' },
  ADMIN: { label: 'Admin', color: 'bg-red-100 text-red-800' },
};

const statusConfig = {
  active: { label: 'Activo', color: 'bg-green-100 text-green-800' },
  inactive: { label: 'Inactivo', color: 'bg-gray-100 text-gray-800' },
  suspended: { label: 'Suspendido', color: 'bg-red-100 text-red-800' },
};

export default function UsuariosPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || user.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Usuarios</h1>
          <p className="text-muted-foreground">
            Gestiona afiliados, hosts y administradores
          </p>
        </div>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Nuevo Usuario
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="rounded-lg border bg-card p-6 shadow-sm"
          >
            <div className={`mb-2 inline-block rounded-lg p-2 ${stat.bgColor}`}>
              <div className={`text-2xl font-bold ${stat.color}`}>
                {stat.value}
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
            <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">Todos los roles</option>
            <option value="AFFILIATE">Afiliados</option>
            <option value="HOST">Hosts</option>
            <option value="ADMIN">Administradores</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
            <option value="suspended">Suspendidos</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-lg border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Contacto
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Rol
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Estado
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Métricas
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Registro
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        {user.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${roleConfig[user.role as keyof typeof roleConfig].color
                        }`}
                    >
                      {roleConfig[user.role as keyof typeof roleConfig].label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${statusConfig[user.status as keyof typeof statusConfig].color
                        }`}
                    >
                      {statusConfig[user.status as keyof typeof statusConfig].label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-center">
                      {user.role === 'AFFILIATE' ? (
                        <>
                          <p className="font-semibold text-green-600">
                            ${user.totalCommissions?.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user.referrals} referidos
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="font-semibold text-blue-600">
                            {user.properties} propiedades
                          </p>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {user.joinedAt}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Último acceso: {user.lastActive}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="icon" title="Ver detalles">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" title="Editar">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Más opciones"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <Search className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No se encontraron usuarios</h3>
            <p className="text-sm text-muted-foreground">
              Intenta con otro término de búsqueda o filtro
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Mostrando {filteredUsers.length} de {users.length} usuarios
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled>
            Anterior
          </Button>
          <Button variant="outline" size="sm">
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
