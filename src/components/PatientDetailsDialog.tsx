import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { User, Calendar, Phone, Activity, Thermometer, Heart, Wind, AlertCircle, Clock, FileText, History } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState, useEffect } from "react";

type PatientDetailsProps = {
  patient: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusUpdate?: () => void;
};

export const PatientDetailsDialog = ({ patient, open, onOpenChange, onStatusUpdate }: PatientDetailsProps) => {
  const [status, setStatus] = useState(patient?.status || "waiting");
  const [patientHistory, setPatientHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (patient) {
      setStatus(patient.status);
      fetchPatientHistory();
    }
  }, [patient]);

  const fetchPatientHistory = async () => {
    if (!patient?.patient_cpf) return;
    
    setLoadingHistory(true);
    const { data, error } = await supabase
      .from("triage_records")
      .select("*")
      .eq("patient_cpf", patient.patient_cpf)
      .neq("id", patient.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao buscar histórico:", error);
    } else {
      setPatientHistory(data || []);
    }
    setLoadingHistory(false);
  };

  const handleStatusUpdate = async (newStatus: string) => {
    const { error } = await supabase
      .from("triage_records")
      .update({ status: newStatus })
      .eq("id", patient.id);

    if (error) {
      toast.error("Erro ao atualizar status");
      return;
    }

    setStatus(newStatus);
    toast.success("Status atualizado com sucesso");
    onStatusUpdate?.();
  };

  if (!patient) return null;

  const getClassificationColor = (classification: string) => {
    const colors = {
      red: "bg-manchester-red",
      orange: "bg-manchester-orange",
      yellow: "bg-manchester-yellow",
      green: "bg-manchester-green",
      blue: "bg-manchester-blue",
    };
    return colors[classification as keyof typeof colors] || "bg-gray-500";
  };

  const getClassificationLabel = (classification: string) => {
    const labels = {
      red: "Emergência",
      orange: "Muito Urgente",
      yellow: "Urgente",
      green: "Pouco Urgente",
      blue: "Não Urgente",
    };
    return labels[classification as keyof typeof labels] || classification;
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      waiting: "Aguardando",
      in_care: "Em Atendimento",
      completed: "Concluído",
      pending_recheck: "Aguardando Reavaliação",
    };
    return labels[status as keyof typeof labels] || status;
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-3">
            <User className="h-6 w-6 text-primary" />
            Detalhes do Paciente
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Patient Info */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">Informações do Paciente</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Nome</p>
                <p className="font-medium">{patient.patient_name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">CPF</p>
                <p className="font-medium">{patient.patient_cpf}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                <p className="font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(patient.patient_birth_date).toLocaleDateString("pt-BR")} ({calculateAge(patient.patient_birth_date)} anos)
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Gênero</p>
                <p className="font-medium">{patient.patient_gender === "male" ? "Masculino" : patient.patient_gender === "female" ? "Feminino" : "Outro"}</p>
              </div>
              {patient.patient_phone && (
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Telefone</p>
                  <p className="font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {patient.patient_phone}
                  </p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Classification */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">Classificação e Status</h3>
            <div className="flex gap-3 items-center">
              <Badge className={`${getClassificationColor(patient.classification)} text-white px-4 py-2 text-base`}>
                {getClassificationLabel(patient.classification)}
              </Badge>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <Select value={status} onValueChange={handleStatusUpdate}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="waiting">Aguardando</SelectItem>
                    <SelectItem value="in_care">Em Atendimento</SelectItem>
                    <SelectItem value="pending_recheck">Aguardando Reavaliação</SelectItem>
                    <SelectItem value="completed">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Tempo de espera: {patient.wait_time_minutes} minutos</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Chegada: {new Date(patient.created_at).toLocaleString("pt-BR")}
            </div>
          </div>

          <Separator />

          {/* Vital Signs */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">Sinais Vitais</h3>
            <div className="grid grid-cols-2 gap-4">
              {patient.blood_pressure && (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Activity className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Pressão Arterial</p>
                    <p className="font-medium">{patient.blood_pressure} mmHg</p>
                  </div>
                </div>
              )}
              {patient.heart_rate && (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Heart className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Frequência Cardíaca</p>
                    <p className="font-medium">{patient.heart_rate} bpm</p>
                  </div>
                </div>
              )}
              {patient.oxygen_saturation && (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Wind className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Saturação de O₂</p>
                    <p className="font-medium">{patient.oxygen_saturation}%</p>
                  </div>
                </div>
              )}
              {patient.temperature && (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <Thermometer className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Temperatura</p>
                    <p className="font-medium">{patient.temperature}°C</p>
                  </div>
                </div>
              )}
              {patient.pain_level !== null && patient.pain_level !== undefined && (
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Nível de Dor</p>
                    <p className="font-medium">{patient.pain_level}/10</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Clinical Information */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2">Informações Clínicas</h3>
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium">Sintomas</p>
                </div>
                <p className="text-sm">{patient.symptoms}</p>
              </div>
              {patient.observations && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4 text-primary" />
                    <p className="text-sm font-medium">Observações</p>
                  </div>
                  <p className="text-sm">{patient.observations}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Patient History */}
          <div className="space-y-3">
            <h3 className="font-semibold text-lg border-b pb-2 flex items-center gap-2">
              <History className="h-5 w-5 text-primary" />
              Histórico de Atendimentos
            </h3>
            {loadingHistory ? (
              <p className="text-sm text-muted-foreground">Carregando histórico...</p>
            ) : patientHistory.length === 0 ? (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">
                  <strong>Paciente Novo</strong> - Este é o primeiro atendimento do paciente no sistema.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Paciente Recorrente</strong> - {patientHistory.length} atendimento(s) anterior(es):
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {patientHistory.map((record) => (
                    <div key={record.id} className="p-3 bg-muted rounded-lg text-sm">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-medium">
                          {new Date(record.created_at).toLocaleDateString("pt-BR")}
                        </span>
                        <Badge className={`${getClassificationColor(record.classification)} text-white text-xs`}>
                          {getClassificationLabel(record.classification)}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground text-xs">
                        Status: {getStatusLabel(record.status)}
                      </p>
                      {record.symptoms && (
                        <p className="text-muted-foreground text-xs mt-1">
                          Sintomas: {record.symptoms.substring(0, 100)}...
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
