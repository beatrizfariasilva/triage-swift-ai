import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Activity, ArrowLeft } from "lucide-react";

const Triage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [patientData, setPatientData] = useState({
    name: "",
    cpf: "",
    birthDate: "",
    gender: "",
    phone: "",
  });
  const [vitalSigns, setVitalSigns] = useState({
    bloodPressure: "",
    heartRate: "",
    oxygenSaturation: "",
    temperature: "",
  });
  const [clinicalData, setClinicalData] = useState({
    symptoms: "",
    painLevel: "",
    observations: "",
    classification: "yellow" as "red" | "orange" | "yellow" | "green" | "blue",
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!patientData.name || !patientData.cpf || !patientData.birthDate || !patientData.gender) {
      toast.error("Por favor, preencha todos os dados do paciente");
      return;
    }

    if (!vitalSigns.bloodPressure || !vitalSigns.heartRate || !vitalSigns.oxygenSaturation || !vitalSigns.temperature) {
      toast.error("Por favor, preencha todos os sinais vitais");
      return;
    }

    if (!clinicalData.symptoms) {
      toast.error("Por favor, descreva os sintomas");
      return;
    }

    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Você precisa estar logado");
        navigate("/auth");
        return;
      }

      const { error } = await supabase.from("triage_records").insert({
        patient_name: patientData.name,
        patient_cpf: patientData.cpf,
        patient_birth_date: patientData.birthDate,
        patient_gender: patientData.gender,
        patient_phone: patientData.phone || null,
        classification: clinicalData.classification,
        blood_pressure: vitalSigns.bloodPressure,
        heart_rate: parseInt(vitalSigns.heartRate),
        oxygen_saturation: parseInt(vitalSigns.oxygenSaturation),
        temperature: parseFloat(vitalSigns.temperature),
        symptoms: clinicalData.symptoms,
        pain_level: clinicalData.painLevel ? parseInt(clinicalData.painLevel) : null,
        observations: clinicalData.observations || null,
        triage_professional_id: session.user.id,
      });

      if (error) throw error;

      toast.success("Triagem registrada com sucesso!");
      navigate("/triage-dashboard");
    } catch (error: any) {
      toast.error(error.message || "Erro ao registrar triagem");
    } finally {
      setLoading(false);
    }
  };

  const getClassificationColor = (classification: string) => {
    const colors = {
      red: "bg-manchester-red",
      orange: "bg-manchester-orange",
      yellow: "bg-manchester-yellow",
      green: "bg-manchester-green",
      blue: "bg-manchester-blue",
    };
    return colors[classification as keyof typeof colors];
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto py-8">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-4 mb-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/triage-dashboard")}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="p-3 bg-gradient-primary rounded-full">
                <Activity className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold">Nova Triagem</CardTitle>
            <CardDescription>
              Registre os dados do paciente e classificação segundo Protocolo de Manchester
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Patient Data */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Dados do Paciente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome Completo *</Label>
                    <Input
                      id="name"
                      value={patientData.name}
                      onChange={(e) => setPatientData({ ...patientData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cpf">CPF *</Label>
                    <Input
                      id="cpf"
                      value={patientData.cpf}
                      onChange={(e) => setPatientData({ ...patientData, cpf: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Data de Nascimento *</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={patientData.birthDate}
                      onChange={(e) => setPatientData({ ...patientData, birthDate: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gênero *</Label>
                    <Select
                      value={patientData.gender}
                      onValueChange={(value) => setPatientData({ ...patientData, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="masculino">Masculino</SelectItem>
                        <SelectItem value="feminino">Feminino</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={patientData.phone}
                      onChange={(e) => setPatientData({ ...patientData, phone: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Vital Signs */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Sinais Vitais</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bloodPressure">Pressão Arterial (mmHg) *</Label>
                    <Input
                      id="bloodPressure"
                      placeholder="120/80"
                      value={vitalSigns.bloodPressure}
                      onChange={(e) => setVitalSigns({ ...vitalSigns, bloodPressure: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="heartRate">Frequência Cardíaca (bpm) *</Label>
                    <Input
                      id="heartRate"
                      type="number"
                      placeholder="75"
                      value={vitalSigns.heartRate}
                      onChange={(e) => setVitalSigns({ ...vitalSigns, heartRate: e.target.value })}
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
                      value={vitalSigns.oxygenSaturation}
                      onChange={(e) => setVitalSigns({ ...vitalSigns, oxygenSaturation: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperatura (°C) *</Label>
                    <Input
                      id="temperature"
                      type="number"
                      step="0.1"
                      placeholder="36.5"
                      value={vitalSigns.temperature}
                      onChange={(e) => setVitalSigns({ ...vitalSigns, temperature: e.target.value })}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Clinical Assessment */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Avaliação Clínica</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="classification">Classificação de Manchester *</Label>
                  <Select
                    value={clinicalData.classification}
                    onValueChange={(value: any) => setClinicalData({ ...clinicalData, classification: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="red">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${getClassificationColor("red")}`}></div>
                          Vermelho - Emergência
                        </div>
                      </SelectItem>
                      <SelectItem value="orange">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${getClassificationColor("orange")}`}></div>
                          Laranja - Muito Urgente
                        </div>
                      </SelectItem>
                      <SelectItem value="yellow">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${getClassificationColor("yellow")}`}></div>
                          Amarelo - Urgente
                        </div>
                      </SelectItem>
                      <SelectItem value="green">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${getClassificationColor("green")}`}></div>
                          Verde - Pouco Urgente
                        </div>
                      </SelectItem>
                      <SelectItem value="blue">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full ${getClassificationColor("blue")}`}></div>
                          Azul - Não Urgente
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="painLevel">Nível de Dor (0-10)</Label>
                  <Input
                    id="painLevel"
                    type="number"
                    min="0"
                    max="10"
                    placeholder="0"
                    value={clinicalData.painLevel}
                    onChange={(e) => setClinicalData({ ...clinicalData, painLevel: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="symptoms">Sintomas *</Label>
                  <Textarea
                    id="symptoms"
                    placeholder="Descreva os sintomas apresentados pelo paciente..."
                    value={clinicalData.symptoms}
                    onChange={(e) => setClinicalData({ ...clinicalData, symptoms: e.target.value })}
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observations">Observações</Label>
                  <Textarea
                    id="observations"
                    placeholder="Informações adicionais relevantes..."
                    value={clinicalData.observations}
                    onChange={(e) => setClinicalData({ ...clinicalData, observations: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate("/triage-dashboard")}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-primary hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Registrar Triagem"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Triage;
