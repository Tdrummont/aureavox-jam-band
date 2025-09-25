import { useState, useEffect, useCallback } from "react";
import { useAudioPlayer, Track } from "@/hooks/useAudioPlayer";
import { 
  getProjectTracks, 
  updateTrackOffset, 
  updateTrackSettings, 
  deleteTrack 
} from "@/services/uploadService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Play, 
  Pause, 
  Square, 
  Volume2, 
  VolumeX, 
  Eye, 
  Trash2,
  Clock,
  Music,
  
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TracksListProps {
  projectId: number;
}

const TracksList = ({ projectId }: TracksListProps) => {
  const { toast } = useToast();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingTrack, setUpdatingTrack] = useState<number | null>(null);

  const {
    isPlaying,
    currentTime,
    duration,
    play,
    pause,
    stop,
    setTrackGain,
    setTrackMute,
    setTrackSolo,
    setTrackOffset
  } = useAudioPlayer();

  // Carregar trilhas do projeto
  const loadTracks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const projectTracks = await getProjectTracks(projectId);
      setTracks(projectTracks);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao carregar trilhas");
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadTracks();
  }, [loadTracks]);

  // Formatar tempo
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Formatar duração em ms
  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    return formatTime(seconds);
  };

  // Tocar/pausar
  const handlePlayPause = async () => {
    if (tracks.length === 0) return;

    if (isPlaying) {
      pause();
    } else {
      await play(tracks);
    }
  };

  // Atualizar offset de uma trilha
  const handleOffsetChange = async (trackId: number, offsetMs: number) => {
    try {
      setUpdatingTrack(trackId);
      await updateTrackOffset(projectId, trackId, offsetMs);
      
      // Atualizar estado local
      setTracks(prev => prev.map(track => 
        track.id === trackId ? { ...track, offset_ms: offsetMs } : track
      ));
      
      // Atualizar no player se estiver tocando
      setTrackOffset(trackId, offsetMs);
      
    } catch (err) {
      toast({
        title: "Erro ao atualizar offset",
        description: err instanceof Error ? err.message : "Falha na sincronização",
        variant: "destructive",
      });
    } finally {
      setUpdatingTrack(null);
    }
  };

  // Atualizar configurações de uma trilha
  const handleSettingsChange = async (
    trackId: number, 
    settings: { gain_db?: number; mute?: boolean; solo?: boolean }
  ) => {
    try {
      setUpdatingTrack(trackId);
      await updateTrackSettings(projectId, trackId, settings);
      
      // Atualizar estado local
      setTracks(prev => prev.map(track => 
        track.id === trackId ? { ...track, ...settings } : track
      ));
      
      // Aplicar no player
      if (settings.gain_db !== undefined) {
        setTrackGain(trackId, settings.gain_db);
      }
      if (settings.mute !== undefined) {
        setTrackMute(trackId, settings.mute);
      }
      if (settings.solo !== undefined) {
        setTrackSolo(trackId, settings.solo);
      }
      
    } catch (err) {
      toast({
        title: "Erro ao atualizar configurações",
        description: err instanceof Error ? err.message : "Falha na atualização",
        variant: "destructive",
      });
    } finally {
      setUpdatingTrack(null);
    }
  };

  // Deletar trilha
  const handleDeleteTrack = async (trackId: number) => {
    if (!confirm("Tem certeza que deseja deletar esta trilha?")) return;

    try {
      await deleteTrack(projectId, trackId);
      setTracks(prev => prev.filter(track => track.id !== trackId));
      
      toast({
        title: "Trilha deletada",
        description: "A trilha foi removida do projeto",
      });
    } catch (err) {
      toast({
        title: "Erro ao deletar trilha",
        description: err instanceof Error ? err.message : "Falha na exclusão",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando trilhas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (tracks.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <Music className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhuma trilha encontrada</h3>
          <p className="text-muted-foreground">
            Grave sua primeira trilha para começar o projeto
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles do Player */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Music className="w-5 h-5" />
            <span>Player</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Button
              variant={isPlaying ? "destructive" : "default"}
              onClick={handlePlayPause}
              disabled={tracks.length === 0}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pausar
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Tocar
                </>
              )}
            </Button>

            <Button
              variant="outline"
              onClick={stop}
              disabled={!isPlaying}
            >
              <Square className="w-4 h-4 mr-2" />
              Parar
            </Button>

            {isPlaying && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Lista de Trilhas */}
      <div className="space-y-4">
        {tracks.map((track) => (
          <Card key={track.id} className={updatingTrack === track.id ? "opacity-50" : ""}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Badge variant="outline">{track.kind}</Badge>
                  <div>
                    <p className="font-medium">Trilha #{track.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDuration(track.duration_ms)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteTrack(track.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Volume */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="w-4 h-4" />
                    <span className="text-sm font-medium">Volume</span>
                  </div>
                  <Slider
                    value={[track.gain_db]}
                    onValueChange={([value]) => handleSettingsChange(track.id, { gain_db: value })}
                    min={-60}
                    max={12}
                    step={1}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    {track.gain_db}dB
                  </p>
                </div>

                {/* Offset (Nudge) */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Sincronização</span>
                  </div>
                  <Slider
                    value={[track.offset_ms]}
                    onValueChange={([value]) => handleOffsetChange(track.id, value)}
                    min={-500}
                    max={500}
                    step={10}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground text-center">
                    {track.offset_ms > 0 ? '+' : ''}{track.offset_ms}ms
                  </p>
                </div>

                {/* Mute/Solo */}
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <VolumeX className="w-4 h-4" />
                    <span className="text-sm font-medium">Mute</span>
                  </div>
                  <div className="flex justify-center">
                    <Switch
                      checked={track.mute}
                      onCheckedChange={(checked) => handleSettingsChange(track.id, { mute: checked })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4" />
                    <span className="text-sm font-medium">Solo</span>
                  </div>
                  <div className="flex justify-center">
                    <Switch
                      checked={track.solo}
                      onCheckedChange={(checked) => handleSettingsChange(track.id, { solo: checked })}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <span>ID: {track.id}</span>
                    <span>Sample Rate: {track.sample_rate}Hz</span>
                  </div>
                  <span>
                    {formatDistanceToNow(new Date(track.created_at), { 
                      addSuffix: true, 
                      locale: ptBR 
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default TracksList;
