import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";

export const TextToSpeechButton = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
      console.warn("Text-to-speech não é suportado neste navegador");
    }
  }, []);

  const speakPageContent = () => {
    if (!isSupported) {
      toast.error("Seu navegador não suporta leitura de texto");
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Get visible text content from the page
    const mainContent = document.querySelector('main') || document.body;
    const textContent = mainContent.innerText;

    if (!textContent.trim()) {
      toast.error("Nenhum conteúdo para ler");
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textContent);
    utterance.lang = 'pt-BR';
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => {
      setIsSpeaking(false);
      toast.error("Erro ao ler o conteúdo");
    };

    window.speechSynthesis.speak(utterance);
  };

  if (!isSupported) return null;

  return (
    <Button
      onClick={speakPageContent}
      variant="outline"
      className="fixed bottom-4 right-4 z-50 rounded-full shadow-lg gap-2 px-4 py-2"
      title={isSpeaking ? "Parar leitura" : "Ler conteúdo da tela"}
    >
      {isSpeaking ? (
        <VolumeX className="h-4 w-4" />
      ) : (
        <Volume2 className="h-4 w-4" />
      )}
      <span className="text-sm font-medium">
        {isSpeaking ? "Parar" : "Audio-texto"}
      </span>
    </Button>
  );
};
