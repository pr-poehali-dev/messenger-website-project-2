import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  avatar: string;
  createdAt: Date;
  status?: 'online' | 'idle' | 'dnd' | 'invisible';
}

interface NavigationProps {
  currentUser: User | null;
  onShowAuth: () => void;
  onShowProfile: () => void;
}

export default function Navigation({ currentUser, onShowAuth, onShowProfile }: NavigationProps) {
  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="https://cdn.poehali.dev/files/b4dd4c30-699b-4f6f-a2d2-927daeee8639.png" alt="Not Lock" className="h-10 w-auto rounded-xl" />
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#home" className="text-gray-700 hover:text-primary transition-colors">Главная</a>
            <a href="#features" className="text-gray-700 hover:text-primary transition-colors">Возможности</a>
            <a href="#chat" className="text-gray-700 hover:text-primary transition-colors">Чат</a>
            <a href="#dm" className="text-gray-700 hover:text-primary transition-colors">ЛС</a>
            <a href="#friends" className="text-gray-700 hover:text-primary transition-colors">Друзья</a>
            <a href="#support" className="text-gray-700 hover:text-primary transition-colors">Поддержка</a>
          </div>
          {currentUser ? (
            <Button 
              onClick={onShowProfile}
              className="gradient-blue-green text-white border-0 hover:opacity-90"
            >
              <Icon name="User" className="mr-2" size={18} />
              {currentUser.username}
            </Button>
          ) : (
            <Button 
              onClick={onShowAuth}
              className="gradient-blue-green text-white border-0 hover:opacity-90"
            >
              <Icon name="UserCircle" className="mr-2" size={18} />
              Войти
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}
