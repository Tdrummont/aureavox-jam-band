import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Music, Mic, Settings, Users, Calendar } from "lucide-react";
import RecordingPanel from "@/components/Recording/RecordingPanel";
import TracksList from "@/components/Tracks/TracksList";
import { getProjectById, Project } from "@/services/projectsService";

const Project = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = parseInt(id || "1");
  const [project, setProject] = useState<Project | null>(null);
  const [refreshTracks, setRefreshTracks] = useState(0);

  useEffect(() => {
    (async () => {
      const p = await getProjectById(projectId);
      setProject(p);
    })();
  }, [projectId]);

  const handleTrackUploaded = () => {
    setRefreshTracks(prev => prev + 1);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header do Projeto */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{project?.title || "Projeto"}</h1>
          <p className="text-muted-foreground">
            {project?.description || "Sessão de gravação colaborativa"}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="flex items-center space-x-1">
            <Users className="w-3 h-3" />
            <span>{project?.collaborators ?? 0} músicos</span>
          </Badge>
          <Badge variant="outline" className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{project?.status || "Ativo"}</span>
          </Badge>
        </div>
      </div>

      {/* Tabs de Navegação */}
      <Tabs defaultValue="recording" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="recording" className="flex items-center space-x-2">
            <Mic className="w-4 h-4" />
            <span>Gravação</span>
          </TabsTrigger>
          <TabsTrigger value="tracks" className="flex items-center space-x-2">
            <Music className="w-4 h-4" />
            <span>Trilhas</span>
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Configurações</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab de Gravação */}
        <TabsContent value="recording" className="space-y-6">
          <RecordingPanel 
            projectId={projectId} 
            onTrackUploaded={handleTrackUploaded}
          />
        </TabsContent>

        {/* Tab de Trilhas */}
        <TabsContent value="tracks" className="space-y-6">
          <TracksList key={refreshTracks} projectId={projectId} />
        </TabsContent>

        {/* Tab de Configurações */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Configurações do Projeto */}
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Projeto</CardTitle>
                <CardDescription>
                  Ajuste as configurações gerais da sessão
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p>• BPM: 120</p>
                  <p>• Compasso: 4/4</p>
                  <p>• Sample Rate: 48kHz</p>
                  <p>• Formato: WAV 16-bit</p>
                </div>
                <Button variant="outline" className="w-full">
                  Editar Configurações
                </Button>
              </CardContent>
            </Card>

            {/* Informações da Sessão */}
            <Card>
              <CardHeader>
                <CardTitle>Informações da Sessão</CardTitle>
                <CardDescription>
                  Detalhes sobre a sessão atual
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  <p>• Projeto ID: {projectId}</p>
                  <p>• Criado em: {project ? new Date(project.createdAt).toLocaleDateString('pt-BR') : '-'}</p>
                  <p>• Última atividade: {project ? new Date(project.lastUpdate).toLocaleString('pt-BR') : '-'}</p>
                  <p>• Status: {project?.status || '-'}</p>
                </div>
                <Button variant="outline" className="w-full">
                  Exportar Projeto
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Dicas de Uso */}
          <Card>
            <CardHeader>
              <CardTitle>Dicas para Melhor Resultado</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Durante a Gravação:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Use fones de ouvido sempre</li>
                    <li>• Grave em ambiente silencioso</li>
                    <li>• Siga o metrônomo para sincronização</li>
                    <li>• Faça count-in antes de começar</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium">Após a Gravação:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Ajuste o offset se necessário</li>
                    <li>• Balance os volumes das trilhas</li>
                    <li>• Use mute/solo para testar</li>
                    <li>• Regrave se não ficou bom</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Project;
