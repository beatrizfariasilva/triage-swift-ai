import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Calendar, Phone, Activity, Thermometer, Heart, Wind, AlertCircle, Clock, FileText } from "lucide-react";

type PatientDetailsProps = {
  patient: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const PatientDetailsDialog = ({ patient, open, onOpenChange }: PatientDetailsProps) => {
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
            <div className="flex gap-3">
              <Badge className={`${getClassificationColor(patient.classification)} text-white px-4 py-2 text-base`}>
                {getClassificationLabel(patient.classification)}
              </Badge>
              <Badge variant="outline" className="px-4 py-2 text-base">
                {getStatusLabel(patient.status)}
              </Badge>
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
        </div>
      </DialogContent>
    </Dialog>
  );
};
