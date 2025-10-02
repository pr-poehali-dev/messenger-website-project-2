import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/ui/icon";

interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away" | "dnd";
  statusText?: string;
  mutualFriends?: number;
  bio?: string;
  tags?: string[];
  joinedDate?: Date;
  isBlocked?: boolean;
}

interface FriendRequest {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  mutualFriends: number;
  sentAt: Date;
  type: "incoming" | "outgoing";
}

export default function FriendsList() {
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: "1",
      name: "Алексей Смирнов",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      status: "online",
      statusText: "Играет в игру",
      mutualFriends: 15,
      bio: "Разработчик и геймер",
      tags: ["Программирование", "Игры", "Музыка"],
      joinedDate: new Date(2024, 0, 15)
    },
    {
      id: "2",
      name: "Мария Иванова",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=maria",
      status: "away",
      statusText: "Отошла",
      mutualFriends: 8,
      bio: "Дизайнер UI/UX",
      tags: ["Дизайн", "Искусство"],
      joinedDate: new Date(2024, 1, 20)
    },
    {
      id: "3",
      name: "Дмитрий Петров",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=dmitry",
      status: "dnd",
      statusText: "Не беспокоить",
      mutualFriends: 12,
      bio: "Backend разработчик",
      tags: ["Python", "DevOps"],
      joinedDate: new Date(2023, 11, 5)
    },
    {
      id: "4",
      name: "Елена Соколова",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=elena",
      status: "offline",
      mutualFriends: 5,
      bio: "Менеджер проектов",
      tags: ["Управление", "Agile"],
      joinedDate: new Date(2024, 2, 10)
    },
    {
      id: "5",
      name: "Иван Козлов",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=ivan",
      status: "online",
      statusText: "Пишет код",
      mutualFriends: 20,
      bio: "Full-stack разработчик",
      tags: ["React", "Node.js", "TypeScript"],
      joinedDate: new Date(2023, 9, 1)
    }
  ]);

  const [requests, setRequests] = useState<FriendRequest[]>([
    {
      id: "r1",
      userId: "u1",
      name: "Анна Волкова",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=anna",
      mutualFriends: 3,
      sentAt: new Date(),
      type: "incoming"
    },
    {
      id: "r2",
      userId: "u2",
      name: "Сергей Новиков",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sergey",
      mutualFriends: 7,
      sentAt: new Date(),
      type: "incoming"
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [addFriendQuery, setAddFriendQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Friend[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const allUsers: Friend[] = [
    {
      id: "s1",
      name: "Ольга Морозова",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=olga",
      status: "online",
      mutualFriends: 4,
      bio: "Frontend разработчик",
      tags: ["React", "CSS"]
    },
    {
      id: "s2",
      name: "Павел Лебедев",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=pavel",
      status: "offline",
      mutualFriends: 2,
      bio: "QA инженер",
      tags: ["Testing", "Automation"]
    },
    {
      id: "s3",
      name: "Наталья Белова",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=natalia",
      status: "online",
      mutualFriends: 6,
      bio: "Product Manager",
      tags: ["Product", "Strategy"]
    },
    {
      id: "s4",
      name: "Андрей Орлов",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=andrey",
      status: "away",
      mutualFriends: 1,
      bio: "DevOps Engineer",
      tags: ["Docker", "Kubernetes"]
    },
    {
      id: "s5",
      name: "Светлана Зайцева",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=svetlana",
      status: "online",
      mutualFriends: 9,
      bio: "UX Researcher",
      tags: ["UX", "Research"]
    }
  ];
  
  const [suggestions] = useState<Friend[]>(allUsers.slice(0, 2));
  const [blockedUsers, setBlockedUsers] = useState<Friend[]>([]);

  const acceptRequest = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (request) {
      const newFriend: Friend = {
        id: request.userId,
        name: request.name,
        avatar: request.avatar,
        status: "online",
        mutualFriends: request.mutualFriends
      };
      setFriends([...friends, newFriend]);
      setRequests(requests.filter(r => r.id !== requestId));
    }
  };

  const declineRequest = (requestId: string) => {
    setRequests(requests.filter(r => r.id !== requestId));
  };

  const searchUsers = (query: string) => {
    setAddFriendQuery(query);
    
    if (!query.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    
    setIsSearching(true);
    
    const results = allUsers.filter(user => 
      !friends.some(f => f.id === user.id) &&
      !requests.some(r => r.userId === user.id) &&
      !blockedUsers.some(b => b.id === user.id) &&
      user.name.toLowerCase().includes(query.toLowerCase())
    );
    
    setSearchResults(results);
  };

  const sendFriendRequest = (userId: string) => {
    const user = searchResults.find(s => s.id === userId) || suggestions.find(s => s.id === userId);
    if (user) {
      const newRequest: FriendRequest = {
        id: Date.now().toString(),
        userId: user.id,
        name: user.name,
        avatar: user.avatar,
        mutualFriends: user.mutualFriends || 0,
        sentAt: new Date(),
        type: "outgoing"
      };
      setRequests([...requests, newRequest]);
      setSearchResults(searchResults.filter(s => s.id !== userId));
    }
  };

  const removeFriend = (friendId: string) => {
    setFriends(friends.filter(f => f.id !== friendId));
  };

  const blockUser = (friendId: string) => {
    const friend = friends.find(f => f.id === friendId);
    if (friend) {
      setBlockedUsers([...blockedUsers, { ...friend, isBlocked: true }]);
      setFriends(friends.filter(f => f.id !== friendId));
    }
  };

  const unblockUser = (userId: string) => {
    const user = blockedUsers.find(u => u.id === userId);
    if (user) {
      setFriends([...friends, { ...user, isBlocked: false }]);
      setBlockedUsers(blockedUsers.filter(u => u.id !== userId));
    }
  };

  const getStatusColor = (status: Friend["status"]) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "dnd": return "bg-red-500";
      case "offline": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  const getStatusText = (status: Friend["status"]) => {
    switch (status) {
      case "online": return "В сети";
      case "away": return "Нет на месте";
      case "dnd": return "Не беспокоить";
      case "offline": return "Не в сети";
      default: return "Не в сети";
    }
  };

  const filteredFriends = friends.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const incomingRequests = requests.filter(r => r.type === "incoming");
  const outgoingRequests = requests.filter(r => r.type === "outgoing");

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Users" size={24} />
            Друзья
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">
                Все ({friends.length})
              </TabsTrigger>
              <TabsTrigger value="online">
                Онлайн ({friends.filter(f => f.status === "online").length})
              </TabsTrigger>
              <TabsTrigger value="requests">
                Запросы ({incomingRequests.length})
              </TabsTrigger>
              <TabsTrigger value="blocked">
                Заблок. ({blockedUsers.length})
              </TabsTrigger>
              <TabsTrigger value="add">
                Добавить
              </TabsTrigger>
            </TabsList>

            {/* Все друзья */}
            <TabsContent value="all" className="space-y-4">
              <div className="relative">
                <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Поиск друзей"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {filteredFriends.map((friend) => (
                    <div key={friend.id} className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors group border border-transparent hover:border-gray-200">
                      <div className="relative">
                        <img 
                          src={friend.avatar} 
                          alt={friend.name}
                          className="w-14 h-14 rounded-full"
                        />
                        <div className={`absolute bottom-0 right-0 w-4 h-4 ${getStatusColor(friend.status)} border-2 border-white rounded-full`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold truncate">{friend.name}</p>
                          {friend.mutualFriends && friend.mutualFriends > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              {friend.mutualFriends} общих
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500 truncate mb-2">
                          {friend.statusText || getStatusText(friend.status)}
                        </p>
                        {friend.bio && (
                          <p className="text-xs text-gray-400 mb-2 truncate">{friend.bio}</p>
                        )}
                        {friend.tags && friend.tags.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {friend.tags.slice(0, 3).map((tag, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="outline">
                          <Icon name="MessageCircle" size={16} />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Icon name="Phone" size={16} />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => blockUser(friend.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Icon name="Ban" size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Онлайн друзья */}
            <TabsContent value="online" className="space-y-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {friends.filter(f => f.status === "online").map((friend) => (
                    <div key={friend.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="relative">
                        <img 
                          src={friend.avatar} 
                          alt={friend.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{friend.name}</p>
                        <p className="text-sm text-green-600 truncate">
                          {friend.statusText || "В сети"}
                        </p>
                      </div>
                      <Button size="sm">
                        <Icon name="MessageCircle" size={16} className="mr-1" />
                        Написать
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Запросы в друзья */}
            <TabsContent value="requests" className="space-y-4">
              <div className="space-y-4">
                {incomingRequests.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                      Входящие ({incomingRequests.length})
                    </h3>
                    <div className="space-y-3">
                      {incomingRequests.map((request) => (
                        <div key={request.id} className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
                          <img 
                            src={request.avatar} 
                            alt={request.name}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{request.name}</p>
                            <p className="text-sm text-gray-500">
                              {request.mutualFriends} общих друзей
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm"
                              onClick={() => acceptRequest(request.id)}
                            >
                              <Icon name="Check" size={16} className="mr-1" />
                              Принять
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => declineRequest(request.id)}
                            >
                              <Icon name="X" size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {outgoingRequests.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                      Исходящие ({outgoingRequests.length})
                    </h3>
                    <div className="space-y-3">
                      {outgoingRequests.map((request) => (
                        <div key={request.id} className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                          <img 
                            src={request.avatar} 
                            alt={request.name}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{request.name}</p>
                            <p className="text-sm text-gray-500">Запрос отправлен</p>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => declineRequest(request.id)}
                          >
                            <Icon name="X" size={16} className="mr-1" />
                            Отменить
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {incomingRequests.length === 0 && outgoingRequests.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <Icon name="UserPlus" size={48} className="mx-auto mb-3 opacity-50" />
                    <p>Нет запросов в друзья</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Заблокированные */}
            <TabsContent value="blocked" className="space-y-4">
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {blockedUsers.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Icon name="Ban" size={48} className="mx-auto mb-3 opacity-50" />
                      <p>Нет заблокированных пользователей</p>
                    </div>
                  ) : (
                    blockedUsers.map((user) => (
                      <div key={user.id} className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-100">
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-12 h-12 rounded-full opacity-60"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{user.name}</p>
                          <p className="text-sm text-red-600">Заблокирован</p>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => unblockUser(user.id)}
                        >
                          <Icon name="UserCheck" size={16} className="mr-1" />
                          Разблокировать
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Добавить друга */}
            <TabsContent value="add" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <div className="relative">
                    <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Поиск по никнейму..."
                      value={addFriendQuery}
                      onChange={(e) => searchUsers(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Начните вводить никнейм для поиска пользователей
                  </p>
                </div>

                {/* Результаты поиска */}
                {isSearching && searchResults.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                      Результаты поиска ({searchResults.length})
                    </h3>
                    <ScrollArea className="h-[250px] pr-4">
                      <div className="space-y-3">
                        {searchResults.map((user) => (
                          <div key={user.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200">
                            <div className="relative">
                              <img 
                                src={user.avatar} 
                                alt={user.name}
                                className="w-12 h-12 rounded-full"
                              />
                              <div className={`absolute bottom-0 right-0 w-3 h-3 ${getStatusColor(user.status)} border-2 border-white rounded-full`}></div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold truncate">{user.name}</p>
                              <p className="text-xs text-gray-500 mb-1">{user.bio}</p>
                              {user.mutualFriends && user.mutualFriends > 0 && (
                                <p className="text-xs text-blue-600">
                                  {user.mutualFriends} общих друзей
                                </p>
                              )}
                            </div>
                            <Button 
                              size="sm"
                              onClick={() => sendFriendRequest(user.id)}
                            >
                              <Icon name="UserPlus" size={16} className="mr-1" />
                              Добавить
                            </Button>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                )}

                {isSearching && searchResults.length === 0 && addFriendQuery.trim() && (
                  <div className="text-center py-8 text-gray-500">
                    <Icon name="SearchX" size={48} className="mx-auto mb-3 opacity-50" />
                    <p>Пользователей с никнеймом "{addFriendQuery}" не найдено</p>
                  </div>
                )}

                {/* Рекомендации */}
                {!isSearching && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                      Возможно, вы знаете
                    </h3>
                    <div className="space-y-3">
                      {suggestions.map((suggestion) => (
                        <div key={suggestion.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <img 
                            src={suggestion.avatar} 
                            alt={suggestion.name}
                            className="w-12 h-12 rounded-full"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold truncate">{suggestion.name}</p>
                            <p className="text-xs text-gray-500 mb-1">{suggestion.bio}</p>
                            <p className="text-xs text-blue-600">
                              {suggestion.mutualFriends} общих друзей
                            </p>
                          </div>
                          <Button 
                            size="sm"
                            onClick={() => sendFriendRequest(suggestion.id)}
                          >
                            <Icon name="UserPlus" size={16} className="mr-1" />
                            Добавить
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}