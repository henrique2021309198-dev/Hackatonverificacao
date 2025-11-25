import { Home, Calendar, User, Shield } from 'lucide-react';
import { cn } from '../lib/utils';

interface UserNavbarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: 'home', label: 'Eventos', icon: Home },
  { id: 'meus-eventos', label: 'Meus Eventos', icon: Calendar },
  { id: 'verificar-certificado', label: 'Verificar Certificado', icon: Shield },
  { id: 'perfil', label: 'Perfil', icon: User },
];

export function UserNavbar({ activeSection, onSectionChange }: UserNavbarProps) {
  return (
    <nav className="border-b bg-white">
      <div className="mx-auto max-w-7xl px-4 md:px-6 lg:px-8">
        <div className="flex gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  'flex items-center gap-2 border-b-2 px-4 py-4 transition-colors',
                  activeSection === item.id
                    ? 'border-blue-600 text-blue-700'
                    : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900'
                )}
              >
                <Icon className="size-5" />
                <span className="hidden md:inline">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}