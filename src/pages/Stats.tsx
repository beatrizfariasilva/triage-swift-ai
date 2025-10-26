import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Users, TrendingUp, AlertCircle } from "lucide-react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Stats = () => {
  const navigate = useNavigate();

  // Dados simulados para estatísticas
  const classificationData = [
    { name: "Vermelho", value: 45, color: "hsl(var(--emergency))" },
    { name: "Amarelo", value: 120, color: "hsl(var(--urgent))" },
    { name: "Verde", value: 230, color: "hsl(var(--low-priority))" },
    { name: "Azul", value: 85, color: "hsl(var(--non-urgent))" },
  ];

  const ageData = [
    { faixa: "0-17", quantidade: 95 },
    { faixa: "18-30", quantidade: 140 },
    { faixa: "31-50", quantidade: 165 },
    { faixa: "51-70", quantidade: 125 },
    { faixa: "71+", quantidade: 55 },
  ];

  const genderData = [
    { name: "Masculino", value: 245, color: "hsl(210 80% 48%)" },
    { name: "Feminino", value: 235, color: "hsl(150 60% 50%)" },
  ];

  const totalPatients = classificationData.reduce((sum, item) => sum + item.value, 0);
  const criticalCases = classificationData[0].value + classificationData[1].value;
  const childrenPatients = ageData[0].quantidade;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted p-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Estatísticas do Hospital</h1>
            <p className="text-muted-foreground">Visão geral dos atendimentos de emergência</p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate("/")}
          >
            <Home className="mr-2 h-4 w-4" />
            Início
          </Button>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total de Pacientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="text-3xl font-bold">{totalPatients}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Casos Críticos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-emergency" />
                <span className="text-3xl font-bold">{criticalCases}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Taxa de Ocupação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-secondary" />
                <span className="text-3xl font-bold">78%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Crianças (0-17)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-accent" />
                <span className="text-3xl font-bold">{childrenPatients}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Classificação de Risco */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Classificação de Risco</CardTitle>
              <CardDescription>Distribuição por nível de urgência</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={classificationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {classificationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Por Sexo */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Distribuição por Sexo</CardTitle>
              <CardDescription>Pacientes atendidos por sexo</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Faixa Etária */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Distribuição por Faixa Etária</CardTitle>
            <CardDescription>Quantidade de pacientes por idade</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="faixa" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="quantidade" fill="hsl(var(--primary))" name="Pacientes" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Button
          className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
          onClick={() => navigate("/register")}
        >
          Nova Triagem
        </Button>
      </div>
    </div>
  );
};

export default Stats;
