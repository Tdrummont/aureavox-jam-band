import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FolderOpen, Plus, Search, Users, Clock, Music } from "lucide-react";
import { Link } from "react-router-dom";

const Projetos = () => {
  const projects = [
    {
      id: 1,
      title: "Nova Canção de Rock",
      description: "Uma música energética com riffs pesados e vocal marcante",
      genre: "Rock",
      bpm: 120,
      status: "Em produção",
      collaborators: 3,
      tracks: 5,
      lastUpdate: "2 dias atrás",
      isOpenToCollab: true
    },
    {
      id: 2,
      title: "Balada Acústica",
      description: "Composição intimista com violão e vocal suave",
      genre: "Acústico",
      bpm: 85,
      status: "Gravando",
      collaborators: 2,
      tracks: 3,
      lastUpdate: "1 semana atrás",
      isOpenToCollab: false
    },
    {
      id: 3,
      title: "Jam Experimental",
      description: "Experimentos sonoros e improvizações livres",
      genre: "Experimental",
      bpm: null,
      status: "Ideação",
      collaborators: 4,
      tracks: 8,
      lastUpdate: "3 dias atrás",
      isOpenToCollab: true
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em produção": return "default";
      case "Gravando": return "secondary";
      case "Ideação": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Meus Projetos</h1>
          <p className="text-muted-foreground">Gerencie suas composições e colaborações</p>
        </div>
        <Button className="bg-gradient-hero hover:shadow-glow transition-all">
          <Plus className="w-4 h-4 mr-2" />
          Novo Projeto
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="bg-gradient-card border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Buscar projetos..." 
                className="pl-10 bg-background/50"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Todos</Button>
              <Button variant="ghost" size="sm">Em produção</Button>
              <Button variant="ghost" size="sm">Aberto a colaboração</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="group cursor-pointer transition-all duration-300 hover:shadow-musical hover:-translate-y-1 bg-gradient-card border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg line-clamp-1 group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                  <CardDescription className="mt-1 line-clamp-2">
                    {project.description}
                  </CardDescription>
                </div>
                {project.isOpenToCollab && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    Colaboração
                  </Badge>
                )}
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Project Info */}
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">{project.genre}</Badge>
                {project.bpm && (
                  <Badge variant="outline">{project.bpm} BPM</Badge>
                )}
                <Badge variant={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-primary">{project.tracks}</div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Music className="w-3 h-3" />
                    Faixas
                  </div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-secondary">{project.collaborators}</div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Users className="w-3 h-3" />
                    Pessoas
                  </div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-accent-foreground">
                    {project.lastUpdate.split(' ')[0]}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" />
                    {project.lastUpdate.split(' ').slice(1).join(' ')}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Link to={`/project/${project.id}`} className="flex-1">
                  <Button size="sm" className="w-full" variant="secondary">
                    Abrir
                  </Button>
                </Link>
                <Button size="sm" variant="outline">
                  <FolderOpen className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State for when there are no projects */}
      {projects.length === 0 && (
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="text-center py-12">
            <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Nenhum projeto ainda</h3>
            <p className="text-muted-foreground mb-6">
              Comece criando seu primeiro projeto musical
            </p>
            <Button className="bg-gradient-hero hover:shadow-glow transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeiro Projeto
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Projetos;