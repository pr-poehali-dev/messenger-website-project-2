import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";

export default function SupportSection() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Поддержка Not Lock: ${formData.name}`);
    const body = encodeURIComponent(`Имя: ${formData.name}\nEmail: ${formData.email}\n\nСообщение:\n${formData.message}`);
    window.location.href = `mailto:timofey.dyakonenko@mail.ru?subject=${subject}&body=${body}`;
    setFormData({ name: "", email: "", message: "" });
  };

  return (
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
  );
}
