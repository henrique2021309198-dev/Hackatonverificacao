import { GraduationCap, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-gray-50 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <GraduationCap className="size-8 text-blue-600" />
              <span className="text-xl text-blue-900">EventosAcad</span>
            </div>
            <p className="text-sm text-gray-600">
              Plataforma de gerenciamento de eventos acadêmicos. Conectando estudantes e
              instituições através de experiências educacionais.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-gray-900">Links Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  Sobre Nós
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  Como Funciona
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  Termos de Uso
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-blue-600">
                  Política de Privacidade
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-gray-900">Contato</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <Mail className="size-4" />
                contato@eventosacad.com.br
              </li>
              <li className="flex items-center gap-2">
                <Phone className="size-4" />
                (11) 3456-7890
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="size-4" />
                São Paulo, SP
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} EventosAcad. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
