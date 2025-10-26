import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Clock, TrendingUp, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Classification {
  level: string;
  color: string;
  priority: string;
  waitTime: string;
  probability: number;
}

const Result = () => {
  const navigate = useNavigate();
  const [classification, setClassification] = useState<Classification | null>(null);
  const [patientData, setPatientData] = useState<any>(null);
  const [triageData, setTriageData] = useState<any>(null);

  useEffect(() => {
    // Recuperar dados
    const patient = localStorage.getItem("currentPatient");
    const triage = localStorage.getItem("triageData");

    if (patient) setPatientData(JSON.parse(patient));
    if (triage) setTriageData(JSON.parse(triage));

    // Simular classificação baseada em IA
    const calculateClassification = () => {
      if (triage) {
        const data = JSON.parse(triage);
        const saturation = parseInt(data.oxygenSaturation);
        const heartRate = parseInt(data.heartRate);
        const painLevel = parseInt(data.painLevel);

        // Lógica simplificada de classificação
        if (saturation < 90 || heartRate > 120 || painLevel >= 8) {
          return {
            level: "Emergência",
            color: "emergency",
            priority: "Vermelho",
            waitTime: "Imediato",
            probability: 92,
          };
        } else if (saturation < 95 || heartRate > 100 || painLevel >= 5) {
          return {
            level: "Urgência",
            color: "urgent",
            priority: "Amarelo",
            waitTime: "10-15 minutos",
            probability: 85,
          };
        } else if (painLevel >= 3) {
          return {
            level: "Pouco Urgente",
            color: "low-priority",
            priority: "Verde",
            waitTime: "30-60 minutos",
            probability: 78,
          };
        } else {
          return {
            level: "Não Urgente",
            color: "non-urgent",
            priority: "Azul",
            waitTime: "60-120 minutos",
            probability: 88,
          };
        }
      }
      return null;
    };

    setClassification(calculateClassification());
  }, []);

  const history = [
    { date: "15/03/2025", classification: "Verde", reason: "Check-up geral" },
    { date: "02/01/2025", classification: "Amarelo", reason: "Febre alta" },
    { date: "20/11/2024", classification: "Verde", reason: "Consulta preventiva" },
  ];

  if (!classification) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4 py-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Resultado da Triagem</h1>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
          >
            <Home className="mr-2 h-4 w-4" />
            Início
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Classificação Principal */}
          <Card className="lg:col-span-2 shadow-lg border-2" style={{ borderColor: `hsl(var(--${classification.color}))` }}>
            <CardHeader>
              <CardTitle className="text-2xl">Classificação de Risco</CardTitle>
              <CardDescription>Baseado em análise de IA e probabilidade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-full" style={{ backgroundColor: `hsl(var(--${classification.color}) / 0.2)` }}>
                  <AlertCircle className="h-12 w-12" style={{ color: `hsl(var(--${classification.color}))` }} />
                </div>
                <div>
                  <h2 className="text-4xl font-bold" style={{ color: `hsl(var(--${classification.color}))` }}>
                    {classification.priority}
                  </h2>
                  <p className="text-xl text-muted-foreground">{classification.level}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Tempo de Espera</span>
                  </div>
                  <p className="text-2xl font-bold">{classification.waitTime}</p>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-secondary" />
                    <span className="font-semibold">Confiabilidade IA</span>
                  </div>
                  <p className="text-2xl font-bold">{classification.probability}%</p>
                </div>
              </div>

              {triageData && (
                <div className="space-y-3 pt-4 border-t">
                  <h3 className="font-semibold text-lg">Sinais Vitais Registrados</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-muted-foreground">PA:</span> <span className="font-medium">{triageData.bloodPressure} mmHg</span></div>
                    <div><span className="text-muted-foreground">FC:</span> <span className="font-medium">{triageData.heartRate} bpm</span></div>
                    <div><span className="text-muted-foreground">SpO₂:</span> <span className="font-medium">{triageData.oxygenSaturation}%</span></div>
                    <div><span className="text-muted-foreground">Dor:</span> <span className="font-medium">{triageData.painLevel}/10</span></div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Dados do Paciente */}
          {patientData && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Dados do Paciente</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-semibold">{patientData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">CPF</p>
                  <p className="font-semibold">{patientData.cpf}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Nascimento</p>
                  <p className="font-semibold">{patientData.birthDate}</p>
                </div>
                {patientData.phone && (
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-semibold">{patientData.phone}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Histórico */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Histórico de Atendimentos</CardTitle>
            <CardDescription>Últimas classificações do paciente</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={
                      item.classification === "Verde" ? "bg-low-priority/10 text-low-priority border-low-priority" :
                      item.classification === "Amarelo" ? "bg-urgent/10 text-urgent border-urgent" :
                      "bg-emergency/10 text-emergency border-emergency"
                    }>
                      {item.classification}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{item.date}</span>
                  </div>
                  <span className="text-sm">{item.reason}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button
            className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity"
            onClick={() => navigate("/stats")}
          >
            Ver Estatísticas do Hospital
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => navigate("/register")}
          >
            Nova Triagem
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Result;
