import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";
import UnifiedChat from "@/components/UnifiedChat";
import EncryptedChat from "@/components/EncryptedChat";
import AuthSystem from "@/components/AuthSystem";
import UserProfile from "@/components/UserProfile";
import DirectMessages from "@/components/DirectMessages";
import FriendsList from "@/components/FriendsList";
import ProfileEdit from "@/components/ProfileEdit";
import Navigation from "@/components/sections/Navigation";
import HeroSection from "@/components/sections/HeroSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import SecuritySection from "@/components/sections/SecuritySection";
import FAQSection from "@/components/sections/FAQSection";
import SupportSection from "@/components/sections/SupportSection";
import Footer from "@/components/sections/Footer";
import { useState } from "react";

interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  avatar: string;
  createdAt: Date;
  status?: 'online' | 'idle' | 'dnd' | 'invisible';
}

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showProfileEdit, setShowProfileEdit] = useState(false);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const handleUpdateAvatar = (avatar: string) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, avatar };
      setCurrentUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    }
  };

  if (showAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-md">
          <Button 
            variant="ghost" 
            onClick={() => setShowAuth(false)}
            className="mb-4"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад на главную
          </Button>
          <AuthSystem onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  if (currentUser && showProfileEdit) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={() => setShowProfileEdit(false)}
            className="mb-4"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад на главную
          </Button>
          <ProfileEdit />
        </div>
      </div>
    );
  }

  if (currentUser && showProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="w-full max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={() => setShowProfile(false)}
            className="mb-4"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад на главную
          </Button>
          <UserProfile 
            user={currentUser} 
            onLogout={handleLogout}
            onUpdateAvatar={handleUpdateAvatar}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation 
        currentUser={currentUser}
        onShowAuth={() => setShowAuth(true)}
        onShowProfile={() => setShowProfile(true)}
      />

      <HeroSection />
      <FeaturesSection />

      <section id="chat" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-5xl font-bold mb-4">Чат с голосовыми каналами</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Общайтесь текстом и голосом в одном месте, как в Discord
            </p>
          </div>
          <UnifiedChat />
        </div>
      </section>

      <section id="dm" className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-5xl font-bold mb-4">Личные сообщения</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Переписывайтесь с друзьями в приватных чатах
            </p>
          </div>
          <DirectMessages 
            currentUserId="me"
            currentUserName={currentUser?.username || "Гость"}
            currentUserAvatar={currentUser?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=guest"}
          />
        </div>
      </section>

      <section id="friends" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-5xl font-bold mb-4">Друзья</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Управляйте списком друзей и запросами на добавление
            </p>
          </div>
          <FriendsList />
        </div>
      </section>

      {currentUser && (
        <section id="profile-edit" className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto">
            <div className="text-center mb-16 animate-fade-in">
              <h2 className="text-5xl font-bold mb-4">Редактирование профиля</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Настройте свой профиль, статус и приватность
              </p>
            </div>
            <ProfileEdit />
          </div>
        </section>
      )}

      <section id="encryption" className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-5xl font-bold mb-4">End-to-End шифрование</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Генерируйте цифровые ключи и обменивайтесь зашифрованными сообщениями
            </p>
          </div>
          <EncryptedChat />
        </div>
      </section>

      <SecuritySection />
      <FAQSection />
      <SupportSection />
      <Footer />
    </div>
  );
};

export default Index;