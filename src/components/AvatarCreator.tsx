import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import Icon from "@/components/ui/icon";

interface AvatarCreatorProps {
  onSave: (avatar: string) => void;
  currentAvatar?: string;
}

export default function AvatarCreator({ onSave, currentAvatar }: AvatarCreatorProps) {
  const [avatarType, setAvatarType] = useState<"upload" | "generate" | "emoji">("generate");
  const [uploadedImage, setUploadedImage] = useState<string>("");
  const [selectedEmoji, setSelectedEmoji] = useState("😊");
  const [backgroundColor, setBackgroundColor] = useState("#3b82f6");
  const [emojiSize, setEmojiSize] = useState([60]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const emojis = [
    "😊", "😎", "🤩", "😇", "🥳", "🤓", "😺", "🐶", "🐱", "🦊",
    "🐼", "🐨", "🦁", "🐯", "🦄", "🐙", "🦋", "🌟", "⚡", "🔥",
    "💎", "👑", "🎮", "🎨", "🎭", "🎪", "🚀", "🌈", "☀️", "🌙"
  ];

  const gradients = [
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
    "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
    "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
    "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
    "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
    "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setUploadedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateEmojiAvatar = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, 200, 200);
      
      ctx.font = `${emojiSize[0]}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(selectedEmoji, 100, 100);
      
      return canvas.toDataURL();
    }
    return '';
  };

  const handleSave = () => {
    let finalAvatar = currentAvatar || '';
    
    if (avatarType === 'upload' && uploadedImage) {
      finalAvatar = uploadedImage;
    } else if (avatarType === 'emoji') {
      finalAvatar = generateEmojiAvatar();
    } else if (avatarType === 'generate') {
      finalAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`;
    }
    
    onSave(finalAvatar);
  };

  const currentPreview = () => {
    if (avatarType === 'upload' && uploadedImage) {
      return uploadedImage;
    } else if (avatarType === 'emoji') {
      return generateEmojiAvatar();
    }
    return currentAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon name="Image" size={24} />
          Создать аватар
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <img 
            src={currentPreview()} 
            alt="Avatar preview"
            className="w-32 h-32 rounded-full border-4 border-primary shadow-lg object-cover"
          />
        </div>

        <div className="flex gap-2 justify-center">
          <Button
            variant={avatarType === 'upload' ? 'default' : 'outline'}
            onClick={() => setAvatarType('upload')}
            size="sm"
          >
            <Icon name="Upload" className="mr-2" size={16} />
            Загрузить
          </Button>
          <Button
            variant={avatarType === 'emoji' ? 'default' : 'outline'}
            onClick={() => setAvatarType('emoji')}
            size="sm"
          >
            <Icon name="Smile" className="mr-2" size={16} />
            Emoji
          </Button>
          <Button
            variant={avatarType === 'generate' ? 'default' : 'outline'}
            onClick={() => setAvatarType('generate')}
            size="sm"
          >
            <Icon name="Sparkles" className="mr-2" size={16} />
            Генератор
          </Button>
        </div>

        {avatarType === 'upload' && (
          <div className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button 
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full"
            >
              <Icon name="Upload" className="mr-2" size={18} />
              Выбрать файл
            </Button>
            {uploadedImage && (
              <p className="text-sm text-green-600 text-center flex items-center justify-center gap-2">
                <Icon name="CheckCircle" size={16} />
                Изображение загружено
              </p>
            )}
          </div>
        )}

        {avatarType === 'emoji' && (
          <div className="space-y-4">
            <div>
              <Label className="mb-3 block">Выберите emoji</Label>
              <div className="grid grid-cols-10 gap-2">
                {emojis.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`text-3xl p-2 rounded-lg transition-all hover:scale-110 ${
                      selectedEmoji === emoji ? 'bg-primary/20 ring-2 ring-primary' : 'hover:bg-gray-100'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Фон</Label>
              <div className="grid grid-cols-4 gap-2">
                {gradients.map((gradient, idx) => (
                  <button
                    key={idx}
                    onClick={() => setBackgroundColor(gradient)}
                    className={`h-12 rounded-lg transition-all hover:scale-105 ${
                      backgroundColor === gradient ? 'ring-2 ring-primary ring-offset-2' : ''
                    }`}
                    style={{ background: gradient }}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Размер emoji: {emojiSize[0]}px</Label>
              <Slider
                value={emojiSize}
                onValueChange={setEmojiSize}
                min={40}
                max={120}
                step={5}
                className="w-full"
              />
            </div>
          </div>
        )}

        {avatarType === 'generate' && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground text-center">
              Нажмите "Сохранить", чтобы сгенерировать случайный аватар
            </p>
            <Button 
              onClick={() => {
                const newAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`;
                onSave(newAvatar);
              }}
              variant="outline"
              className="w-full"
            >
              <Icon name="RefreshCw" className="mr-2" size={18} />
              Сгенерировать новый
            </Button>
          </div>
        )}

        <div className="pt-4 border-t space-y-2">
          <Button onClick={handleSave} className="w-full" size="lg">
            <Icon name="Check" className="mr-2" size={18} />
            Сохранить аватар
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
