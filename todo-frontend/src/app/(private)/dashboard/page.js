"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle2, Circle, ListTodo } from "lucide-react";

const API = "http://localhost:5500/api/tasks";

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch(`${API}/stats`, { credentials: "include" });
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Erro ao buscar estatísticas:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Total */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Tarefas
            </CardTitle>
            <ListTodo className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold">{stats?.total ?? 0}</p>
            )}
          </CardContent>
        </Card>

        {/* Pendentes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pendentes
            </CardTitle>
            <Circle className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold text-yellow-500">
                {stats?.pending ?? 0}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Concluídas */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Concluídas
            </CardTitle>
            <CheckCircle2 className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              <p className="text-3xl font-bold text-green-500">
                {stats?.completed ?? 0}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Barra de progresso */}
      {!loading && stats?.total > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Progresso geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className="bg-green-500 h-3 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round((stats.completed / stats.total) * 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {Math.round((stats.completed / stats.total) * 100)}% concluído
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
