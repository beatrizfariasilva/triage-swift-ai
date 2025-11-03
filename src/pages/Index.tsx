import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, FileText, BarChart3, Stethoscope, Play } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: FileText,
      title: "Cadastro Rápido",
      description: "Registre pacientes em segundos",
      action: () => navigate("/register"),
      gradient: "from-primary to-primary/70",
    },
    {
      icon: Stethoscope,
      title: "Triagem Inteligente",
      description: "Sistema de classificação por IA",
      action: () => navigate("/register"),
      gradient: "from-secondary to-secondary/70",
    },
    {
      icon: BarChart3,
      title: "Estatísticas",
      description: "Visualize dados do hospital",
      action: () => navigate("/stats"),
      gradient: "from-accent to-accent/70",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-primary rounded-full shadow-lg">
              <Activity className="h-16 w-16 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
            Sistema de Triagem Hospitalar
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Classificação de risco rápida e inteligente com análise por IA e probabilidade
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-gradient-primary hover:opacity-90 transition-opacity text-lg px-8 py-6"
              onClick={() => navigate("/register")}
            >
              Iniciar Nova Triagem
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-primary text-lg px-8 py-6 hover:bg-primary/10"
              onClick={() => navigate("/landing")}
            >
              <Play className="mr-2 h-5 w-5" />
              Iniciar Demo
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-primary"
              onClick={feature.action}
            >
              <CardHeader>
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="h-7 w-7 text-white" />
                </div>
                <CardTitle className="text-2xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Info Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl">Classificação por Cores</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-emergency"></div>
                <span className="font-semibold">Vermelho</span>
                <span className="text-muted-foreground">- Emergência (Imediato)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-urgent"></div>
                <span className="font-semibold">Amarelo</span>
                <span className="text-muted-foreground">- Urgência (10-15 min)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-low-priority"></div>
                <span className="font-semibold">Verde</span>
                <span className="text-muted-foreground">- Pouco Urgente (30-60 min)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-non-urgent"></div>
                <span className="font-semibold">Azul</span>
                <span className="text-muted-foreground">- Não Urgente (60-120 min)</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardHeader>
              <CardTitle className="text-xl">Análise Inteligente</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Nosso sistema utiliza inteligência artificial e análise probabilística para 
                classificar pacientes rapidamente, considerando sinais vitais, sintomas e 
                histórico médico. Isso garante atendimento prioritário para casos críticos 
                e otimiza o fluxo de pacientes no hospital.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
