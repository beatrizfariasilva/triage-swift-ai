import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { toast } from "sonner";

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

export const VoiceInputButton = ({ onTranscript, disabled }: VoiceInputButtonProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      console.warn("Speech recognition não é suportado neste navegador");
      return;
    }

    const recognitionInstance = new SpeechRecognition();
    recognitionInstance.lang = 'pt-BR';
    recognitionInstance.continuous = false;
    recognitionInstance.interimResults = false;

    recognitionInstance.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      toast.success("Texto transcrito com sucesso");
      setIsListening(false);
    };

    recognitionInstance.onerror = (event: any) => {
      console.error("Erro no reconhecimento de voz:", event.error);
      if (event.error === 'no-speech') {
        toast.error("Nenhuma fala detectada");
      } else if (event.error === 'not-allowed') {
        toast.error("Permissão de microfone negada");
      } else {
        toast.error("Erro ao reconhecer voz");
      }
      setIsListening(false);
    };

    recognitionInstance.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognitionInstance);

    return () => {
      if (recognitionInstance) {
        recognitionInstance.abort();
      }
    };
  }, [onTranscript]);

  const toggleListening = () => {
    if (!isSupported) {
      toast.error("Seu navegador não suporta reconhecimento de voz");
      return;
    }

    if (disabled) return;

    if (isListening) {
      recognition?.stop();
      setIsListening(false);
    } else {
      recognition?.start();
      setIsListening(true);
      toast.info("Fale agora...");
    }
  };

  if (!isSupported) return null;

  return (
    <Button
      type="button"
      onClick={toggleListening}
      variant="outline"
      disabled={disabled}
      className={`gap-2 ${isListening ? "bg-primary text-primary-foreground" : ""}`}
      title={isListening ? "Parar gravação" : "Preencher por voz"}
    >
      {isListening ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
      <span className="text-sm whitespace-nowrap">
        {isListening ? "Parar" : "Preencher por voz"}
      </span>
    </Button>
  );
};
