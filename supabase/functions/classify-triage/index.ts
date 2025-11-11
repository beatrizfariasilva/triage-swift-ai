import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { patientData, vitalSigns, symptoms, painLevel } = await req.json();
    
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `Você é um sistema especializado em triagem hospitalar baseado no Protocolo de Manchester. 
    
Seu papel é classificar a urgência de pacientes em uma das 5 categorias:
- "red" (Vermelho - Emergência): Risco imediato de vida, necessita atendimento imediato (0 minutos)
- "orange" (Laranja - Muito Urgente): Risco de vida potencial, atendimento em até 10 minutos
- "yellow" (Amarelo - Urgente): Situação urgente mas estável, atendimento em até 60 minutos
- "green" (Verde - Pouco Urgente): Situação não urgente, atendimento em até 120 minutos
- "blue" (Azul - Não Urgente): Problema menor, atendimento em até 240 minutos

Critérios do Protocolo de Manchester:

VERMELHO (red):
- Parada cardiorrespiratória
- Obstrução total de vias aéreas
- Saturação O2 < 90%
- Frequência cardíaca < 40 ou > 140 bpm
- Pressão arterial sistólica < 80 mmHg
- Temperatura > 41°C
- Nível de dor 10/10 com sinais de choque
- Inconsciência ou rebaixamento grave de consciência

LARANJA (orange):
- Saturação O2 90-93%
- Frequência cardíaca 40-50 ou 130-140 bpm
- Pressão arterial sistólica 80-90 mmHg
- Temperatura 39-41°C
- Dor torácica aguda
- Convulsões
- Trauma grave
- Sangramento moderado a grave
- Nível de dor 8-9/10

AMARELO (yellow):
- Saturação O2 94-95%
- Frequência cardíaca 50-60 ou 120-130 bpm
- Temperatura 38-39°C
- Dor abdominal intensa
- Vômitos persistentes
- Asma/DPOC com dispneia
- Nível de dor 6-7/10

VERDE (green):
- Sinais vitais estáveis
- Sintomas leves a moderados
- Dor controlável
- Problemas crônicos estáveis
- Nível de dor 3-5/10

AZUL (blue):
- Todos os sinais vitais normais
- Sintomas muito leves
- Questões administrativas
- Nível de dor 0-2/10

IMPORTANTE: Retorne APENAS uma das palavras: red, orange, yellow, green ou blue. Nada mais.`;

    const userPrompt = `Classifique este paciente:

Dados do Paciente:
- Nome: ${patientData.name}
- Idade: ${calculateAge(patientData.birthDate)} anos
- Gênero: ${patientData.gender}

Sinais Vitais:
- Pressão Arterial: ${vitalSigns.bloodPressure} mmHg
- Frequência Cardíaca: ${vitalSigns.heartRate} bpm
- Saturação de O2: ${vitalSigns.oxygenSaturation}%
- Temperatura: ${vitalSigns.temperature}°C

Avaliação Clínica:
- Sintomas: ${symptoms}
- Nível de Dor: ${painLevel || 0}/10

Qual a classificação de Manchester apropriada?`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns instantes." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes. Adicione fundos ao workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Erro ao processar classificação" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const classification = data.choices[0].message.content.trim().toLowerCase();
    
    // Validate classification
    const validClassifications = ["red", "orange", "yellow", "green", "blue"];
    const finalClassification = validClassifications.includes(classification) 
      ? classification 
      : "yellow"; // Default to yellow if invalid

    console.log("Classification result:", finalClassification);

    return new Response(
      JSON.stringify({ classification: finalClassification }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in classify-triage function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function calculateAge(birthDate: string): number {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}
