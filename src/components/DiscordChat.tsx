import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Icon from "@/components/ui/icon";

interface Message {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: Date;
  reactions: { emoji: string; count: number }[];
}

interface Channel {
  id: string;
  name: string;
  icon: string;
}

export default function DiscordChat() {
  const [channels] = useState<Channel[]>([
    { id: "1", name: "общий", icon: "Hash" },
    { id: "2", name: "помощь", icon: "HelpCircle" },
    { id: "3", name: "новости", icon: "Newspaper" },
    { id: "4", name: "разработка", icon: "Code" },
  ]);

  const [activeChannel, setActiveChannel] = useState<Channel>(channels[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      author: "Модератор",
      avatar: "👨‍💼",
      content: "Добро пожаловать в чат Not Lock! Здесь можно общаться и задавать вопросы.",
      timestamp: new Date(Date.now() - 3600000),
      reactions: [{ emoji: "👋", count: 5 }]
    },
    {
      id: "2",
      author: "Пользователь",
      avatar: "👤",
      content: "Привет всем! Отличный мессенджер!",
      timestamp: new Date(Date.now() - 1800000),
      reactions: [{ emoji: "🔥", count: 3 }]
    }
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("Вы");
  const [showUsernameInput, setShowUsernameInput] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      author: username,
      avatar: "😊",
      content: newMessage,
      timestamp: new Date(),
      reactions: []
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const addReaction = (messageId: string, emoji: string) => {
    setMessages(messages.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions.find(r => r.emoji === emoji);
        if (existingReaction) {
          return {
            ...msg,
            reactions: msg.reactions.map(r =>
              r.emoji === emoji ? { ...r, count: r.count + 1 } : r
            )
          };
        } else {
          return {
            ...msg,
            reactions: [...msg.reactions, { emoji, count: 1 }]
          };
        }
      }
      return msg;
    }));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  };

  if (showUsernameInput) {
    return (
      <Card className="w-full max-w-md mx-auto p-6 space-y-4">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto">
            <Icon name="User" size={32} className="text-white" />
          </div>
          <h3 className="text-xl font-bold">Войти в чат</h3>
          <p className="text-sm text-muted-foreground">Введите ваше имя для начала общения</p>
        </div>
        <Input
          placeholder="Ваше имя"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && username.trim()) {
              setShowUsernameInput(false);
            }
          }}
        />
        <Button 
          onClick={() => username.trim() && setShowUsernameInput(false)} 
          className="w-full"
          disabled={!username.trim()}
        >
          Войти
        </Button>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="overflow-hidden">
        <div className="flex h-[600px]">
          {/* Sidebar с каналами */}
          <div className="w-64 bg-gray-100 dark:bg-gray-900 border-r">
            <div className="p-4 border-b bg-white dark:bg-gray-800">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Icon name="Hash" size={20} />
                Not Lock Chat
              </h2>
            </div>
            <ScrollArea className="h-[calc(600px-73px)]">
              <div className="p-2 space-y-1">
                <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                  Текстовые каналы
                </div>
                {channels.map((channel) => (
                  <button
                    key={channel.id}
                    onClick={() => setActiveChannel(channel)}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                      activeChannel.id === channel.id ? 'bg-gray-200 dark:bg-gray-700' : ''
                    }`}
                  >
                    <Icon name={channel.icon as any} size={18} className="text-gray-600 dark:text-gray-400" />
                    <span className="text-sm font-medium">{channel.name}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Основная область чата */}
          <div className="flex-1 flex flex-col">
            {/* Заголовок канала */}
            <div className="p-4 border-b flex items-center gap-2">
              <Icon name={activeChannel.icon as any} size={20} className="text-gray-600" />
              <h3 className="font-semibold">{activeChannel.name}</h3>
            </div>

            {/* Сообщения */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded transition-colors">
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-2xl flex-shrink-0">
                        {message.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="font-semibold text-sm">{message.author}</span>
                          <span className="text-xs text-gray-500">
                            {formatTime(message.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm mt-1 break-words">{message.content}</p>
                        
                        {/* Реакции */}
                        <div className="flex gap-1 mt-2">
                          {message.reactions.map((reaction, idx) => (
                            <button
                              key={idx}
                              onClick={() => addReaction(message.id, reaction.emoji)}
                              className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                              <span className="text-sm">{reaction.emoji}</span>
                              <span className="text-xs font-medium">{reaction.count}</span>
                            </button>
                          ))}
                          <button
                            onClick={() => {
                              const emojis = ['👍', '❤️', '😂', '🔥', '👏'];
                              const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
                              addReaction(message.id, randomEmoji);
                            }}
                            className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                          >
                            <Icon name="Smile" size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Поле ввода */}
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder={`Написать в #${activeChannel.name}`}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <Icon name="Send" size={18} />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                💡 Нажмите Enter для отправки или на смайлик у сообщения для реакции
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
