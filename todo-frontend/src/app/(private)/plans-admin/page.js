"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import CardPlanAdmin from "@/components/card-plan-admin";
import PlanForm from "@/components/plan-form";

const API = "http://localhost:5500/api/plans";

export default function PlansAdmin() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", maxTasks: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchPlans();
  }, []);

  async function fetchPlans() {
    setLoading(true);
    const res = await fetch(API);
    const data = await res.json();
    setPlans(data);
    setLoading(false);
  }

  function openCreate() {
    setEditing(null);
    setForm({ name: "", price: "", maxTasks: "" });
    setError("");
    setSheetOpen(true);
  }

  function openEdit(plan) {
    setEditing(plan);
    setForm({
      name: plan.name,
      price: String(plan.price),
      maxTasks: String(plan.maxTasks),
    });
    setError("");
    setSheetOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const body = {
      name: form.name,
      price: Number(form.price),
      maxTasks: Number(form.maxTasks),
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
      setError(data.error ?? "Erro ao salvar plano.");
      return;
    }

    setSheetOpen(false);
    fetchPlans();
  }

  async function handleDelete(id) {
    await fetch(`${API}/${id}`, { method: "DELETE", credentials: "include" });
    setConfirmDelete(null);
    fetchPlans();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Planos</h1>
        <Button onClick={openCreate}>
          <Plus className="size-4 mr-2" />
          Novo Plano
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          Nenhum plano cadastrado ainda.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <CardPlanAdmin
              key={plan.id}
              plan={plan}
              confirmDelete={confirmDelete}
              onEdit={openEdit}
              onDelete={handleDelete}
              onRequestDelete={setConfirmDelete}
              onCancelDelete={() => setConfirmDelete(null)}
            />
          ))}
        </div>
      )}

      <PlanForm
        editing={editing}
        sheetOpen={sheetOpen}
        setSheetOpen={setSheetOpen}
        form={form}
        setForm={setForm}
        handleSubmit={handleSubmit}
        saving={saving}
        error={error}
      />
    </div>
  );
}
