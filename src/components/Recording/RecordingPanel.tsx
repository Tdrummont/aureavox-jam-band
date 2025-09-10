import { useState } from "react";
import { useRecorder } from "@/hooks/useRecorder";
import { useMetronome } from "@/hooks/useMetronome";
import { uploadTrack } from "@/services/uploadService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Upload, 
  Volume2, 
  Headphones,
  Music
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RecordingPanelProps {
  projectId: number;
  onTrackUploaded?: () => void;
}

const RecordingPanel = ({ projectId, onTrackUploaded }: RecordingPanelProps) => {
  const { toast } = useToast();
  const [trackKind, setTrackKind] = useState("voice");
  const [isUploading, setIsUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  
  const {
    start: startRecording,
    stop: stopRecording,
    recording,
    blob,
    error: recorderError,
    duration
  } = useRecorder();

  const {
    isPlaying: metronomePlaying,
    start: startMetronome,
    stop: stopMetronome,
    settings: metronomeSettings,
    updateSettings: updateMetronomeSettings,
    currentBeat,
    currentBar
  } = useMetronome();

  const handleStartRecording = async () => {
    try {
      await startRecording();
      toast({
        title: "Gravação iniciada",
        description: "Use fones de ouvido para evitar vazamento de áudio",
      });
    } catch {
      toast({
        title: "Erro ao iniciar gravação",
        description: "Verifique as permissões do microfone",
        variant: "destructive",
      });
    }
  };

  const handleStopRecording = () => {
    stopRecording();
    if (blob) {
      setShowPreview(true);
    }
  };

  const handleUpload = async () => {
    if (!blob) return;

    setIsUploading(true);
    try {
      await uploadTrack({
        projectId,
        file: blob,
        kind: trackKind,
        offsetMs: 0
      });

      toast({
        title: "Trilha enviada com sucesso!",
        description: "Sua gravação foi processada e está disponível no projeto",
      });

      setShowPreview(false);
      onTrackUploaded?.();
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: error instanceof Error ? error.message : "Falha ao enviar trilha",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Configurações do Metrônomo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Music className="w-5 h-5" />
            <span>Metrônomo</span>
          </CardTitle>
          <CardDescription>
            Configure o tempo e compasso antes de gravar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bpm">BPM</Label>
              <Input
                id="bpm"
                type="number"
                min="60"
                max="200"
                value={metronomeSettings.bpm}
                onChange={(e) => updateMetronomeSettings({ bpm: parseInt(e.target.value) })}
                disabled={metronomePlaying}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Compasso</Label>
              <Select
                value={`${metronomeSettings.timeSignature[0]}/${metronomeSettings.timeSignature[1]}`}
                onValueChange={(value) => {
                  const [beats, noteValue] = value.split('/').map(Number);
                  updateMetronomeSettings({ timeSignature: [beats, noteValue] });
                }}
                disabled={metronomePlaying}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="4/4">4/4</SelectItem>
                  <SelectItem value="3/4">3/4</SelectItem>
                  <SelectItem value="2/4">2/4</SelectItem>
                  <SelectItem value="6/8">6/8</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Count-in</Label>
              <Select
                value={metronomeSettings.countIn.toString()}
                onValueChange={(value) => updateMetronomeSettings({ countIn: parseInt(value) })}
                disabled={metronomePlaying}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 compasso</SelectItem>
                  <SelectItem value="2">2 compassos</SelectItem>
                  <SelectItem value="4">4 compassos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant={metronomePlaying ? "destructive" : "default"}
              onClick={metronomePlaying ? stopMetronome : startMetronome}
              disabled={recording}
            >
              {metronomePlaying ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Parar Metrônomo
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Iniciar Metrônomo
                </>
              )}
            </Button>

            {metronomePlaying && (
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-lg px-3 py-1">
                  {currentBar}.{currentBeat}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {metronomeSettings.bpm} BPM
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Área de Gravação */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Mic className="w-5 h-5" />
            <span>Gravação</span>
          </CardTitle>
          <CardDescription>
            Grave sua parte musical com sincronização automática
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recorderError && (
            <Alert variant="destructive">
              <AlertDescription>{recorderError}</AlertDescription>
            </Alert>
          )}

          <div className="flex items-center space-x-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="trackKind">Tipo de Trilha</Label>
              <Select value={trackKind} onValueChange={setTrackKind}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="voice">Vocal</SelectItem>
                  <SelectItem value="guitar">Guitarra</SelectItem>
                  <SelectItem value="bass">Baixo</SelectItem>
                  <SelectItem value="drums">Bateria</SelectItem>
                  <SelectItem value="keys">Teclado</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {recording && (
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium">
                  {formatTime(duration)}
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant={recording ? "destructive" : "default"}
              size="lg"
              onClick={recording ? handleStopRecording : handleStartRecording}
              disabled={isUploading}
            >
              {recording ? (
                <>
                  <Square className="w-5 h-5 mr-2" />
                  Parar Gravação
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5 mr-2" />
                  Iniciar Gravação
                </>
              )}
            </Button>

            {blob && !recording && (
              <Button
                variant="outline"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Volume2 className="w-4 h-4 mr-2" />
                {showPreview ? "Ocultar" : "Preview"}
              </Button>
            )}
          </div>

          {showPreview && blob && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center space-x-2">
                <Headphones className="w-4 h-4" />
                <span className="text-sm font-medium">Preview da Gravação</span>
              </div>
              
              <audio 
                controls 
                className="w-full"
                src={URL.createObjectURL(blob)}
              />
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Tamanho: {(blob.size / 1024 / 1024).toFixed(2)} MB
                </div>
                
                <Button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="flex items-center space-x-2"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Enviando...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Enviar Trilha</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          <Alert>
            <Headphones className="h-4 w-4" />
            <AlertDescription>
              <strong>Dica importante:</strong> Use fones de ouvido durante a gravação 
              para evitar que o playback apareça na sua trilha.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};

export default RecordingPanel;
