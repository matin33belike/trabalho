import { Button } from "./ui/button";
import { Field, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";

export default function PlanForm({
  editing,
  sheetOpen,
  setSheetOpen,
  form,
  setForm,
  error,
  saving,
  handleSubmit,
}) {
  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{editing ? "Editar Plano" : "Novo Plano"}</SheetTitle>
          <SheetDescription>
            {editing
              ? "Altere os dados do plano."
              : "Preencha os dados para criar um novo plano."}
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6 px-4">
          <FieldGroup>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <Field>
              <FieldLabel htmlFor="plan-name">Nome do Plano</FieldLabel>
              <Input
                id="plan-name"
                placeholder="Ex: Pro"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="plan-price">Preço (R$)</FieldLabel>
              <Input
                id="plan-price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="plan-maxtasks">Máximo de Tarefas</FieldLabel>
              <Input
                id="plan-maxtasks"
                type="number"
                min="1"
                placeholder="100"
                required
                value={form.maxTasks}
                onChange={(e) =>
                  setForm({ ...form, maxTasks: e.target.value })
                }
              />
            </Field>
            <Field className="mt-4">
              <Button type="submit" disabled={saving}>
                {saving
                  ? "Salvando..."
                  : editing
                    ? "Salvar Alterações"
                    : "Criar Plano"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </SheetContent>
    </Sheet>
  );
}
