import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import Icon from "@/components/ui/icon";

interface Friend {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline" | "away";
  statusText?: string;
  mutualFriends?: number;
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
  const [friends, setFriends] = useState<Friend[]>([]);

  const [requests, setRequests] = useState<FriendRequest[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [addFriendQuery, setAddFriendQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Friend[]>([]);

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

  const sendFriendRequest = (userId: string) => {
    const suggestion = suggestions.find(s => s.id === userId);
    if (suggestion) {
      const newRequest: FriendRequest = {
        id: Date.now().toString(),
        userId: suggestion.id,
        name: suggestion.name,
        avatar: suggestion.avatar,
        mutualFriends: suggestion.mutualFriends || 0,
        sentAt: new Date(),
        type: "outgoing"
      };
      setRequests([...requests, newRequest]);
      setSuggestions(suggestions.filter(s => s.id !== userId));
    }
  };

  const removeFriend = (friendId: string) => {
    setFriends(friends.filter(f => f.id !== friendId));
  };

  const getStatusColor = (status: Friend["status"]) => {
    switch (status) {
      case "online": return "bg-green-500";
      case "away": return "bg-yellow-500";
      case "offline": return "bg-gray-400";
      default: return "bg-gray-400";
    }
  };

  const getStatusText = (status: Friend["status"]) => {
    switch (status) {
      case "online": return "В сети";
      case "away": return "Нет на месте";
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
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">
                Все ({friends.length})
              </TabsTrigger>
              <TabsTrigger value="online">
                Онлайн ({friends.filter(f => f.status === "online").length})
              </TabsTrigger>
              <TabsTrigger value="requests">
                Запросы ({incomingRequests.length})
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
                    <div key={friend.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                      <div className="relative">
                        <img 
                          src={friend.avatar} 
                          alt={friend.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className={`absolute bottom-0 right-0 w-4 h-4 ${getStatusColor(friend.status)} border-2 border-white rounded-full`}></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{friend.name}</p>
                        <p className="text-sm text-gray-500 truncate">
                          {friend.statusText || getStatusText(friend.status)}
                        </p>
                      </div>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="sm" variant="outline">
                          <Icon name="MessageCircle" size={16} className="mr-1" />
                          Написать
                        </Button>
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => removeFriend(friend.id)}
                        >
                          <Icon name="UserMinus" size={16} />
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

            {/* Добавить друга */}
            <TabsContent value="add" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Input
                    placeholder="Введите имя пользователя или email"
                    value={addFriendQuery}
                    onChange={(e) => setAddFriendQuery(e.target.value)}
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Поиск по имени, email или ID пользователя
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-500 uppercase mb-3">
                    Возможно, вы знаете
                  </h3>
                  <div className="space-y-3">
                    {suggestions.map((suggestion) => (
                      <div key={suggestion.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <img 
                          src={suggestion.avatar} 
                          alt={suggestion.name}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{suggestion.name}</p>
                          <p className="text-sm text-gray-500">
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
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}