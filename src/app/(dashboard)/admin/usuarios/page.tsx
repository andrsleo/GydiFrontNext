import { Metadata } from 'next';
import {
  Users,
  UserPlus,
  Shield,
  Ban,
  Search,
  Filter,
  MoreVertical,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const metadata: Metadata = {
  title: 'Gestión de Usuarios | Admin GYDI',
  description: 'Administración de usuarios, roles y permisos',
};

/**
 * Admin Users Management Page
 *
 * CRUD operations for users:
 * - View all users with pagination
 * - Change user roles (USER <-> ADMIN)
 * - Suspend/activate accounts
 * - Reset passwords
 * - View user activity
 */
export default function AdminUsersPage() {
  // TODO: Fetch real users from backend API
  const users = [
    {
      id: 1,
      name: 'Juan Pérez',
      email: 'juan.perez@example.com',
      role: 'USER',
      plan: 'PRO',
      status: 'active',
      createdAt: '2024-01-15',
      propertiesCount: 12,
      referralsCount: 45,
    },
    {
      id: 2,
      name: 'María García',
      email: 'maria.garcia@example.com',
      role: 'USER',
      plan: 'ELITE',
      status: 'active',
      createdAt: '2024-02-20',
      propertiesCount: 28,
      referralsCount: 120,
    },
    {
      id: 3,
      name: 'Carlos Admin',
      email: 'carlos.admin@gydi.com',
      role: 'ADMIN',
      plan: 'ELITE',
      status: 'active',
      createdAt: '2023-12-01',
      propertiesCount: 0,
      referralsCount: 0,
    },
    {
      id: 4,
      name: 'Ana Rodríguez',
      email: 'ana.rodriguez@example.com',
      role: 'USER',
      plan: 'FREE',
      status: 'suspended',
      createdAt: '2024-03-10',
      propertiesCount: 3,
      referralsCount: 8,
    },
  ];

  const stats = {
    totalUsers: 1247,
    activeUsers: 892,
    adminUsers: 5,
    suspendedUsers: 15,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground mt-2">
            CRUD de usuarios, cambiar roles y suspender cuentas
          </p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Crear Usuario
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
            <Users className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.activeUsers.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Administradores</CardTitle>
            <Shield className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{stats.adminUsers}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Suspendidos</CardTitle>
            <Ban className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.suspendedUsers}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Usuarios</CardTitle>
          <CardDescription>Buscar y filtrar usuarios registrados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  className="pl-10"
                />
              </div>
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filtros
            </Button>
          </div>

          {/* Users Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Propiedades</TableHead>
                  <TableHead>Referidos</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.role === 'ADMIN' ? 'default' : 'secondary'}
                        className={user.role === 'ADMIN' ? 'bg-primary' : ''}
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          user.plan === 'ELITE'
                            ? 'border-purple-300 bg-purple-50 text-purple-800'
                            : user.plan === 'PRO'
                            ? 'border-blue-300 bg-blue-50 text-blue-800'
                            : 'border-gray-300 bg-gray-50 text-gray-800'
                        }
                      >
                        {user.plan}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === 'active' ? 'default' : 'destructive'}
                        className={
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800 hover:bg-green-100'
                            : ''
                        }
                      >
                        {user.status === 'active' ? 'Activo' : 'Suspendido'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{user.propertiesCount}</TableCell>
                    <TableCell className="text-center">{user.referralsCount}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString('es-ES')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Ver detalles</DropdownMenuItem>
                          <DropdownMenuItem>Cambiar rol</DropdownMenuItem>
                          <DropdownMenuItem>Cambiar plan</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            {user.status === 'active' ? 'Suspender' : 'Activar'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Placeholder */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Mostrando 1-4 de {stats.totalUsers} usuarios
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
        </CardContent>
      </Card>

      {/* Placeholder Notice */}
      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-lg">🚧 Funcionalidad en Desarrollo</CardTitle>
          <CardDescription>
            Los datos mostrados son de ejemplo. Próximamente se implementarán:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>CRUD completo de usuarios</li>
              <li>Cambio de roles y permisos</li>
              <li>Suspensión/activación de cuentas</li>
              <li>Reseteo de contraseñas</li>
              <li>Historial de actividad por usuario</li>
            </ul>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
