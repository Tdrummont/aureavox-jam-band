import { useRef, useState, useCallback, useEffect } from 'react';
import { config } from '@/config/env';

export interface Track {
  id: number;
  project_id: number;
  user_id: number;
  kind: string;
  path_original: string;
  path_wav: string | null;
  duration_ms: number;
  offset_ms: number;
  sample_rate: number;
  gain_db: number;
  mute: boolean;
  solo: boolean;
  created_at: string;
  updated_at: string;
}

interface UseAudioPlayerReturn {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  play: (tracks: Track[]) => Promise<void>;
  pause: () => void;
  stop: () => void;
  seek: (time: number) => void;
  setTrackGain: (trackId: number, gainDb: number) => void;
  setTrackMute: (trackId: number, mute: boolean) => void;
  setTrackSolo: (trackId: number, solo: boolean) => void;
  setTrackOffset: (trackId: number, offsetMs: number) => void;
}

export function useAudioPlayer(): UseAudioPlayerReturn {
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodesRef = useRef<Map<number, AudioBufferSourceNode>>(new Map());
  const gainNodesRef = useRef<Map<number, GainNode>>(new Map());
  const audioBuffersRef = useRef<Map<number, AudioBuffer>>(new Map());
  const tracksRef = useRef<Track[]>([]);
  const startTimeRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Converter dB para gain linear
  const dbToGain = useCallback((db: number) => {
    return Math.pow(10, db / 20);
  }, []);

  // Inicializar AudioContext
  const initAudioContext = useCallback(async () => {
    if (!audioContextRef.current) {
      type WebAudioWindow = Window & typeof globalThis & { webkitAudioContext?: typeof AudioContext };
      const win = window as WebAudioWindow;
      const AudioCtx = (win.AudioContext || win.webkitAudioContext);
      if (!AudioCtx) throw new Error('Web Audio API não suportada neste navegador');
      audioContextRef.current = new AudioCtx({ sampleRate: 48000 });
      
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.gain.setValueAtTime(1, audioContextRef.current.currentTime);
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }

    if (audioContextRef.current.state === 'suspended') {
      await audioContextRef.current.resume();
    }
  }, []);

  // Carregar buffer de áudio
  const loadAudioBuffer = useCallback(async (track: Track): Promise<AudioBuffer> => {
    if (!audioContextRef.current) throw new Error('AudioContext não inicializado');

    const cachedBuffer = audioBuffersRef.current.get(track.id);
    if (cachedBuffer) return cachedBuffer;

    try {
      const audioUrl = track.path_wav 
        ? `${config.apiUrl}/storage/${track.path_wav}`
        : `${config.apiUrl}/storage/${track.path_original}`;

      const response = await fetch(audioUrl);
      if (!response.ok) throw new Error(`Falha ao carregar áudio: ${response.status}`);

      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
      
      audioBuffersRef.current.set(track.id, audioBuffer);
      return audioBuffer;
    } catch (err) {
      console.error(`Erro ao carregar áudio da trilha ${track.id}:`, err);
      throw err;
    }
  }, []);

  // Atualizar tempo atual
  const updateCurrentTime = useCallback(() => {
    if (!isPlaying || !audioContextRef.current) return;

    const elapsed = audioContextRef.current.currentTime - startTimeRef.current;
    setCurrentTime(Math.max(0, elapsed));

    animationFrameRef.current = requestAnimationFrame(updateCurrentTime);
  }, [isPlaying]);

  // Limpar reprodução atual (parar nodes, cancelar animação)
  const resetPlayback = useCallback(() => {
    if (!audioContextRef.current) return;

    setIsPlaying(false);

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    sourceNodesRef.current.forEach((sourceNode) => {
      try {
        sourceNode.stop();
      } catch {
        // Ignorar erro se já foi parado
      }
    });

    sourceNodesRef.current.clear();
    gainNodesRef.current.clear();
  }, []);

  // Tocar trilhas
  const play = useCallback(async (tracks: Track[]) => {
    try {
      await initAudioContext();
      
      if (!audioContextRef.current || !gainNodeRef.current) return;

      // Parar reprodução anterior
      resetPlayback();

      tracksRef.current = tracks;
      
      // Calcular duração total
      const maxDuration = Math.max(...tracks.map(t => (t.duration_ms + t.offset_ms) / 1000));
      setDuration(maxDuration);

      // Carregar e tocar cada trilha
      const playPromises = tracks.map(async (track) => {
        if (track.mute) return;

        try {
          const audioBuffer = await loadAudioBuffer(track);
          if (!audioBuffer) return;

          const sourceNode = audioContextRef.current!.createBufferSource();
          const gainNode = audioContextRef.current!.createGain();
          
          sourceNode.buffer = audioBuffer;
          
          // Configurar ganho
          const gainValue = track.solo ? 1 : dbToGain(track.gain_db || 0);
          gainNode.gain.setValueAtTime(gainValue, audioContextRef.current!.currentTime);
          
          // Conectar nós
          sourceNode.connect(gainNode);
          gainNode.connect(gainNodeRef.current!);
          
          // Armazenar referências
          sourceNodesRef.current.set(track.id, sourceNode);
          gainNodesRef.current.set(track.id, gainNode);
          
          // Agendar início
          const startTime = audioContextRef.current!.currentTime + 0.1; // 100ms de delay
          const offsetTime = track.offset_ms / 1000;
          
          sourceNode.start(startTime, offsetTime);
          
        } catch (error) {
          console.error(`Erro ao tocar trilha ${track.id}:`, error);
        }
      });

      await Promise.all(playPromises);

      // Iniciar controle de tempo
      startTimeRef.current = audioContextRef.current.currentTime;
      setIsPlaying(true);
      updateCurrentTime();

    } catch (error) {
      console.error('Erro ao iniciar reprodução:', error);
    }
  }, [initAudioContext, loadAudioBuffer, dbToGain, updateCurrentTime, resetPlayback]);

  // Pausar reprodução
  const pause = useCallback(() => {
    resetPlayback();
  }, [resetPlayback]);

  // Parar reprodução
  const stop = useCallback(() => {
    pause();
    setCurrentTime(0);
  }, [pause]);

  // Buscar posição
  const seek = useCallback((_time: number) => {
    if (!audioContextRef.current) return;

    const currentTracks = tracksRef.current;
    if (currentTracks.length === 0) return;

    // Parar reprodução atual
    pause();
    
    // Reiniciar do novo tempo
    setTimeout(() => {
      play(currentTracks);
    }, 100);
  }, [pause, play]);

  // Configurar ganho de uma trilha
  const setTrackGain = useCallback((trackId: number, gainDb: number) => {
    const gainNode = gainNodesRef.current.get(trackId);
    if (gainNode && audioContextRef.current) {
      const gainValue = dbToGain(gainDb);
      gainNode.gain.setValueAtTime(gainValue, audioContextRef.current.currentTime);
    }
  }, [dbToGain]);

  // Configurar mute de uma trilha
  const setTrackMute = useCallback((trackId: number, mute: boolean) => {
    const gainNode = gainNodesRef.current.get(trackId);
    if (gainNode && audioContextRef.current) {
      const gainValue = mute ? 0 : dbToGain(0); // Assumir 0dB quando não muted
      gainNode.gain.setValueAtTime(gainValue, audioContextRef.current.currentTime);
    }
  }, [dbToGain]);

  // Configurar solo de uma trilha
  const setTrackSolo = useCallback((trackId: number, solo: boolean) => {
    // Implementar lógica de solo (mute todas as outras)
    tracksRef.current.forEach(track => {
      if (track.id !== trackId) {
        setTrackMute(track.id, solo);
      }
    });
  }, [setTrackMute]);

  // Configurar offset de uma trilha
  const setTrackOffset = useCallback((trackId: number, offsetMs: number) => {
    // Atualizar offset na trilha
    const track = tracksRef.current.find(t => t.id === trackId);
    if (track) {
      track.offset_ms = offsetMs;
    }
  }, []);

  // Cleanup ao desmontar
  useEffect(() => {
    return () => {
      stop();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stop]);

  return {
    isPlaying,
    currentTime,
    duration,
    play,
    pause,
    stop,
    seek,
    setTrackGain,
    setTrackMute,
    setTrackSolo,
    setTrackOffset
  };
}
