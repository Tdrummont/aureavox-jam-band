import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Loader2, User, Mail, Lock, Save, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      // Simular atualização do perfil
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Atualizar dados no localStorage
      const updatedUser = {
        ...user,
        name: name,
        email: email,
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setMessage("Perfil atualizado com sucesso!");
    } catch {
      setError("Erro ao atualizar perfil. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    if (newPassword.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    setIsLoading(true);

    try {
      // Simular alteração de senha
      await new Promise(resolve => setTimeout(resolve, 1000));
      setMessage("Senha alterada com sucesso!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Erro ao alterar senha. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Meu Perfil</h1>
          <p className="text-muted-foreground">
            Gerencie suas informações pessoais e configurações
          </p>
        </div>
        <Button variant="outline" onClick={handleLogout} className="flex items-center space-x-2">
          <LogOut className="w-4 h-4" />
          <span>Sair</span>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informações Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>Informações Pessoais</span>
            </CardTitle>
            <CardDescription>
              Atualize suas informações básicas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSaveProfile} className="space-y-4">
              {message && (
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Alterar Senha */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lock className="w-5 h-5" />
              <span>Alterar Senha</span>
            </CardTitle>
            <CardDescription>
              Mantenha sua conta segura com uma senha forte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Senha atual</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nova senha</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar nova senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <Lock className="mr-2 h-4 w-4" />
                Alterar Senha
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Informações da Conta */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>Informações da Conta</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="text-sm font-medium text-muted-foreground">ID do Usuário</Label>
              <p className="text-sm">{user?.id}</p>
            </div>
            <div>
              <Label className="text-sm font-medium text-muted-foreground">Membro desde</Label>
              <p className="text-sm">Janeiro 2024</p>
            </div>
          </div>
          
          <Separator />
          
          <div className="text-sm text-muted-foreground">
            <p>
              Para mais informações sobre privacidade e segurança, 
              consulte nossa política de privacidade.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
