import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import UnifiedChat from "@/components/UnifiedChat";
import EncryptedChat from "@/components/EncryptedChat";
import AuthSystem from "@/components/AuthSystem";
import UserProfile from "@/components/UserProfile";
import DirectMessages from "@/components/DirectMessages";
import FriendsList from "@/components/FriendsList";
import { useState } from "react";

interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  avatar: string;
  createdAt: Date;
}

const Index = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  const features = [
    {
      icon: "MessageCircle",
      title: "Групповые чаты",
      description: "Создавайте группы до 200,000 участников с расширенными правами администрирования"
    },
    {
      icon: "Zap",
      title: "Каналы",
      description: "Безлимитные подписчики, мгновенная доставка сообщений и полная статистика"
    },
    {
      icon: "Cloud",
      title: "Облачное хранилище",
      description: "Все ваши файлы, фото и видео доступны с любого устройства без ограничений"
    },
    {
      icon: "Users",
      title: "Видеозвонки",
      description: "Качественные видеозвонки до 1000 участников с демонстрацией экрана"
    }
  ];

  const security = [
    {
      icon: "Lock",
      title: "Сквозное шифрование",
      description: "Все сообщения защищены протоколом MTProto с 256-битным шифрованием"
    },
    {
      icon: "Shield",
      title: "Двухфакторная аутентификация",
      description: "Дополнительный уровень защиты вашего аккаунта от несанкционированного доступа"
    },
    {
      icon: "EyeOff",
      title: "Секретные чаты",
      description: "Режим самоуничтожения сообщений и полная конфиденциальность переписки"
    }
  ];

  const faqs = [
    {
      question: "Как создать групповой чат?",
      answer: "Нажмите на кнопку меню в левом верхнем углу, выберите 'Новая группа', добавьте участников и задайте название группы. Вы можете назначать администраторов и настраивать права доступа."
    },
    {
      question: "В чём разница между группой и каналом?",
      answer: "Группы предназначены для двусторонней коммуникации между участниками. Каналы - это инструмент для односторонней трансляции сообщений неограниченному числу подписчиков."
    },
    {
      question: "Насколько безопасен Not Lock Messenger?",
      answer: "Мы используем сквозное шифрование для всех сообщений, двухфакторную аутентификацию и протокол MTProto. Ваши данные надежно защищены от третьих лиц."
    },
    {
      question: "Можно ли использовать Not Lock на нескольких устройствах?",
      answer: "Да! Not Lock синхронизируется между всеми вашими устройствами. Начните переписку на телефоне и продолжите на компьютере или планшете."
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Поддержка Not Lock: ${formData.name}`);
    const body = encodeURIComponent(`Имя: ${formData.name}\nEmail: ${formData.email}\n\nСообщение:\n${formData.message}`);
    window.location.href = `mailto:timofey.dyakonenko@mail.ru?subject=${subject}&body=${body}`;
    setFormData({ name: "", email: "", message: "" });
  };

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setShowAuth(false);
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  const handleUpdateAvatar = (avatar: string) => {
    if (currentUser) {
      setCurrentUser({ ...currentUser, avatar });
    }
  };

  if (showAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <AuthSystem onLogin={handleLogin} />
      </div>
    );
  }

  if (currentUser && !showAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-gray-50 to-gray-100">
        <UserProfile 
          user={currentUser} 
          onLogout={handleLogout}
          onUpdateAvatar={handleUpdateAvatar}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
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
            <Button 
              onClick={() => setShowAuth(true)}
              className="gradient-blue-green text-white border-0 hover:opacity-90"
            >
              <Icon name="UserCircle" className="mr-2" size={18} />
              Войти
            </Button>
          </div>
        </div>
      </nav>

      <section id="home" className="pt-32 pb-20 px-6">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <h1 className="text-6xl lg:text-7xl font-bold leading-tight">
                Общайтесь
                <span className="block bg-gradient-to-r from-[#0088CC] to-[#34C759] bg-clip-text text-transparent">
                  без границ
                </span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Быстрый, безопасный и надёжный мессенджер для личного и группового общения. 
                Создавайте каналы, делитесь файлами и оставайтесь на связи.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="gradient-blue-green text-white border-0 hover:opacity-90 text-lg px-8">
                  <Icon name="Download" className="mr-2" size={20} />
                  Начать общение
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Узнать больше
                </Button>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-primary">0</div>
                  <div className="text-gray-600">Пользователей</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary">0</div>
                  <div className="text-gray-600">Сообщений в день</div>
                </div>
              </div>
            </div>
            <div className="relative animate-scale-in">
              <div className="absolute inset-0 gradient-blue-green blur-3xl opacity-20 rounded-full"></div>
              <div className="relative bg-white rounded-3xl shadow-2xl p-8 space-y-6">
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0088CC] to-[#34C759]"></div>
                  <div className="flex-1">
                    <div className="h-3 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-2 bg-gray-100 rounded w-24"></div>
                  </div>
                  <span className="text-xs text-gray-500">12:24</span>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-[#0088CC] to-[#34C759] rounded-2xl text-white ml-8">
                  <div className="flex-1">
                    <div className="font-medium mb-1">Привет! Как дела?</div>
                    <div className="flex items-center gap-2 text-xs opacity-80">
                      <Icon name="Check" size={14} />
                      <span>Прочитано</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#34C759] to-[#0088CC]"></div>
                  <div className="flex-1">
                    <div className="font-medium mb-1">Отлично! Новый мессенджер супер 🚀</div>
                    <div className="text-xs text-gray-500">Только что</div>
                  </div>
                </div>
                <div className="flex gap-3 items-center p-4 border-2 border-gray-100 rounded-2xl">
                  <Icon name="Paperclip" size={20} className="text-gray-400" />
                  <Icon name="Smile" size={20} className="text-gray-400" />
                  <div className="h-3 bg-gray-100 rounded flex-1"></div>
                  <Icon name="Send" size={20} className="text-primary" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-5xl font-bold mb-4">Возможности</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Всё необходимое для эффективного общения в одном приложении
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
                <CardContent className="p-6 space-y-4">
                  <div className="w-14 h-14 rounded-2xl gradient-blue-green flex items-center justify-center">
                    <Icon name={feature.icon as any} size={28} className="text-white" />
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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

      <section id="security" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-5xl font-bold mb-4">Безопасность</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Ваша конфиденциальность — наш главный приоритет
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {security.map((item, index) => (
              <div key={index} className="text-center space-y-4 p-8 rounded-3xl hover:bg-gray-50 transition-all duration-300 animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#0088CC]/10 to-[#34C759]/10 flex items-center justify-center mx-auto">
                  <Icon name={item.icon as any} size={40} className="text-primary" />
                </div>
                <h3 className="text-2xl font-bold">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="py-20 px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto max-w-3xl">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-5xl font-bold mb-4">Частые вопросы</h2>
            <p className="text-xl text-gray-600">
              Ответы на популярные вопросы о Not Lock Messenger
            </p>
          </div>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="bg-white rounded-2xl border-0 shadow-md px-6 animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <AccordionTrigger className="text-lg font-semibold hover:no-underline py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <section id="support" className="py-20 px-6">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12 animate-fade-in">
            <h2 className="text-5xl font-bold mb-4">Поддержка</h2>
            <p className="text-xl text-gray-600">
              Не нашли ответ? Свяжитесь с нами напрямую
            </p>
          </div>
          
          <div className="flex justify-center mb-8 animate-fade-in">
            <Button 
              size="lg" 
              className="bg-[#0088CC] hover:bg-[#0077B3] text-white"
              onClick={() => window.open('https://t.me/Not_Lock1', '_blank')}
            >
              <Icon name="Send" className="mr-2" size={20} />
              Telegram
            </Button>
          </div>

          <Card className="border-0 shadow-2xl animate-scale-in">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Имя</label>
                  <Input 
                    placeholder="Как вас зовут?" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="h-12"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <Input 
                    type="email" 
                    placeholder="your@email.com" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="h-12"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Сообщение</label>
                  <Textarea 
                    placeholder="Опишите ваш вопрос или проблему" 
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="min-h-32 resize-none"
                    required
                  />
                </div>
                <Button type="submit" size="lg" className="w-full gradient-blue-green text-white border-0 hover:opacity-90">
                  <Icon name="Send" className="mr-2" size={20} />
                  Отправить сообщение
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src="https://cdn.poehali.dev/files/b4dd4c30-699b-4f6f-a2d2-927daeee8639.png" alt="Not Lock" className="h-10 w-auto rounded-xl" />
              </div>
              <p className="text-gray-400">
                Современный мессенджер для быстрого и безопасного общения
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Продукт</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Возможности</a></li>
                <li><a href="#security" className="hover:text-white transition-colors">Безопасность</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Скачать</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Компания</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">О нас</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Блог</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Карьера</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Поддержка</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#support" className="hover:text-white transition-colors">Связаться</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Документация</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400">© 2024 Not Lock Messenger. Все права защищены.</p>
            <div className="flex gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Icon name="Twitter" size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Icon name="Facebook" size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Icon name="Instagram" size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;