import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Stethoscope, ArrowLeft } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const Triage = () => {
  const navigate = useNavigate();
  const [triageData, setTriageData] = useState({
    bloodPressure: "",
    heartRate: "",
    oxygenSaturation: "",
    temperature: "",
    symptoms: "",
    painLevel: "0",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!triageData.bloodPressure || !triageData.heartRate || !triageData.oxygenSaturation) {
      toast.error("Por favor, preencha todos os sinais vitais obrigatórios");
      return;
    }

    // Salvar dados da triagem
    localStorage.setItem("triageData", JSON.stringify(triageData));
    
    toast.success("Dados da triagem registrados!");
    navigate("/loading");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/register")}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="p-3 bg-gradient-secondary rounded-full">
              <Stethoscope className="h-8 w-8 text-secondary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Triagem de Emergência</CardTitle>
          <CardDescription>
            Registre os sinais vitais e sintomas do paciente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Sinais Vitais</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bloodPressure">Pressão Arterial (mmHg) *</Label>
                  <Input
                    id="bloodPressure"
                    placeholder="120/80"
                    value={triageData.bloodPressure}
                    onChange={(e) => setTriageData({ ...triageData, bloodPressure: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="heartRate">Frequência Cardíaca (bpm) *</Label>
                  <Input
                    id="heartRate"
                    type="number"
                    placeholder="75"
                    value={triageData.heartRate}
                    onChange={(e) => setTriageData({ ...triageData, heartRate: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="oxygenSaturation">Saturação de O₂ (%) *</Label>
                  <Input
                    id="oxygenSaturation"
                    type="number"
                    placeholder="98"
                    min="0"
                    max="100"
                    value={triageData.oxygenSaturation}
                    onChange={(e) => setTriageData({ ...triageData, oxygenSaturation: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature">Temperatura (°C)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    placeholder="36.5"
                    value={triageData.temperature}
                    onChange={(e) => setTriageData({ ...triageData, temperature: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Avaliação Clínica</h3>
              
              <div className="space-y-2">
                <Label htmlFor="painLevel">Nível de Dor (0-10)</Label>
                <div className="flex items-center gap-4">
                  <Input
                    id="painLevel"
                    type="range"
                    min="0"
                    max="10"
                    value={triageData.painLevel}
                    onChange={(e) => setTriageData({ ...triageData, painLevel: e.target.value })}
                    className="flex-1"
                  />
                  <span className="text-2xl font-bold w-8 text-center">{triageData.painLevel}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="symptoms">Sintomas e Queixas</Label>
                <Textarea
                  id="symptoms"
                  placeholder="Descreva os sintomas apresentados pelo paciente..."
                  value={triageData.symptoms}
                  onChange={(e) => setTriageData({ ...triageData, symptoms: e.target.value })}
                  rows={4}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/register")}
              >
                Voltar
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-primary hover:opacity-90 transition-opacity"
              >
                Analisar Classificação
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Triage;
