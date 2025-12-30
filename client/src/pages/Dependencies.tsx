import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/lib/trpc";
import { Plus, ExternalLink, Book } from "lucide-react";

const categoryConfig = {
  library: { label: "Biblioteca", color: "bg-blue-100 text-blue-800" },
  framework: { label: "Framework", color: "bg-purple-100 text-purple-800" },
  tool: { label: "Ferramenta", color: "bg-green-100 text-green-800" },
  service: { label: "Serviço", color: "bg-orange-100 text-orange-800" },
  platform: { label: "Plataforma", color: "bg-pink-100 text-pink-800" },
};

export default function Dependencies() {
  const { data: dependencies, isLoading } = trpc.dependencies.list.useQuery();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dependências</h1>
            <p className="text-muted-foreground mt-2">
              Catálogo de tecnologias e ferramentas utilizadas
            </p>
          </div>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Dependência
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
        ) : dependencies && dependencies.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {dependencies.map((dependency) => (
              <Card key={dependency.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{dependency.name}</CardTitle>
                    <Badge className={categoryConfig[dependency.category].color}>
                      {categoryConfig[dependency.category].label}
                    </Badge>
                  </div>
                  {dependency.version && (
                    <p className="text-sm text-muted-foreground">
                      Versão: <span className="font-mono">{dependency.version}</span>
                    </p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  {dependency.description && (
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {dependency.description}
                    </p>
                  )}
                  
                  {(dependency.documentationUrl || dependency.installationGuide) && (
                    <div className="space-y-2 pt-2 border-t">
                      {dependency.documentationUrl && (
                        <a
                          href={dependency.documentationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-primary hover:underline"
                        >
                          <Book className="h-4 w-4" />
                          Documentação
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                      {dependency.installationGuide && (
                        <details className="text-sm">
                          <summary className="cursor-pointer text-muted-foreground hover:text-foreground">
                            Ver guia de instalação
                          </summary>
                          <div className="mt-2 p-3 bg-muted rounded-lg">
                            <pre className="text-xs whitespace-pre-wrap font-mono">
                              {dependency.installationGuide}
                            </pre>
                          </div>
                        </details>
                      )}
                    </div>
                  )}
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
              <h3 className="text-lg font-semibold mb-2">Nenhuma dependência cadastrada</h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Adicione as tecnologias, bibliotecas e ferramentas que sua equipe utiliza para facilitar a gestão de projetos.
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeira Dependência
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
