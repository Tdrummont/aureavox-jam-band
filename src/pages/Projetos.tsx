import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { addProject, getProjects, Project } from "@/services/projectsService";
import { FolderOpen, Plus, Search, Users, Clock, Music } from "lucide-react";
import { Link } from "react-router-dom";

const Projetos = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([]);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "production" | "collab">("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    genre: "",
    bpm: "",
    status: "Ideação",
  });

  useEffect(() => {
    (async () => {
      const list = await getProjects();
      setProjects(list);
    })();
  }, []);

  const filtered = useMemo(() => {
    let list = projects;
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(p =>
        p.title.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q) ||
        (p.genre || "").toLowerCase().includes(q)
      );
    }
    if (filter === "production") {
      list = list.filter(p => p.status === "Em produção" || p.status === "Gravando");
    } else if (filter === "collab") {
      list = list.filter(p => p.isOpenToCollab);
    }
    return list;
  }, [projects, query, filter]);

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
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-hero hover:shadow-glow transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Novo Projeto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Projeto</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="title">Título</Label>
                <Input id="title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Ex: Nova Canção" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="genre">Gênero</Label>
                <Input id="genre" value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} placeholder="Ex: Rock" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bpm">BPM</Label>
                <Input id="bpm" type="number" value={form.bpm} onChange={e => setForm({ ...form, bpm: e.target.value })} placeholder="Ex: 120" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea id="description" rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Breve descrição" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Status</Label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Ideação">Ideação</SelectItem>
                    <SelectItem value="Em produção">Em produção</SelectItem>
                    <SelectItem value="Gravando">Gravando</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button onClick={async () => {
                if (!form.title.trim()) {
                  toast({ title: "Informe um título", variant: "destructive" });
                  return;
                }
                try {
                  await addProject({
                    title: form.title.trim(),
                    description: form.description || null,
                    genre: form.genre || null,
                    bpm: form.bpm ? Number(form.bpm) : null,
                    status: form.status,
                    isOpenToCollab: true,
                  });
                  const list = await getProjects();
                  setProjects(list);
                  setOpen(false);
                  setForm({ title: "", description: "", genre: "", bpm: "", status: "Ideação" });
                  toast({ title: "Projeto criado" });
                } catch (err) {
                  toast({ title: "Erro ao criar projeto", description: err instanceof Error ? err.message : "Tente novamente.", variant: "destructive" });
                }
              }}>Salvar</Button>
            </div>
          </DialogContent>
        </Dialog>
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
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button variant={filter === "all" ? "outline" : "ghost"} size="sm" onClick={() => setFilter("all")}>Todos</Button>
              <Button variant={filter === "production" ? "outline" : "ghost"} size="sm" onClick={() => setFilter("production")}>Em produção</Button>
              <Button variant={filter === "collab" ? "outline" : "ghost"} size="sm" onClick={() => setFilter("collab")}>Aberto a colaboração</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((project) => (
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
                <Badge variant="outline">{project.genre || "Sem gênero"}</Badge>
                {project.bpm && (
                  <Badge variant="outline">{project.bpm} BPM</Badge>
                )}
                <Badge variant={getStatusColor(project.status)}>{project.status}</Badge>
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
                    {new Date(project.lastUpdate).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(project.lastUpdate).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
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
      {filtered.length === 0 && (
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