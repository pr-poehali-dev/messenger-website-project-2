import Icon from "@/components/ui/icon";

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

export default function SecuritySection() {
  return (
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
  );
}
