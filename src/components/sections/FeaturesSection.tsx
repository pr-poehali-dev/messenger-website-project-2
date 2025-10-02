import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

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

export default function FeaturesSection() {
  return (
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
  );
}
