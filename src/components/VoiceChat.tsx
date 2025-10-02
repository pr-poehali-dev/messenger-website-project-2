import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import SimplePeer from "simple-peer";

interface User {
  id: string;
  name: string;
  isMuted: boolean;
  isSpeaking: boolean;
}

export default function VoiceChat() {
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [roomName, setRoomName] = useState("");
  const [showRoomInput, setShowRoomInput] = useState(false);
  
  const localStreamRef = useRef<MediaStream | null>(null);
  const peersRef = useRef<Map<string, SimplePeer.Instance>>(new Map());
  const audioContextRef = useRef<AudioContext | null>(null);

  const startVoiceChat = async (room: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      localStreamRef.current = stream;
      
      audioContextRef.current = new AudioContext();
      const analyser = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyser);
      
      setIsConnected(true);
      setShowRoomInput(false);
      
      const currentUser: User = {
        id: "local",
        name: "Вы",
        isMuted: false,
        isSpeaking: false
      };
      setUsers([currentUser]);
      
      detectSpeaking(analyser);
      
    } catch (error) {
      console.error("Ошибка доступа к микрофону:", error);
      alert("Не удалось получить доступ к микрофону. Проверьте разрешения браузера.");
    }
  };

  const detectSpeaking = (analyser: AnalyserNode) => {
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    
    const checkAudio = () => {
      if (!isConnected) return;
      
      analyser.getByteFrequencyData(dataArray);
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
      
      setUsers(prev => 
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

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
      
      setUsers(prev =>
        prev.map(user =>
          user.id === "local" ? { ...user, isMuted: !audioTrack.enabled } : user
        )
      );
    }
  };

  const disconnect = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    
    peersRef.current.forEach(peer => peer.destroy());
    peersRef.current.clear();
    
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    
    setIsConnected(false);
    setIsMuted(false);
    setUsers([]);
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, []);

  if (!isConnected && !showRoomInput) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon name="Mic" size={24} />
            Голосовой чат
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Подключитесь к голосовой комнате для общения с другими пользователями
          </p>
          <Button 
            onClick={() => setShowRoomInput(true)} 
            className="w-full"
            size="lg"
          >
            <Icon name="Headphones" className="mr-2" size={20} />
            Подключиться к комнате
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (showRoomInput && !isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Выберите комнату</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Название комнаты</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="Введите название комнаты"
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => roomName && startVoiceChat(roomName)}
              disabled={!roomName}
              className="flex-1"
            >
              Войти
            </Button>
            <Button 
              onClick={() => setShowRoomInput(false)}
              variant="outline"
            >
              Отмена
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Icon name="Radio" size={24} className="text-green-500" />
            Голосовая комната
          </span>
          <span className="text-sm font-normal text-muted-foreground">
            {roomName || "Общая"}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            Участники ({users.length})
          </h3>
          <div className="space-y-2">
            {users.map(user => (
              <div
                key={user.id}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  user.isSpeaking ? "bg-green-50 border-green-200" : "bg-background"
                }`}
              >
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    user.isSpeaking ? "bg-green-500" : "bg-muted"
                  }`}>
                    <Icon 
                      name="User" 
                      size={20} 
                      className={user.isSpeaking ? "text-white" : "text-muted-foreground"}
                    />
                  </div>
                  {user.isSpeaking && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {user.isMuted ? "Микрофон выключен" : user.isSpeaking ? "Говорит..." : "В сети"}
                  </p>
                </div>
                {user.isMuted && (
                  <Icon name="MicOff" size={16} className="text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={toggleMute}
            variant={isMuted ? "destructive" : "outline"}
            className="flex-1"
            size="lg"
          >
            <Icon name={isMuted ? "MicOff" : "Mic"} className="mr-2" size={20} />
            {isMuted ? "Включить микрофон" : "Выключить микрофон"}
          </Button>
          <Button
            onClick={disconnect}
            variant="destructive"
            size="lg"
          >
            <Icon name="PhoneOff" size={20} />
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground">
          💡 Разрешите доступ к микрофону в настройках браузера
        </p>
      </CardContent>
    </Card>
  );
}
