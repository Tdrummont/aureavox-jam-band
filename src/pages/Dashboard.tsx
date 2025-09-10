import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Users, Calendar, Plus, Music2, Headphones, Mic } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const recentProjects = [
    {
      id: 1,
      title: "Nova Canção de Rock",
      genre: "Rock",
      status: "Em produção",
      collaborators: 3,
      lastUpdate: "2 dias atrás"
    },
    {
      id: 2,
      title: "Balada Acústica",
      genre: "Acústico",
      status: "Gravando",
      collaborators: 2,
      lastUpdate: "1 semana atrás"
    }
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Ensaio da Banda",
      date: "Hoje, 19:00",
      type: "rehearsal"
    },
    {
      id: 2,
      title: "Show no Bar do Rock",
      date: "Sábado, 21:30",
      type: "show"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-hero p-8 md:p-12 shadow-musical">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
            Bem-vindo ao AureaVox
          </h1>
          <p className="text-xl text-primary-foreground/90 mb-6 max-w-2xl">
            Crie música colaborativamente, organize sua banda e transforme ideias em realidade sonora.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/projetos">
              <Button size="lg" variant="secondary" className="shadow-lg">
                <Plus className="w-5 h-5 mr-2" />
                Novo Projeto
              </Button>
            </Link>
            <Link to="/explorar">
              <Button size="lg" variant="outline" className="bg-black/20 border-primary-foreground/20 text-primary-foreground hover:bg-black/30">
                <Users className="w-5 h-5 mr-2" />
                Encontrar Músicos
              </Button>
            </Link>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-glow/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/30 rounded-full blur-2xl" />
      </div>

      {/* Main Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Projetos Card */}
        <Link to="/projetos">
          <Card className="group cursor-pointer transition-all duration-300 hover:shadow-musical hover:-translate-y-1 bg-gradient-card border-border/50">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <FolderOpen className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Projetos</CardTitle>
              <CardDescription>
                Gerencie suas músicas em desenvolvimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary mb-1">
                  {recentProjects.length}
                </div>
                <div className="text-sm text-muted-foreground">projetos ativos</div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Explorar Card */}
        <Link to="/explorar">
          <Card className="group cursor-pointer transition-all duration-300 hover:shadow-musical hover:-translate-y-1 bg-gradient-card border-border/50">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                <Users className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle className="text-xl">Explorar Músicos</CardTitle>
              <CardDescription>
                Conecte-se com outros artistas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary mb-1">
                  12
                </div>
                <div className="text-sm text-muted-foreground">procurando colabs</div>
              </div>
            </CardContent>
          </Card>
        </Link>

        {/* Agenda Card */}
        <Link to="/agenda">
          <Card className="group cursor-pointer transition-all duration-300 hover:shadow-musical hover:-translate-y-1 bg-gradient-card border-border/50">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <Calendar className="w-6 h-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-xl">Agenda</CardTitle>
              <CardDescription>
                Organize ensaios e apresentações
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-foreground mb-1">
                  {upcomingEvents.length}
                </div>
                <div className="text-sm text-muted-foreground">eventos próximos</div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music2 className="w-5 h-5 text-primary" />
              Projetos Recentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="flex-1">
                  <h4 className="font-medium">{project.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {project.genre}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {project.collaborators} colaboradores
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={project.status === "Em produção" ? "default" : "outline"}
                    className="mb-1"
                  >
                    {project.status}
                  </Badge>
                  <div className="text-xs text-muted-foreground">
                    {project.lastUpdate}
                  </div>
                </div>
              </div>
            ))}
            <Link to="/projetos">
              <Button variant="outline" className="w-full">
                Ver Todos os Projetos
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Headphones className="w-5 h-5 text-accent-foreground" />
              Próximos Eventos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                  {event.type === "rehearsal" ? (
                    <Mic className="w-4 h-4 text-primary" />
                  ) : (
                    <Music2 className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-muted-foreground">{event.date}</p>
                </div>
              </div>
            ))}
            <Link to="/agenda">
              <Button variant="outline" className="w-full">
                Ver Agenda Completa
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;