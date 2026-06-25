"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    // Validação no cliente — antes de ir ao servidor
    if (password.length < 8) {
      setError("A senha deve ter pelo menos 8 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    const { data, error } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("Erro ao criar conta. Verifique os dados e tente novamente.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="flex flex-col gap-6">
      <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center mb-10">
            <h1 className="text-2xl font-bold">Crie sua conta</h1>
            <p className="text-sm text-balance text-muted-foreground">
              Preencha o formulário abaixo para criar sua conta
            </p>
          </div>

          {error && (
            <p className="text-sm text-red-500 text-center mb-2">{error}</p>
          )}

          <Field>
            <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">E-mail</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Senha</FieldLabel>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FieldDescription>
              Deve ter pelo menos 8 caracteres.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="confirm-password">Confirmar Senha</FieldLabel>
            <Input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </Field>
          <Field className="mt-10">
            <Button type="submit" disabled={loading}>
              {loading ? "Criando conta..." : "Criar Conta"}
            </Button>
          </Field>
          <Field>
            <FieldDescription className="px-6 text-center">
              Já tem uma conta? <Link href="/login">Login</Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}
