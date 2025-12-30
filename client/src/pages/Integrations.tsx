import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Github, MessageSquare, Zap } from "lucide-react";
import { toast } from "sonner";

const integrations = [
  {
    name: "GitHub",
    description: "Conecte seus repositórios e acompanhe atividades de desenvolvimento",
    icon: Github,
    color: "text-gray-900",
    bgColor: "bg-gray-100",
    status: "available",
  },
  {
    name: "Slack",
    description: "Integre com canais do Slack para comunicação em tempo real",
    icon: MessageSquare,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    status: "available",
  },
  {
    name: "Manus",
    description: "Sincronize tarefas e projetos com a plataforma Manus",
    icon: Zap,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    status: "available",
  },
];

export default function Integrations() {
  const handleConnect = (name: string) => {
    toast.info(`Funcionalidade em desenvolvimento: Conectar ${name}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Integrações</h1>
          <p className="text-muted-foreground mt-2">
            Conecte ferramentas externas para centralizar a comunicação
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {integrations.map((integration) => (
            <Card key={integration.name} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className={`p-3 rounded-lg ${integration.bgColor}`}>
                    <integration.icon className={`h-6 w-6 ${integration.color}`} />
                  </div>
                  <CardTitle>{integration.name}</CardTitle>
                </div>
                <CardDescription>{integration.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleConnect(integration.name)}
                >
                  Conectar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Mais integrações em breve</h3>
              <p className="text-muted-foreground max-w-md">
                Estamos trabalhando para adicionar mais integrações e facilitar ainda mais o gerenciamento da sua equipe.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
