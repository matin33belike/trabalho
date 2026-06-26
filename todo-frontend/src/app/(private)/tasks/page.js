"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  CheckCircle2,
  Circle,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const API = "http://localhost:5500/api/tasks";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); 
 
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", description: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, [filter]);

  async function fetchTasks() {
    setLoading(true);
    try {
      const url =
        filter === "all" ? API : `${API}?status=${filter}`;
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error("Erro ao buscar tarefas:", err);
    } finally {
      setLoading(false);
    }
  }

  function openCreate() {
    setEditing(null);
    setForm({ title: "", description: "" });
    setError("");
    setSheetOpen(true);
  }

  function openEdit(task) {
    setEditing(task);
    setForm({ title: task.title, description: task.description ?? "" });
    setError("");
    setSheetOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const body = {
      title: form.title,
      description: form.description || null,
    };

    const res = await fetch(editing ? `${API}/${editing.id}` : API, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(body),
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error ?? "Erro ao salvar tarefa.");
      return;
    }

    setSheetOpen(false);
    fetchTasks();
  }

  async function handleToggleStatus(task) {
    const newStatus = task.status === "completed" ? "pending" : "completed";
    await fetch(`${API}/${task.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: newStatus }),
    });
    fetchTasks();
  }

  async function handleDelete(id) {
    await fetch(`${API}/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    setConfirmDelete(null);
    fetchTasks();
  }

  const filterButtons = [
    { label: "Todas", value: "all" },
    { label: "Pendentes", value: "pending" },
    { label: "Concluídas", value: "completed" },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tarefas</h1>
        <Button onClick={openCreate}>
          <Plus className="size-4 mr-2" />
          Nova Tarefa
        </Button>
      </div>

      <div className="flex gap-2">
        {filterButtons.map((btn) => (
          <Button
            key={btn.value}
            size="sm"
            variant={filter === btn.value ? "default" : "outline"}
            onClick={() => setFilter(btn.value)}
          >
            {btn.label}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground gap-2">
          <p className="text-sm">Nenhuma tarefa encontrada.</p>
          <Button variant="outline" size="sm" onClick={openCreate}>
            Criar primeira tarefa
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-start gap-3 rounded-xl border p-4 transition-colors hover:bg-muted/40"
            > 
              <button
                className="mt-0.5 shrink-0 text-muted-foreground hover:text-primary transition-colors"
                onClick={() => handleToggleStatus(task)}
                title={
                  task.status === "completed"
                    ? "Reabrir tarefa"
                    : "Marcar como concluída"
                }
              >
                {task.status === "completed" ? (
                  <CheckCircle2 className="size-5 text-green-500" />
                ) : (
                  <Circle className="size-5" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "font-medium truncate",
                    task.status === "completed" &&
                      "line-through text-muted-foreground",
                  )}
                >
                  {task.title}
                </p>
                {task.description && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {task.description}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  {task.status === "completed" && task.completedAt
                    ? `Concluída em ${new Date(task.completedAt).toLocaleDateString("pt-BR")}`
                    : `Criada em ${new Date(task.createdAt).toLocaleDateString("pt-BR")}`}
                </p>
              </div>

              <div className="flex gap-1 shrink-0">
                {confirmDelete === task.id ? (
                  <>
                    <span className="text-xs text-destructive self-center mr-1">
                      Excluir?
                    </span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(task.id)}
                    >
                      Sim
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setConfirmDelete(null)}
                    >
                      Não
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8"
                      onClick={() => openEdit(task)}
                      title="Editar"
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8 text-destructive hover:text-destructive"
                      onClick={() => setConfirmDelete(task.id)}
                      title="Excluir"
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{editing ? "Editar Tarefa" : "Nova Tarefa"}</SheetTitle>
            <SheetDescription>
              {editing
                ? "Altere os dados da tarefa."
                : "Preencha os dados para criar uma nova tarefa."}
            </SheetDescription>
          </SheetHeader>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 mt-6 px-4"
          >
            <FieldGroup>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Field>
                <FieldLabel htmlFor="task-title">Título</FieldLabel>
                <Input
                  id="task-title"
                  placeholder="Ex: Estudar para a prova"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="task-description">
                  Descrição{" "}
                  <span className="text-muted-foreground font-normal">
                    (opcional)
                  </span>
                </FieldLabel>
                <Input
                  id="task-description"
                  placeholder="Detalhes da tarefa..."
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </Field>
              <Field className="mt-4">
                <Button type="submit" disabled={saving}>
                  {saving
                    ? "Salvando..."
                    : editing
                      ? "Salvar Alterações"
                      : "Criar Tarefa"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
