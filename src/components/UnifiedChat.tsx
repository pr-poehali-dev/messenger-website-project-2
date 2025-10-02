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
  type: "text" | "voice";
}

interface VoiceUser {
  id: string;
  name: string;
  isMuted: boolean;
  isSpeaking: boolean;
}

export default function UnifiedChat() {
  const [channels] = useState<Channel[]>([
    { id: "1", name: "общий", icon: "Hash", type: "text" },
    { id: "2", name: "помощь", icon: "HelpCircle", type: "text" },
    { id: "3", name: "голосовая-1", icon: "Volume2", type: "voice" },
    { id: "4", name: "голосовая-2", icon: "Radio", type: "voice" },
  ]);

  const [activeChannel, setActiveChannel] = useState<Channel>(channels[0]);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      author: "Модератор",
      avatar: "👨‍💼",
      content: "Добро пожаловать! Выберите голосовой канал для общения голосом.",
      timestamp: new Date(Date.now() - 3600000),
      reactions: [{ emoji: "👋", count: 5 }]
    }
  ]);

  const [newMessage, setNewMessage] = useState("");
  const [username, setUsername] = useState("Вы");
  const [showUsernameInput, setShowUsernameInput] = useState(true);
  const [isInVoice, setIsInVoice] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceUsers, setVoiceUsers] = useState<VoiceUser[]>([]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const joinVoiceChannel = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = stream;
      
      audioContextRef.current = new AudioContext();
      const analyser = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyser);
      
      setIsInVoice(true);
      
      const currentUser: VoiceUser = {
        id: "local",
        name: username,
        isMuted: false,
        isSpeaking: false
      };
      setVoiceUsers([currentUser]);
      
      detectSpeaking(analyser);
      
    } catch (error) {
      console.error("Ошибка доступа к микрофону:", error);
      alert("Не удалось получить доступ к микрофону. Проверьте разрешения браузера.");
    }
  };

  const detectSpeaking = (analyser: AnalyserNode) => {
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const checkAudio = () => {
      if (!isInVoice) return;
      
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      
      setVoiceUsers(prev => 
        prev.map(user => 
          user.id === "local" 
            ? { ...user, isSpeaking: average > 30 && !isMuted }
            : user
        )
      );
      
      requestAnimationFrame(checkAudio);
    };
    
    checkAudio();
  };

  const leaveVoiceChannel = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    setIsInVoice(false);
    setIsMuted(false);
    setVoiceUsers([]);
  };

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
      
      setVoiceUsers(prev =>
        prev.map(user =>
          user.id === "local" ? { ...user, isMuted: !audioTrack.enabled } : user
        )
      );
    }
  };

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

  const handleChannelClick = (channel: Channel) => {
    setActiveChannel(channel);
    if (channel.type === 'voice' && !isInVoice) {
      joinVoiceChannel();
    } else if (channel.type === 'text' && isInVoice) {
      leaveVoiceChannel();
    }
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
          <div className="w-64 bg-gray-100 dark:bg-gray-900 border-r flex flex-col">
            <div className="p-4 border-b bg-white dark:bg-gray-800">
              <h2 className="font-bold text-lg flex items-center gap-2">
                <Icon name="MessageSquare" size={20} />
                Not Lock
              </h2>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-3">
                <div>
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                    Текстовые каналы
                  </div>
                  <div className="space-y-1">
                    {channels.filter(ch => ch.type === 'text').map((channel) => (
                      <button
                        key={channel.id}
                        onClick={() => handleChannelClick(channel)}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                          activeChannel.id === channel.id ? 'bg-gray-200 dark:bg-gray-700' : ''
                        }`}
                      >
                        <Icon name={channel.icon as any} size={18} className="text-gray-600 dark:text-gray-400" />
                        <span className="text-sm font-medium">{channel.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
                    Голосовые каналы
                  </div>
                  <div className="space-y-1">
                    {channels.filter(ch => ch.type === 'voice').map((channel) => (
                      <button
                        key={channel.id}
                        onClick={() => handleChannelClick(channel)}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                          activeChannel.id === channel.id && isInVoice ? 'bg-green-100 dark:bg-green-900' : ''
                        }`}
                      >
                        <Icon name={channel.icon as any} size={18} className={
                          activeChannel.id === channel.id && isInVoice 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-gray-600 dark:text-gray-400'
                        } />
                        <span className="text-sm font-medium">{channel.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Панель пользователя */}
            <div className="p-3 border-t bg-gray-50 dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-sm">
                  😊
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{username}</div>
                  <div className="text-xs text-gray-500">
                    {isInVoice ? "🔊 В голосовом чате" : "Онлайн"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Основная область чата */}
          <div className="flex-1 flex flex-col">
            {/* Заголовок канала */}
            <div className="p-4 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon name={activeChannel.icon as any} size={20} className="text-gray-600" />
                <h3 className="font-semibold">{activeChannel.name}</h3>
                {activeChannel.type === 'voice' && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                    Голосовой канал
                  </span>
                )}
              </div>

              {/* Голосовые элементы управления */}
              {isInVoice && activeChannel.type === 'voice' && (
                <div className="flex gap-2">
                  <Button
                    onClick={toggleMute}
                    variant={isMuted ? "destructive" : "outline"}
                    size="sm"
                  >
                    <Icon name={isMuted ? "MicOff" : "Mic"} size={16} className="mr-1" />
                    {isMuted ? "Включить" : "Выключить"}
                  </Button>
                  <Button
                    onClick={leaveVoiceChannel}
                    variant="destructive"
                    size="sm"
                  >
                    <Icon name="PhoneOff" size={16} className="mr-1" />
                    Выйти
                  </Button>
                </div>
              )}
            </div>

            {/* Область контента */}
            {activeChannel.type === 'text' ? (
              <>
                {/* Текстовые сообщения */}
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
                </div>
              </>
            ) : (
              /* Голосовой канал */
              <div className="flex-1 p-6 flex flex-col items-center justify-center">
                {!isInVoice ? (
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Icon name="Volume2" size={40} className="text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold">Голосовой канал {activeChannel.name}</h3>
                    <p className="text-muted-foreground max-w-md">
                      Подключитесь к голосовому каналу для общения в реальном времени
                    </p>
                    <Button onClick={joinVoiceChannel} size="lg" className="bg-green-600 hover:bg-green-700">
                      <Icon name="Headphones" className="mr-2" size={20} />
                      Подключиться
                    </Button>
                  </div>
                ) : (
                  <div className="w-full max-w-md space-y-4">
                    <h3 className="text-lg font-semibold mb-4">Участники ({voiceUsers.length})</h3>
                    {voiceUsers.map(user => (
                      <div
                        key={user.id}
                        className={`flex items-center gap-3 p-4 rounded-lg border transition-all ${
                          user.isSpeaking ? "bg-green-50 border-green-200 dark:bg-green-900/20" : "bg-background"
                        }`}
                      >
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                            user.isSpeaking ? "bg-green-500" : "bg-muted"
                          }`}>
                            <Icon 
                              name="User" 
                              size={24} 
                              className={user.isSpeaking ? "text-white" : "text-muted-foreground"}
                            />
                          </div>
                          {user.isSpeaking && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.isMuted ? "Микрофон выключен" : user.isSpeaking ? "Говорит..." : "В сети"}
                          </p>
                        </div>
                        {user.isMuted && (
                          <Icon name="MicOff" size={18} className="text-muted-foreground" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
