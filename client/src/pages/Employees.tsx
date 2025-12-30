import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Plus, Mail, Phone, Briefcase, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Employees() {
  const { data: employees, isLoading } = trpc.employees.list.useQuery();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Funcionários</h1>
            <p className="text-muted-foreground mt-2">
              Gerencie a equipe da MSC Consultoria
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Funcionário
          </Button>
        </div>

        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-20 w-20 bg-muted animate-pulse rounded-full mx-auto" />
                    <div className="h-4 bg-muted animate-pulse rounded w-3/4 mx-auto" />
                    <div className="h-3 bg-muted animate-pulse rounded w-1/2 mx-auto" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : employees && employees.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {employees.map((employee) => (
              <Card key={employee.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center pb-4">
                  <div className="flex justify-center mb-4">
                    {employee.avatarUrl ? (
                      <img
                        src={employee.avatarUrl}
                        alt={employee.fullName}
                        className="h-20 w-20 rounded-full object-cover border-4 border-primary/10"
                      />
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl border-4 border-primary/20">
                        {employee.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-xl">{employee.fullName}</CardTitle>
                  {employee.position && (
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-2">
                      <Briefcase className="h-4 w-4" />
                      {employee.position}
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-3">
                  {employee.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate">{employee.email}</span>
                    </div>
                  )}
                  {employee.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{employee.phone}</span>
                    </div>
                  )}
                  {employee.department && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                        {employee.department}
                      </span>
                    </div>
                  )}
                  {employee.hireDate && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Desde {format(new Date(employee.hireDate), "MMM yyyy", { locale: ptBR })}
                      </span>
                    </div>
                  )}
                  <div className="pt-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        employee.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {employee.status === "active" ? "Ativo" : "Inativo"}
                    </span>
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
              <h3 className="text-lg font-semibold mb-2">Nenhum funcionário cadastrado</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Comece adicionando os membros da sua equipe para gerenciar projetos e acompanhar o trabalho.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Funcionário
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
