import Icon from "@/components/ui/icon";

export default function Footer() {
  return (
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
  );
}
