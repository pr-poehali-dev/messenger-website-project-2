import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Icon from "@/components/ui/icon";

interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  password: string;
  avatar: string;
  createdAt: Date;
}

interface AuthSystemProps {
  onLogin: (user: User) => void;
}

export default function AuthSystem({ onLogin }: AuthSystemProps) {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('users');
    return saved ? JSON.parse(saved) : [];
  });
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerDisplayName, setRegisterDisplayName] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!registerEmail || !registerUsername || !registerDisplayName || !registerPassword) {
      setError("Все поля обязательны для заполнения");
      return;
    }

    if (registerPassword !== registerConfirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (registerPassword.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    const emailExists = users.find(u => u.email === registerEmail);
    if (emailExists) {
      setError("Пользователь с таким email уже существует");
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      email: registerEmail,
      username: registerUsername,
      displayName: registerDisplayName,
      password: registerPassword,
      avatar: "https://cdn.poehali.dev/files/b4dd4c30-699b-4f6f-a2d2-927daeee8639.png",
      createdAt: new Date()
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setSuccess("Регистрация успешна! Теперь можете войти");
    setRegisterEmail("");
    setRegisterUsername("");
    setRegisterDisplayName("");
    setRegisterPassword("");
    setRegisterConfirmPassword("");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!loginEmail || !loginPassword) {
      setError("Введите email и пароль");
      return;
    }

    const user = users.find(u => u.email === loginEmail && u.password === loginPassword);
    
    if (!user) {
      setError("Неверный email или пароль");
      return;
    }

    localStorage.setItem('currentUser', JSON.stringify(user));
    onLogin(user);
    setSuccess("Вход выполнен успешно!");
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center gap-2">
          <Icon name="UserCircle" size={28} />
          Вход в Not Lock
        </CardTitle>
        <CardDescription>
          Войдите в свой аккаунт или создайте новый
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Вход</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="space-y-4 mt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="your@email.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Пароль</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                />
              </div>
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-600">
                  <Icon name="AlertCircle" size={16} />
                  {error}
                </div>
              )}
              
              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-sm text-green-600">
                  <Icon name="CheckCircle" size={16} />
                  {success}
                </div>
              )}

              <Button type="submit" className="w-full" size="lg">
                <Icon name="LogIn" className="mr-2" size={18} />
                Войти
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                Забыли пароль? <button type="button" className="text-primary hover:underline">Восстановить</button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="register" className="space-y-4 mt-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="your@email.com"
                  value={registerEmail}
                  onChange={(e) => setRegisterEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-username">Имя пользователя (логин)</Label>
                <Input
                  id="register-username"
                  type="text"
                  placeholder="johndoe"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-displayname">Отображаемое имя</Label>
                <Input
                  id="register-displayname"
                  type="text"
                  placeholder="Иван Иванов"
                  value={registerDisplayName}
                  onChange={(e) => setRegisterDisplayName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Пароль</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="••••••••"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-confirm">Подтвердите пароль</Label>
                <Input
                  id="register-confirm"
                  type="password"
                  placeholder="••••••••"
                  value={registerConfirmPassword}
                  onChange={(e) => setRegisterConfirmPassword(e.target.value)}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-600">
                  <Icon name="AlertCircle" size={16} />
                  {error}
                </div>
              )}
              
              {success && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-sm text-green-600">
                  <Icon name="CheckCircle" size={16} />
                  {success}
                </div>
              )}

              <Button type="submit" className="w-full" size="lg">
                <Icon name="UserPlus" className="mr-2" size={18} />
                Создать аккаунт
              </Button>

              <div className="text-xs text-muted-foreground text-center">
                Регистрируясь, вы принимаете условия использования и политику конфиденциальности
              </div>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-6 pt-6 border-t">
          <p className="text-sm text-center text-muted-foreground mb-4">Или войдите через</p>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="w-full">
              <Icon name="Github" className="mr-2" size={18} />
              GitHub
            </Button>
            <Button variant="outline" className="w-full">
              <Icon name="Mail" className="mr-2" size={18} />
              Google
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}