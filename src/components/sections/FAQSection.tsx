import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

export default function FAQSection() {
  return (
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
  );
}
