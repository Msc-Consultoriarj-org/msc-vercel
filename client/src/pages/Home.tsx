import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Users, FolderKanban, Package, TrendingUp } from "lucide-react";

export default function Home() {
  const { data: employees, isLoading: loadingEmployees } = trpc.employees.list.useQuery();
  const { data: projects, isLoading: loadingProjects } = trpc.projects.list.useQuery();
  const { data: dependencies, isLoading: loadingDeps } = trpc.dependencies.list.useQuery();

  const activeEmployees = employees?.filter(e => e.status === "active").length || 0;
  const activeProjects = projects?.filter(p => p.status === "active").length || 0;
  const totalDependencies = dependencies?.length || 0;

  const stats = [
    {
      title: "Funcionários Ativos",
      value: loadingEmployees ? "..." : activeEmployees,
      icon: Users,
      description: "Total de funcionários ativos",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Projetos Ativos",
      value: loadingProjects ? "..." : activeProjects,
      icon: FolderKanban,
      description: "Projetos em andamento",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Dependências",
      value: loadingDeps ? "..." : totalDependencies,
      icon: Package,
      description: "Tecnologias cadastradas",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Taxa de Conclusão",
      value: loadingProjects ? "..." : projects?.filter(p => p.status === "completed").length || 0,
      icon: TrendingUp,
      description: "Projetos concluídos",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Visão geral da MSC Consultoria
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Projetos Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingProjects ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : projects && projects.length > 0 ? (
                <div className="space-y-3">
                  {projects.slice(0, 5).map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{project.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {project.description || "Sem descrição"}
                        </p>
                      </div>
                      <div className="ml-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            project.status === "active"
                              ? "bg-green-100 text-green-800"
                              : project.status === "completed"
                              ? "bg-blue-100 text-blue-800"
                              : project.status === "paused"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {project.status === "active" && "Ativo"}
                          {project.status === "completed" && "Concluído"}
                          {project.status === "paused" && "Pausado"}
                          {project.status === "planning" && "Planejamento"}
                          {project.status === "archived" && "Arquivado"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <FolderKanban className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum projeto cadastrado ainda</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Equipe</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingEmployees ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-16 bg-muted animate-pulse rounded" />
                  ))}
                </div>
              ) : employees && employees.length > 0 ? (
                <div className="space-y-3">
                  {employees.slice(0, 5).map((employee) => (
                    <div
                      key={employee.id}
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                        {employee.fullName.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{employee.fullName}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {employee.position || "Sem cargo definido"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Nenhum funcionário cadastrado ainda</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
