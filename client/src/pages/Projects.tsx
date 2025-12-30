import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Plus, Calendar, GitBranch, User } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const statusConfig = {
  planning: { label: "Planejamento", color: "bg-gray-100 text-gray-800" },
  active: { label: "Ativo", color: "bg-green-100 text-green-800" },
  paused: { label: "Pausado", color: "bg-yellow-100 text-yellow-800" },
  completed: { label: "Concluído", color: "bg-blue-100 text-blue-800" },
  archived: { label: "Arquivado", color: "bg-slate-100 text-slate-800" },
};

export default function Projects() {
  const { data: projects, isLoading } = trpc.projects.list.useQuery();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Projetos</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie os projetos da MSC Consultoria
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Novo Projeto
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="h-4 bg-muted animate-pulse rounded" />
                  <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg line-clamp-2">{project.name}</CardTitle>
                    <Badge className={statusConfig[project.status].color}>
                      {statusConfig[project.status].label}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {project.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  
                  <div className="space-y-2">
                    {project.creatorName && (
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Criado por:</span>
                        <span className="font-medium">{project.creatorName}</span>
                      </div>
                    )}
                    
                    {project.startDate && (
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Início:</span>
                        <span>{format(new Date(project.startDate), "dd/MM/yyyy", { locale: ptBR })}</span>
                      </div>
                    )}
                    
                    {project.githubRepoUrl && (
                      <div className="flex items-center gap-2 text-sm">
                        <GitBranch className="h-4 w-4 text-muted-foreground" />
                        <a
                          href={project.githubRepoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate"
                        >
                          Repositório GitHub
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="pt-2 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      Ver Detalhes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Nenhum projeto cadastrado</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Crie seu primeiro projeto para começar a organizar o trabalho da equipe e acompanhar o progresso.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Projeto
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
