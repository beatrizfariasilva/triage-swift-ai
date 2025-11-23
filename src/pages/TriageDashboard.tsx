import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, LogOut, Plus, User, Filter, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { PatientDetailsDialog } from "@/components/PatientDetailsDialog";
import { Footer } from "@/components/Footer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { TextToSpeechButton } from "@/components/TextToSpeechButton";
import logoHorizontal from "@/assets/logo-horizontal.png";

type TriageRecord = {
  id: string;
  patient_name: string;
  patient_cpf: string;
  classification: string;
  status: string;
  created_at: string;
  wait_time_minutes: number;
  is_recurring?: boolean;
};

const TriageDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [records, setRecords] = useState<TriageRecord[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [filterBy, setFilterBy] = useState<string>("created_at");

  useEffect(() => {
    checkAuth();
    fetchRecords();
  }, [filterBy]);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
      return;
    }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    setProfile(profileData);

    // Redirect admin users to admin dashboard
    if (profileData?.role === "admin_professional") {
      navigate("/admin-dashboard");
    }

    setLoading(false);
  };

  const fetchRecords = async () => {
    let query = supabase.from("triage_records").select("*");

    // Apply sorting based on filter
    if (filterBy === "severity") {
      const { data, error } = await query;
      if (error) {
        toast.error("Erro ao carregar triagens");
        return;
      }
      // Sort by severity manually
      const severityOrder = { red: 0, orange: 1, yellow: 2, green: 3, blue: 4 };
      const sorted = (data || []).sort((a, b) => 
        (severityOrder[a.classification as keyof typeof severityOrder] || 5) - 
        (severityOrder[b.classification as keyof typeof severityOrder] || 5)
      );
      
      // Check if patients are recurring
      const recordsWithHistory = await Promise.all(
        sorted.map(async (record) => {
          const { count } = await supabase
            .from("triage_records")
            .select("*", { count: "exact", head: true })
            .eq("patient_cpf", record.patient_cpf)
            .neq("id", record.id);
          
          return { ...record, is_recurring: (count || 0) > 0 };
        })
      );
      
      setRecords(recordsWithHistory);
    } else if (filterBy === "age") {
      const { data, error } = await query;
      if (error) {
        toast.error("Erro ao carregar triagens");
        return;
      }
      // Sort by age (calculated from birth date)
      const sorted = (data || []).sort((a, b) => {
        const ageA = new Date().getFullYear() - new Date(a.patient_birth_date).getFullYear();
        const ageB = new Date().getFullYear() - new Date(b.patient_birth_date).getFullYear();
        return ageB - ageA; // Older first
      });
      
      // Check if patients are recurring
      const recordsWithHistory = await Promise.all(
        sorted.map(async (record) => {
          const { count } = await supabase
            .from("triage_records")
            .select("*", { count: "exact", head: true })
            .eq("patient_cpf", record.patient_cpf)
            .neq("id", record.id);
          
          return { ...record, is_recurring: (count || 0) > 0 };
        })
      );
      
      setRecords(recordsWithHistory);
    } else {
      // Default: sort by created_at
      const { data, error } = await query.order("created_at", { ascending: false });
      if (error) {
        toast.error("Erro ao carregar triagens");
        return;
      }
      
      // Check if patients are recurring
      const recordsWithHistory = await Promise.all(
        (data || []).map(async (record) => {
          const { count } = await supabase
            .from("triage_records")
            .select("*", { count: "exact", head: true })
            .eq("patient_cpf", record.patient_cpf)
            .neq("id", record.id);
          
          return { ...record, is_recurring: (count || 0) > 0 };
        })
      );
      
      setRecords(recordsWithHistory);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Activity className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TextToSpeechButton />
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logoHorizontal} alt="TriageFlow" className="h-8 w-auto" />
            <div>
              <h1 className="text-2xl font-bold text-foreground">triageFlow</h1>
              <p className="text-sm text-muted-foreground">Painel de Triagem</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium">{profile?.full_name}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex-1">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/triage-dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Pacientes em Triagem</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h2 className="text-3xl font-bold">Pacientes em Triagem</h2>
          <div className="flex gap-3 w-full sm:w-auto">
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="w-[200px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="created_at">Mais Recentes</SelectItem>
                <SelectItem value="severity">Gravidade</SelectItem>
                <SelectItem value="age">Idade (Maior)</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => navigate("/triage")} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Nova Triagem
            </Button>
          </div>
        </div>

        {/* Records Grid */}
        <div className="grid gap-4">
          {records.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">Nenhum paciente em triagem no momento</p>
              </CardContent>
            </Card>
          ) : (
            records.map((record) => (
              <Card 
                key={record.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={async () => {
                  const { data } = await supabase
                    .from("triage_records")
                    .select("*")
                    .eq("id", record.id)
                    .single();
                  setSelectedPatient(data);
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{record.patient_name}</CardTitle>
                      {record.is_recurring && (
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <UserCheck className="h-3 w-3" />
                          Recorrente
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getClassificationColor(
                          record.classification
                        )}`}
                      >
                        {getClassificationLabel(record.classification)}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-muted text-sm font-medium">
                        {getStatusLabel(record.status)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Chegada: {new Date(record.created_at).toLocaleString("pt-BR")}
                    </span>
                    <span className="font-medium">
                      Tempo de espera: {record.wait_time_minutes} min
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>

      <PatientDetailsDialog 
        patient={selectedPatient} 
        open={!!selectedPatient} 
        onOpenChange={(open) => !open && setSelectedPatient(null)}
        onStatusUpdate={fetchRecords}
      />

      <Footer />
    </div>
  );
};

export default TriageDashboard;
