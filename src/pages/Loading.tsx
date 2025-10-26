import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";

const Loading = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Simular processamento de IA
    const timer = setTimeout(() => {
      navigate("/result");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="pt-12 pb-12">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary rounded-full animate-pulse-slow opacity-50"></div>
              <div className="relative p-6 bg-gradient-primary rounded-full">
                <Activity className="h-16 w-16 text-primary-foreground animate-pulse" />
              </div>
            </div>
            
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Analisando dados...</h2>
              <p className="text-muted-foreground">
                Processando sinais vitais e calculando classificação de risco
              </p>
            </div>

            <div className="w-full max-w-xs">
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-primary animate-[loading_2s_ease-in-out_infinite]" 
                     style={{
                       width: '100%',
                       animation: 'loading 2s ease-in-out infinite',
                     }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default Loading;
