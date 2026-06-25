"use client";

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import CardPlan from "@/components/card-plan";

const API = "http://localhost:5500/api/plans";

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="flex flex-col gap-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold">Planos</h1>
        <p className="text-muted-foreground mt-2">
          Escolha o plano ideal para você.
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      ) : plans.length === 0 ? (
        <p className="text-center text-muted-foreground text-sm">
          Nenhum plano cadastrado ainda.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <CardPlan key={plan.id} plan={plan} />
          ))}
        </div>
      )}
    </div>
  );
}
