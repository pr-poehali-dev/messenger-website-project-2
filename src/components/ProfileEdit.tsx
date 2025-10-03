import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserProfile {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  status: "online" | "offline" | "away" | "dnd";
  statusText: string;
  bio: string;
  email: string;
  phone: string;
  tags: string[];
  privacy: "public" | "friends" | "private";
}

export default function ProfileEdit() {
  const [profile, setProfile] = useState<UserProfile>({
    id: "me",
    username: "myusername",
    displayName: "Моё имя",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=me",
    status: "online",
    statusText: "Онлайн",
    bio: "Расскажите о себе...",
    email: "email@example.com",
    phone: "+7 (900) 000-00-00",
    tags: ["Программирование", "Музыка"],
    privacy: "friends"
  });

  const [newTag, setNewTag] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  const handleAvatarChange = () => {
    const seed = Math.random().toString(36).substring(7);
    setProfile({ ...profile, avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}` });
  };

  const addTag = () => {
    if (newTag.trim() && profile.tags.length < 10) {
      setProfile({ ...profile, tags: [...profile.tags, newTag.trim()] });
      setNewTag("");
    }
  };

  const removeTag = (index: number) => {
    setProfile({ ...profile, tags: profile.tags.filter((_, i) => i !== index) });
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online": return "CircleDot";
      case "away": return "Clock";
      case "dnd": return "MinusCircle";
      case "offline": return "Circle";
      default: return "Circle";
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="User" size={24} />
            Редактирование профиля
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Аватар */}
          <div className="flex flex-col items-center gap-4 pb-6 border-b">
            <Avatar className="w-32 h-32">
              <AvatarImage src={profile.avatar} alt={profile.displayName} />
              <AvatarFallback>{profile.displayName[0]}</AvatarFallback>
            </Avatar>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleAvatarChange}>
                <Icon name="RefreshCw" size={16} className="mr-2" />
                Сменить аватар
              </Button>
              <Button variant="outline">
                <Icon name="Upload" size={16} className="mr-2" />
                Загрузить фото
              </Button>
            </div>
          </div>

          {/* Основная информация */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="username">Никнейм</Label>
                <Input
                  id="username"
                  value={profile.username}
                  onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  placeholder="Введите никнейм"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName">Отображаемое имя</Label>
                <Input
                  id="displayName"
                  value={profile.displayName}
                  onChange={(e) => setProfile({ ...profile, displayName: e.target.value })}
                  placeholder="Как вас называть?"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">О себе</Label>
              <Textarea
                id="bio"
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Расскажите о себе"
                rows={4}
              />
            </div>
          </div>

          {/* Статус */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold flex items-center gap-2">
              <Icon name="Activity" size={18} />
              Статус
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Статус активности</Label>
                <Select
                  value={profile.status}
                  onValueChange={(value: any) => setProfile({ ...profile, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">
                      <div className="flex items-center gap-2">
                        <Icon name="CircleDot" size={16} className="text-green-500" />
                        В сети
                      </div>
                    </SelectItem>
                    <SelectItem value="away">
                      <div className="flex items-center gap-2">
                        <Icon name="Clock" size={16} className="text-yellow-500" />
                        Отошёл
                      </div>
                    </SelectItem>
                    <SelectItem value="dnd">
                      <div className="flex items-center gap-2">
                        <Icon name="MinusCircle" size={16} className="text-red-500" />
                        Не беспокоить
                      </div>
                    </SelectItem>
                    <SelectItem value="offline">
                      <div className="flex items-center gap-2">
                        <Icon name="Circle" size={16} className="text-gray-400" />
                        Не в сети
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="statusText">Текст статуса</Label>
                <Input
                  id="statusText"
                  value={profile.statusText}
                  onChange={(e) => setProfile({ ...profile, statusText: e.target.value })}
                  placeholder="Что вы делаете?"
                />
              </div>
            </div>
          </div>

          {/* Контакты */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold flex items-center gap-2">
              <Icon name="Mail" size={18} />
              Контактная информация
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Телефон</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+7 (900) 000-00-00"
                />
              </div>
            </div>
          </div>

          {/* Интересы */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold flex items-center gap-2">
              <Icon name="Tag" size={18} />
              Интересы и теги
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    onClick={() => removeTag(index)}
                    className="ml-1 hover:text-red-600 transition-colors"
                  >
                    <Icon name="X" size={14} />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTag()}
                placeholder="Добавить тег"
                maxLength={20}
              />
              <Button onClick={addTag} disabled={profile.tags.length >= 10}>
                <Icon name="Plus" size={16} />
              </Button>
            </div>
            <p className="text-xs text-gray-500">
              {profile.tags.length}/10 тегов
            </p>
          </div>

          {/* Приватность */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="font-semibold flex items-center gap-2">
              <Icon name="Lock" size={18} />
              Приватность
            </h3>
            <div className="space-y-2">
              <Label htmlFor="privacy">Кто может видеть мой профиль?</Label>
              <Select
                value={profile.privacy}
                onValueChange={(value: any) => setProfile({ ...profile, privacy: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">
                    <div className="flex items-center gap-2">
                      <Icon name="Globe" size={16} />
                      Все пользователи
                    </div>
                  </SelectItem>
                  <SelectItem value="friends">
                    <div className="flex items-center gap-2">
                      <Icon name="Users" size={16} />
                      Только друзья
                    </div>
                  </SelectItem>
                  <SelectItem value="private">
                    <div className="flex items-center gap-2">
                      <Icon name="Lock" size={16} />
                      Только я
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Кнопки действий */}
          <div className="flex gap-3 pt-6 border-t">
            <Button onClick={handleSave} disabled={isSaving} className="flex-1">
              {isSaving ? (
                <>
                  <Icon name="Loader2" size={16} className="mr-2 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Icon name="Save" size={16} className="mr-2" />
                  Сохранить изменения
                </>
              )}
            </Button>
            <Button variant="outline">
              <Icon name="X" size={16} className="mr-2" />
              Отменить
            </Button>
          </div>

          {savedMessage && (
            <div className="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-lg">
              <Icon name="CheckCircle2" size={18} />
              <span>Профиль успешно сохранён!</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Предпросмотр профиля */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Eye" size={20} />
            Предпросмотр профиля
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4 p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profile.avatar} alt={profile.displayName} />
                <AvatarFallback>{profile.displayName[0]}</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-0 right-0">
                <Icon name={getStatusIcon(profile.status)} size={20} className={
                  profile.status === "online" ? "text-green-500" :
                  profile.status === "away" ? "text-yellow-500" :
                  profile.status === "dnd" ? "text-red-500" :
                  "text-gray-400"
                } />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-bold mb-1">{profile.displayName}</h3>
              <p className="text-sm text-gray-600 mb-1">@{profile.username}</p>
              <p className="text-sm text-gray-700 mb-3">{profile.statusText}</p>
              <p className="text-sm text-gray-600 mb-3">{profile.bio}</p>
              <div className="flex flex-wrap gap-1">
                {profile.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
