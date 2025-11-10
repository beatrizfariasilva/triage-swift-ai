import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, LogOut, Plus, User } from "lucide-react";
import { toast } from "sonner";

type TriageRecord = {
  id: string;
  patient_name: string;
  classification: string;
  status: string;
  created_at: string;
  wait_time_minutes: number;
};

const TriageDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [records, setRecords] = useState<TriageRecord[]>([]);

  useEffect(() => {
    checkAuth();
    fetchRecords();
  }, []);

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
    const { data, error } = await supabase
      .from("triage_records")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Erro ao carregar triagens");
      return;
    }

    setRecords(data || []);
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="h-8 w-8 text-primary" />
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
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Pacientes em Triagem</h2>
          <Button onClick={() => navigate("/triage")} size="lg">
            <Plus className="h-5 w-5 mr-2" />
            Nova Triagem
          </Button>
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
              <Card key={record.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{record.patient_name}</CardTitle>
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
    </div>
  );
};

export default TriageDashboard;
