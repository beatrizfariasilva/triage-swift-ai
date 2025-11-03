import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Activity, BarChart3, Clock, Shield, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Landing = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    hospital: "",
    contact: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Contato enviado!",
      description: "Entraremos em contato em breve.",
    });
    setFormData({ hospital: "", contact: "", email: "", phone: "", message: "" });
  };

  const benefits = [
    {
      icon: Clock,
      title: "Classificação Instantânea",
      description: "Reduza o tempo de triagem em até 70% com nossa tecnologia de IA",
    },
    {
      icon: Shield,
      title: "Segurança e Precisão",
      description: "Protocolo validado que aumenta a assertividade na classificação de risco",
    },
    {
      icon: BarChart3,
      title: "Análise em Tempo Real",
      description: "Dashboard completo com estatísticas e métricas do seu pronto-socorro",
    },
    {
      icon: Users,
      title: "Gestão Eficiente",
      description: "Histórico completo de pacientes e otimização do fluxo de atendimento",
    },
    {
      icon: TrendingUp,
      title: "Melhoria Contínua",
      description: "Insights baseados em dados para aprimorar processos hospitalares",
    },
    {
      icon: Activity,
      title: "Integração Simples",
      description: "Implementação rápida e treinamento completo para sua equipe",
    },
  ];

  const stats = [
    { value: "70%", label: "Redução no tempo de triagem" },
    { value: "95%", label: "Precisão na classificação" },
    { value: "50+", label: "Hospitais atendidos" },
    { value: "24/7", label: "Suporte disponível" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center space-y-6 animate-fade-up">
            <h1 className="text-5xl md:text-6xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Sistema de Triagem Inteligente
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Transforme a classificação de risco do seu hospital com tecnologia de ponta e IA
            </p>
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all"
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Solicite uma Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center space-y-2 animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-bold text-center mb-4">Por que escolher nosso sistema?</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Uma solução completa para otimizar o atendimento de urgência e emergência
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card 
                key={index} 
                className="p-6 space-y-4 hover:shadow-lg transition-all duration-300 animate-fade-up border-primary/20"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">Funcionalidades Principais</h2>
              <ul className="space-y-4">
                {[
                  "Cadastro rápido e intuitivo de pacientes",
                  "Formulário de triagem otimizado com protocolos validados",
                  "Classificação automática de risco (Vermelho, Amarelo, Verde, Azul)",
                  "Histórico completo do paciente em tempo real",
                  "Dashboard com estatísticas e indicadores de performance",
                  "Sistema baseado em IA e análise probabilística",
                  "Interface responsiva e fácil de usar",
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <span className="text-lg">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Card className="p-8 bg-background/80 backdrop-blur-sm">
              <div className="space-y-6">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg flex items-center justify-center">
                  <Activity className="w-24 h-24 text-primary/40" />
                </div>
                <h3 className="text-2xl font-semibold text-center">Sistema Completo</h3>
                <p className="text-center text-muted-foreground">
                  Todas as ferramentas que seu hospital precisa para uma triagem eficiente e segura
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Entre em Contato</h2>
            <p className="text-xl text-muted-foreground">
              Agende uma demonstração e veja como podemos transformar seu hospital
            </p>
          </div>
          <Card className="p-8 bg-background/80 backdrop-blur-sm border-primary/20">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome do Hospital</label>
                  <Input
                    required
                    value={formData.hospital}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    placeholder="Hospital ABC"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Nome do Contato</label>
                  <Input
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="Dr. João Silva"
                  />
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">E-mail</label>
                  <Input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contato@hospital.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Telefone</label>
                  <Input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Mensagem</label>
                <Textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Conte-nos mais sobre suas necessidades..."
                  rows={4}
                />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 transition-all"
              >
                Solicitar Contato
              </Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-background/50 backdrop-blur-sm border-t">
        <div className="container mx-auto max-w-6xl text-center text-muted-foreground">
          <p>© 2024 Sistema de Triagem Inteligente. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
