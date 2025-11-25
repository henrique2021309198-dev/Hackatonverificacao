import { LayoutDashboard, Calendar, Settings, FileText, Shield } from 'lucide-react';
import { cn } from '../lib/utils';

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'eventos', label: 'Eventos', icon: Calendar },
  { id: 'criar-evento', label: 'Criar Evento', icon: FileText },
  { id: 'verificar-certificado', label: 'Verificar Certificado', icon: Shield },
  { id: 'configuracoes', label: 'Configurações', icon: Settings },
];

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  return (
    <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r bg-white">
      <nav className="flex h-full flex-col gap-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-4 py-3 transition-colors',
                activeSection === item.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <Icon className="size-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}