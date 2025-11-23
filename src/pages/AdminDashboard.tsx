import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, LogOut, User, Clock, TrendingUp, Users } from "lucide-react";
import { toast } from "sonner";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Footer } from "@/components/Footer";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { TextToSpeechButton } from "@/components/TextToSpeechButton";
import logoHorizontal from "@/assets/logo-horizontal.png";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    total: 0,
    byClassification: [] as any[],
    avgWaitTime: 0,
    occupancyRate: 75,
  });

  useEffect(() => {
    checkAuth();
    fetchStats();
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

    // Redirect triage users to triage dashboard
    if (profileData?.role === "triage_professional") {
      navigate("/triage-dashboard");
    }

    setLoading(false);
  };

  const fetchStats = async () => {
    const { data: records, error } = await supabase
      .from("triage_records")
      .select("*");

    if (error) {
      toast.error("Erro ao carregar estatísticas");
      return;
    }

    // Calculate statistics
    const total = records?.length || 0;
    
    // Count by classification
    const classificationCounts = records?.reduce((acc: any, record: any) => {
      acc[record.classification] = (acc[record.classification] || 0) + 1;
      return acc;
    }, {}) || {};

    const byClassification = Object.entries(classificationCounts).map(([key, value]) => ({
      name: getClassificationLabel(key),
      value: value as number,
      color: getClassificationChartColor(key),
    }));

    // Calculate average wait time
    const avgWaitTime = records?.length 
      ? Math.round(records.reduce((sum, r) => sum + r.wait_time_minutes, 0) / records.length)
      : 0;

    setStats({
      total,
      byClassification,
      avgWaitTime,
      occupancyRate: 75, // Mock data
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
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

  const getClassificationChartColor = (classification: string) => {
    const colors = {
      red: "hsl(0, 85%, 60%)",
      orange: "hsl(25, 95%, 53%)",
      yellow: "hsl(48, 96%, 53%)",
      green: "hsl(142, 76%, 36%)",
      blue: "hsl(221, 83%, 53%)",
    };
    return colors[classification as keyof typeof colors] || "#666";
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
              <p className="text-sm text-muted-foreground">Painel Administrativo</p>
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
              <BreadcrumbPage>Painel Administrativo</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <h2 className="text-3xl font-bold mb-6">Estatísticas Gerais</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Pacientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Registros totais</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tempo Médio</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgWaitTime} min</div>
              <p className="text-xs text-muted-foreground">Tempo de espera</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.occupancyRate}%</div>
              <p className="text-xs text-muted-foreground">Capacidade atual</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Casos Críticos</CardTitle>
              <Activity className="h-4 w-4 text-manchester-red" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.byClassification.find(c => c.name === "Emergência")?.value || 0}
              </div>
              <p className="text-xs text-muted-foreground">Emergências ativas</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Classificação</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.byClassification.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.byClassification}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {stats.byClassification.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Sem dados disponíveis
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pacientes por Classificação</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.byClassification.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats.byClassification}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  Sem dados disponíveis
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
