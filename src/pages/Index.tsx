import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-primary rounded-full shadow-lg">
              <Activity className="h-16 w-16 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-foreground">
            triageFlow
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Sistema Profissional de Triagem Hospitalar
          </p>
          <Button
            size="lg"
            className="bg-gradient-primary hover:opacity-90 transition-opacity text-lg px-8 py-6"
            onClick={() => navigate("/auth")}
          >
            Acessar Sistema
          </Button>
        </div>
      </div>

      {/* Protocol Information */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Protocolo de Manchester</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="flex flex-col items-center gap-2 p-4 bg-manchester-red/10 rounded-lg border-2 border-manchester-red">
                <div className="w-8 h-8 rounded-full bg-manchester-red"></div>
                <span className="font-bold text-center">Vermelho</span>
                <span className="text-sm text-center text-muted-foreground">Emergência</span>
                <span className="text-xs text-center text-muted-foreground">Imediato</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-manchester-orange/10 rounded-lg border-2 border-manchester-orange">
                <div className="w-8 h-8 rounded-full bg-manchester-orange"></div>
                <span className="font-bold text-center">Laranja</span>
                <span className="text-sm text-center text-muted-foreground">Muito Urgente</span>
                <span className="text-xs text-center text-muted-foreground">10 min</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-manchester-yellow/10 rounded-lg border-2 border-manchester-yellow">
                <div className="w-8 h-8 rounded-full bg-manchester-yellow"></div>
                <span className="font-bold text-center">Amarelo</span>
                <span className="text-sm text-center text-muted-foreground">Urgente</span>
                <span className="text-xs text-center text-muted-foreground">60 min</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-manchester-green/10 rounded-lg border-2 border-manchester-green">
                <div className="w-8 h-8 rounded-full bg-manchester-green"></div>
                <span className="font-bold text-center">Verde</span>
                <span className="text-sm text-center text-muted-foreground">Pouco Urgente</span>
                <span className="text-xs text-center text-muted-foreground">120 min</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-4 bg-manchester-blue/10 rounded-lg border-2 border-manchester-blue">
                <div className="w-8 h-8 rounded-full bg-manchester-blue"></div>
                <span className="font-bold text-center">Azul</span>
                <span className="text-sm text-center text-muted-foreground">Não Urgente</span>
                <span className="text-xs text-center text-muted-foreground">240 min</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
