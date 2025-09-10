import { useRef, useState, useCallback } from 'react';

interface UseRecorderReturn {
  start: () => Promise<void>;
  stop: () => void;
  recording: boolean;
  blob: Blob | null;
  error: string | null;
  duration: number;
}

export function useRecorder(): UseRecorderReturn {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const startTimeRef = useRef<number>(0);
  
  const [recording, setRecording] = useState(false);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);

  const start = useCallback(async () => {
    try {
      setError(null);
      
      // Solicitar acesso ao microfone
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 48000
        } 
      });
      
      streamRef.current = stream;
      
      // Configurar MediaRecorder
      const options = {
        mimeType: 'audio/webm;codecs=opus'
      };
      
      // Fallback para outros formatos se webm não estiver disponível
      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        if (MediaRecorder.isTypeSupported('audio/mp4')) {
          options.mimeType = 'audio/mp4';
        } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
          options.mimeType = 'audio/ogg;codecs=opus';
        } else {
          options.mimeType = 'audio/webm';
        }
      }
      
      mediaRecorder.current = new MediaRecorder(stream, options);
      chunks.current = [];
      
      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.current.push(event.data);
        }
      };
      
      mediaRecorder.current.onstop = () => {
        const audioBlob = new Blob(chunks.current, { 
          type: mediaRecorder.current?.mimeType || 'audio/webm' 
        });
        setBlob(audioBlob);
        
        // Parar todas as tracks do stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop());
          streamRef.current = null;
        }
      };
      
      mediaRecorder.current.onerror = (event) => {
        console.error('Erro no MediaRecorder:', event);
        setError('Erro durante a gravação');
        setRecording(false);
      };
      
      // Iniciar gravação
      mediaRecorder.current.start(100); // Coletar dados a cada 100ms
      setRecording(true);
      startTimeRef.current = Date.now();
      
      // Atualizar duração a cada segundo
      const durationInterval = setInterval(() => {
        if (recording) {
          setDuration(Math.floor((Date.now() - startTimeRef.current) / 1000));
        } else {
          clearInterval(durationInterval);
        }
      }, 1000);
      
    } catch (err) {
      console.error('Erro ao iniciar gravação:', err);
      setError('Não foi possível acessar o microfone. Verifique as permissões.');
    }
  }, [recording]);

  const stop = useCallback(() => {
    if (mediaRecorder.current && recording) {
      mediaRecorder.current.stop();
      setRecording(false);
      setDuration(0);
    }
  }, [recording]);

  return {
    start,
    stop,
    recording,
    blob,
    error,
    duration
  };
}
