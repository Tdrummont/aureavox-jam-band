import { useRef, useState, useCallback } from 'react';

interface MetronomeSettings {
  bpm: number;
  timeSignature: [number, number]; // [beats, noteValue]
  countIn: number; // número de compassos de count-in
}

interface UseMetronomeReturn {
  isPlaying: boolean;
  start: () => void;
  stop: () => void;
  settings: MetronomeSettings;
  updateSettings: (newSettings: Partial<MetronomeSettings>) => void;
  currentBeat: number;
  currentBar: number;
}

export function useMetronome(initialSettings?: Partial<MetronomeSettings>): UseMetronomeReturn {
  const audioContextRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const beatCountRef = useRef<number>(0);
  const barCountRef = useRef<number>(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [currentBar, setCurrentBar] = useState(0);
  
  const [settings, setSettings] = useState<MetronomeSettings>({
    bpm: 120,
    timeSignature: [4, 4],
    countIn: 2,
    ...initialSettings
  });

  const createClickSound = useCallback((frequency: number, duration: number = 0.1) => {
    if (!audioContextRef.current || !gainNodeRef.current) return;

    const oscillator = audioContextRef.current.createOscillator();
    const gain = audioContextRef.current.createGain();
    
    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    oscillator.type = 'square';
    
    gain.gain.setValueAtTime(0, audioContextRef.current.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, audioContextRef.current.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
    
    oscillator.connect(gain);
    gain.connect(gainNodeRef.current);
    
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration);
  }, []);

  const playClick = useCallback((beat: number) => {
    // Som diferente para o primeiro tempo do compasso
    const isDownbeat = beat === 1;
    const frequency = isDownbeat ? 800 : 600;
    const duration = isDownbeat ? 0.15 : 0.1;
    
    createClickSound(frequency, duration);
  }, [createClickSound]);

  const tick = useCallback(() => {
    if (!isPlaying) return;

    const elapsed = (Date.now() - startTimeRef.current) / 1000;
    const beatInterval = 60 / settings.bpm;
    const currentBeatNumber = Math.floor(elapsed / beatInterval) + 1;
    
    // Calcular compasso atual
    const beatsPerBar = settings.timeSignature[0];
    const currentBarNumber = Math.floor((currentBeatNumber - 1) / beatsPerBar) + 1;
    
    // Verificar se é um novo beat
    if (currentBeatNumber !== beatCountRef.current) {
      beatCountRef.current = currentBeatNumber;
      setCurrentBeat(currentBeatNumber);
      setCurrentBar(currentBarNumber);
      
      // Tocar o click
      const beatInBar = ((currentBeatNumber - 1) % beatsPerBar) + 1;
      playClick(beatInBar);
    }
  }, [isPlaying, settings.bpm, settings.timeSignature, playClick]);

  const start = useCallback(async () => {
    try {
      // Inicializar AudioContext se necessário
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
          sampleRate: 48000
        });
        
        gainNodeRef.current = audioContextRef.current.createGain();
        gainNodeRef.current.gain.setValueAtTime(0.5, audioContextRef.current.currentTime);
        gainNodeRef.current.connect(audioContextRef.current.destination);
      }

      // Resumir contexto se estiver suspenso
      if (audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }

      setIsPlaying(true);
      startTimeRef.current = Date.now();
      beatCountRef.current = 0;
      barCountRef.current = 0;
      setCurrentBeat(0);
      setCurrentBar(0);

      // Iniciar loop de tick
      intervalRef.current = window.setInterval(tick, 16); // ~60fps
      
    } catch (error) {
      console.error('Erro ao iniciar metrônomo:', error);
    }
  }, [tick]);

  const stop = useCallback(() => {
    setIsPlaying(false);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
    }
    
    setCurrentBeat(0);
    setCurrentBar(0);
    beatCountRef.current = 0;
    barCountRef.current = 0;
  }, []);

  const updateSettings = useCallback((newSettings: Partial<MetronomeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  return {
    isPlaying,
    start,
    stop,
    settings,
    updateSettings,
    currentBeat,
    currentBar
  };
}
