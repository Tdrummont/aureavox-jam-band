import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Users, Music, MessageCircle, Heart } from "lucide-react";

const Explorar = () => {
  const openProjects = [
    {
      id: 1,
      title: "Precisando de baixista para rock alternativo",
      description: "Banda procura baixista para completar formação. Temos várias composições prontas.",
      genre: "Rock Alternativo",
      bpm: 135,
      author: {
        name: "João Silva",
        avatar: "/placeholder.svg",
        initials: "JS"
      },
      collaborators: 2,
      tracksCount: 4,
      likes: 12,
      comments: 8,
      daysAgo: 2
    },
    {
      id: 2,
      title: "Projeto de MPB - Voz feminina",
      description: "Composições autorais no estilo MPB procurando vocalista feminina para gravações.",
      genre: "MPB",
      bpm: 95,
      author: {
        name: "Maria Santos",
        avatar: "/placeholder.svg",
        initials: "MS"
      },
      collaborators: 3,
      tracksCount: 6,
      likes: 23,
      comments: 15,
      daysAgo: 5
    },
    {
      id: 3,
      title: "Jazz Fusion - Tecladista/Pianista",
      description: "Jam sessions de jazz fusion, buscando alguém nas teclas para completar o trio.",
      genre: "Jazz Fusion",
      bpm: 120,
      author: {
        name: "Carlos Mendes",
        avatar: "/placeholder.svg",
        initials: "CM"
      },
      collaborators: 2,
      tracksCount: 3,
      likes: 8,
      comments: 4,
      daysAgo: 1
    },
    {
      id: 4,
      title: "Hip Hop Instrumental - Rapper",
      description: "Beats prontos, procurando rappers para criar algo inédito no cenário nacional.",
      genre: "Hip Hop",
      bpm: 85,
      author: {
        name: "DJ Paulo",
        avatar: "/placeholder.svg",
        initials: "DP"
      },
      collaborators: 1,
      tracksCount: 12,
      likes: 34,
      comments: 22,
      daysAgo: 3
    }
  ];

  const musicians = [
    {
      id: 1,
      name: "Ana Costa",
      instrument: "Violão/Voz",
      genre: "Folk, Indie",
      location: "São Paulo, SP",
      avatar: "/placeholder.svg",
      initials: "AC",
      projects: 8,
      rating: 4.9
    },
    {
      id: 2,
      name: "Bruno Lima",
      instrument: "Bateria",
      genre: "Rock, Pop",
      location: "Rio de Janeiro, RJ",
      avatar: "/placeholder.svg",
      initials: "BL",
      projects: 15,
      rating: 4.7
    },
    {
      id: 3,
      name: "Carla Ferreira",
      instrument: "Baixo",
      genre: "Funk, R&B",
      location: "Belo Horizonte, MG",
      avatar: "/placeholder.svg",
      initials: "CF",
      projects: 6,
      rating: 4.8
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Explorar</h1>
        <p className="text-muted-foreground">Encontre colaborações e conecte-se com outros músicos</p>
      </div>

      {/* Search */}
      <Card className="bg-gradient-card border-border/50">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Buscar por gênero, instrumento ou localização..." 
                className="pl-10 bg-background/50"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Projetos</Button>
              <Button variant="ghost" size="sm">Músicos</Button>
              <Button variant="ghost" size="sm">Bandas</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projetos Abertos - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Projetos Buscando Colaboração</h2>
            <Badge variant="secondary">{openProjects.length} ativos</Badge>
          </div>

          <div className="space-y-4">
            {openProjects.map((project) => (
              <Card key={project.id} className="group cursor-pointer transition-all duration-300 hover:shadow-musical bg-gradient-card border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={project.author.avatar} />
                        <AvatarFallback>{project.author.initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {project.title}
                        </CardTitle>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{project.author.name}</span>
                          <span>•</span>
                          <span>{project.daysAgo} dias atrás</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <MessageCircle className="w-4 h-4 mr-1" />
                      Contatar
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <CardDescription className="text-base">
                    {project.description}
                  </CardDescription>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{project.genre}</Badge>
                    <Badge variant="outline">{project.bpm} BPM</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {project.collaborators} colaboradores
                      </div>
                      <div className="flex items-center gap-1">
                        <Music className="w-4 h-4" />
                        {project.tracksCount} faixas
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        {project.likes}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {project.comments}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Músicos em Destaque - 1/3 width */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Músicos em Destaque</h2>
          
          <div className="space-y-4">
            {musicians.map((musician) => (
              <Card key={musician.id} className="group cursor-pointer transition-all duration-300 hover:shadow-musical bg-gradient-card border-border/50">
                <CardContent className="pt-6">
                  <div className="text-center space-y-3">
                    <Avatar className="w-16 h-16 mx-auto">
                      <AvatarImage src={musician.avatar} />
                      <AvatarFallback className="text-lg">{musician.initials}</AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {musician.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{musician.instrument}</p>
                      <p className="text-xs text-muted-foreground">{musician.location}</p>
                    </div>

                    <div className="flex justify-center gap-2">
                      {musician.genre.split(', ').map((genre) => (
                        <Badge key={genre} variant="secondary" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span>{musician.projects} projetos</span>
                      <div className="flex items-center gap-1">
                        <span>⭐</span>
                        <span>{musician.rating}</span>
                      </div>
                    </div>

                    <Button size="sm" variant="outline" className="w-full">
                      Ver Perfil
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button variant="outline" className="w-full">
            Ver Todos os Músicos
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Explorar;