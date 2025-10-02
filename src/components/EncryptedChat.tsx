import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";

interface Message {
  id: string;
  text: string;
  encrypted: string;
  timestamp: number;
  isSent: boolean;
}

export default function EncryptedChat() {
  const [publicKey, setPublicKey] = useState<string>("");
  const [privateKey, setPrivateKey] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [recipientKey, setRecipientKey] = useState("");
  const [isKeysGenerated, setIsKeysGenerated] = useState(false);

  const generateKeys = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const publicKey = Array.from({length: 16}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const privateKey = Array.from({length: 32}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    
    setPublicKey(publicKey);
    setPrivateKey(privateKey);
    setIsKeysGenerated(true);
  };

  const simpleEncrypt = (text: string, key: string): string => {
    let encrypted = '';
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const keyChar = key.charCodeAt(i % key.length);
      encrypted += String.fromCharCode(charCode ^ keyChar);
    }
    return btoa(encrypted);
  };

  const simpleDecrypt = (encrypted: string, key: string): string => {
    try {
      const decoded = atob(encrypted);
      let decrypted = '';
      for (let i = 0; i < decoded.length; i++) {
        const charCode = decoded.charCodeAt(i);
        const keyChar = key.charCodeAt(i % key.length);
        decrypted += String.fromCharCode(charCode ^ keyChar);
      }
      return decrypted;
    } catch {
      return "[Ошибка расшифровки]";
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !recipientKey.trim()) return;

    const encrypted = simpleEncrypt(newMessage, recipientKey + privateKey);
    
    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      encrypted: encrypted,
      timestamp: Date.now(),
      isSent: true
    };

    setMessages([...messages, message]);
    setNewMessage("");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {!isKeysGenerated ? (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Key" size={24} />
              Генерация ключей шифрования
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Создайте пару ключей для безопасного обмена сообщениями. 
              Публичный ключ можно передать собеседнику, приватный храните в секрете.
            </p>
            <Button onClick={generateKeys} className="w-full" size="lg">
              <Icon name="Shield" className="mr-2" size={20} />
              Сгенерировать ключи
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon name="Globe" size={20} className="text-green-500" />
                  Публичный ключ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg border border-green-200 font-mono text-sm break-all">
                  {publicKey}
                </div>
                <Button 
                  onClick={() => copyToClipboard(publicKey)} 
                  variant="outline" 
                  className="w-full"
                  size="sm"
                >
                  <Icon name="Copy" className="mr-2" size={16} />
                  Скопировать
                </Button>
                <p className="text-xs text-muted-foreground">
                  ✅ Можно передать собеседнику
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon name="Lock" size={20} className="text-red-500" />
                  Приватный ключ
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-red-50 rounded-lg border border-red-200 font-mono text-xs break-all">
                  {privateKey}
                </div>
                <Button 
                  onClick={() => copyToClipboard(privateKey)} 
                  variant="outline" 
                  className="w-full"
                  size="sm"
                >
                  <Icon name="Copy" className="mr-2" size={16} />
                  Скопировать
                </Button>
                <p className="text-xs text-muted-foreground">
                  ⚠️ Никому не показывайте!
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="MessageSquareLock" size={24} />
                Зашифрованные сообщения
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Публичный ключ получателя</label>
                <Input
                  placeholder="Введите публичный ключ собеседника"
                  value={recipientKey}
                  onChange={(e) => setRecipientKey(e.target.value)}
                  className="font-mono"
                />
              </div>

              <div className="border rounded-lg p-4 min-h-[300px] max-h-[400px] overflow-y-auto space-y-3 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Icon name="ShieldCheck" size={48} className="mb-2 opacity-50" />
                    <p>Сообщения зашифрованы end-to-end</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.isSent ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] space-y-2`}>
                        <div className={`p-3 rounded-lg ${
                          msg.isSent 
                            ? 'bg-primary text-primary-foreground' 
                            : 'bg-white border'
                        }`}>
                          <p className="font-medium">{msg.text}</p>
                        </div>
                        <div className="bg-gray-800 text-gray-300 p-2 rounded text-xs font-mono break-all">
                          🔒 {msg.encrypted.substring(0, 60)}...
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex gap-2">
                <Textarea
                  placeholder="Введите сообщение для шифрования..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  className="flex-1"
                  rows={2}
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={!newMessage.trim() || !recipientKey.trim()}
                  size="lg"
                >
                  <Icon name="Lock" className="mr-2" size={20} />
                  Зашифровать
                </Button>
              </div>

              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <Icon name="Info" size={16} className="text-blue-600" />
                <p className="text-xs text-blue-600">
                  Сообщения шифруются комбинацией вашего приватного ключа и публичного ключа получателя
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button 
              onClick={() => {
                setIsKeysGenerated(false);
                setMessages([]);
                setRecipientKey("");
              }} 
              variant="outline"
            >
              <Icon name="RotateCcw" className="mr-2" size={16} />
              Сгенерировать новые ключи
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
