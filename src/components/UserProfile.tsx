import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import AvatarCreator from "./AvatarCreator";

interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  avatar: string;
  createdAt: Date;
}

interface UserProfileProps {
  user: User;
  onLogout: () => void;
  onUpdateAvatar: (avatar: string) => void;
}

export default function UserProfile({ user, onLogout, onUpdateAvatar }: UserProfileProps) {
  const [showAvatarCreator, setShowAvatarCreator] = useState(false);
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleSaveAvatar = (avatar: string) => {
    onUpdateAvatar(avatar);
    setShowAvatarCreator(false);
  };

  if (showAvatarCreator) {
    return <AvatarCreator onSave={handleSaveAvatar} currentAvatar={user.avatar} />;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="relative">
        <div className="h-32 bg-gradient-to-r from-primary to-purple-500 rounded-t-lg absolute top-0 left-0 right-0"></div>
        <div className="relative pt-20 flex flex-col items-center">
          <div className="relative group">
            <img 
              src={user.avatar} 
              alt={user.username}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
            />
            <button
              onClick={() => setShowAvatarCreator(true)}
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Icon name="Camera" size={24} className="text-white" />
            </button>
          </div>
          <CardTitle className="mt-4 text-2xl">{user.username}</CardTitle>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Icon name="Calendar" size={16} />
              <span className="text-sm">Дата регистрации</span>
            </div>
            <p className="font-semibold">{formatDate(user.createdAt)}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Icon name="Shield" size={16} />
              <span className="text-sm">Статус аккаунта</span>
            </div>
            <p className="font-semibold text-green-600">Активен</p>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Icon name="Settings" size={18} />
            Настройки аккаунта
          </h3>
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => setShowAvatarCreator(true)}
            >
              <Icon name="Image" className="mr-2" size={18} />
              Изменить аватар
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Icon name="User" className="mr-2" size={18} />
              Редактировать профиль
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Icon name="Lock" className="mr-2" size={18} />
              Изменить пароль
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Icon name="Bell" className="mr-2" size={18} />
              Настройки уведомлений
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Icon name="Shield" className="mr-2" size={18} />
              Безопасность и конфиденциальность
            </Button>
          </div>
        </div>

        <div className="pt-4 border-t">
          <Button 
            onClick={onLogout} 
            variant="destructive" 
            className="w-full"
            size="lg"
          >
            <Icon name="LogOut" className="mr-2" size={18} />
            Выйти из аккаунта
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}