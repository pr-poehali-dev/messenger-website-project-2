import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import Icon from "@/components/ui/icon";

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface DirectChat {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  isOnline: boolean;
}

interface DirectMessagesProps {
  currentUserId: string;
  currentUserName: string;
  currentUserAvatar: string;
}

export default function DirectMessages({ currentUserId, currentUserName, currentUserAvatar }: DirectMessagesProps) {
  const [chats, setChats] = useState<DirectChat[]>([]);

  const [activeChat, setActiveChat] = useState<DirectChat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !activeChat) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUserId,
      senderName: currentUserName,
      senderAvatar: currentUserAvatar,
      content: newMessage,
      timestamp: new Date(),
      isRead: false
    };

    setMessages([...messages, message]);
    setNewMessage("");

    setChats(chats.map(chat => 
      chat.id === activeChat.id 
        ? { ...chat, lastMessage: newMessage, lastMessageTime: new Date() }
        : chat
    ));
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    
    if (diff < 60000) return "только что";
    if (diff < 3600000) return `${Math.floor(diff / 60000)} мин назад`;
    if (diff < 86400000) return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  const filteredChats = chats.filter(chat => 
    chat.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="overflow-hidden">
        <div className="flex h-[600px]">
          {/* Список чатов */}
          <div className="w-80 bg-gray-50 dark:bg-gray-900 border-r flex flex-col">
            <div className="p-4 border-b bg-white dark:bg-gray-800">
              <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Icon name="MessageSquare" size={20} />
                Личные сообщения
              </h2>
              <div className="relative">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Найти беседу"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {filteredChats.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => {
                      setActiveChat(chat);
                      setChats(chats.map(c => 
                        c.id === chat.id ? { ...c, unreadCount: 0 } : c
                      ));
                    }}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-colors ${
                      activeChat?.id === chat.id ? 'bg-white dark:bg-gray-800' : ''
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img 
                        src={chat.userAvatar} 
                        alt={chat.userName}
                        className="w-12 h-12 rounded-full"
                      />
                      {chat.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-semibold text-sm truncate">{chat.userName}</p>
                        {chat.lastMessageTime && (
                          <span className="text-xs text-gray-500">
                            {formatTime(chat.lastMessageTime)}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unreadCount > 0 && (
                      <div className="flex-shrink-0 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                        {chat.unreadCount}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Область чата */}
          <div className="flex-1 flex flex-col">
            {activeChat ? (
              <>
                {/* Заголовок чата */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={activeChat.userAvatar} 
                        alt={activeChat.userName}
                        className="w-10 h-10 rounded-full"
                      />
                      {activeChat.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{activeChat.userName}</h3>
                      <p className="text-xs text-gray-500">
                        {activeChat.isOnline ? "В сети" : "Не в сети"}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Icon name="Phone" size={18} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Icon name="Video" size={18} />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Icon name="MoreVertical" size={18} />
                    </Button>
                  </div>
                </div>

                {/* Сообщения */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message, index) => {
                      const isCurrentUser = message.senderId === currentUserId;
                      const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
                      
                      return (
                        <div
                          key={message.id}
                          className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''} ${!showAvatar ? 'ml-12' : ''}`}
                        >
                          {showAvatar && !isCurrentUser && (
                            <img 
                              src={message.senderAvatar} 
                              alt={message.senderName}
                              className="w-10 h-10 rounded-full flex-shrink-0"
                            />
                          )}
                          <div className={`flex-1 ${isCurrentUser ? 'flex justify-end' : ''}`}>
                            {showAvatar && !isCurrentUser && (
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-sm">{message.senderName}</span>
                                <span className="text-xs text-gray-500">
                                  {formatTime(message.timestamp)}
                                </span>
                              </div>
                            )}
                            <div className={`inline-block max-w-md ${
                              isCurrentUser 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-gray-100 dark:bg-gray-800'
                            } rounded-2xl px-4 py-2`}>
                              <p className="text-sm break-words">{message.content}</p>
                            </div>
                            {isCurrentUser && showAvatar && (
                              <div className="text-xs text-gray-500 mt-1 text-right">
                                {formatTime(message.timestamp)}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                    {isTyping && (
                      <div className="flex gap-3 items-center">
                        <img 
                          src={activeChat.userAvatar} 
                          alt={activeChat.userName}
                          className="w-10 h-10 rounded-full"
                        />
                        <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Поле ввода */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Icon name="Plus" size={20} />
                    </Button>
                    <Input
                      placeholder={`Написать ${activeChat.userName}`}
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
                    <Button variant="ghost" size="icon">
                      <Icon name="Smile" size={20} />
                    </Button>
                    <Button 
                      onClick={sendMessage} 
                      disabled={!newMessage.trim()}
                      size="icon"
                    >
                      <Icon name="Send" size={18} />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Icon name="MessageCircle" size={64} className="mx-auto mb-4 opacity-50" />
                  <p>Выберите чат для начала общения</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}