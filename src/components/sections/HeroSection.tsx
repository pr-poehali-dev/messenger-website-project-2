import { Button } from "@/components/ui/button";
import Icon from "@/components/ui/icon";

export default function HeroSection() {
  return (
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
  );
}
