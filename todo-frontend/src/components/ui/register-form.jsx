import Link from "next/link";
import { Button } from "./button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "./field";
import { Input } from "./input";

export default function RegisterForm() {
  return (
    <div className="flex flex-col gap-6">
      <form className="flex flex-col gap-6">
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center mb-10">
            <h1 className="text-2xl font-bold">Crie sua conta</h1>
            <p className="text-sm text-balance text-muted-foreground">
              Preencha o formulário abaixo para criar sua conta
            </p>
          </div>
          <Field>
            <FieldLabel htmlFor="name">Nome Completo</FieldLabel>
            <Input id="name" type="text" placeholder="John Doe" required />
          </Field>
          <Field>
            <FieldLabel htmlFor="email">E-mail</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
            />
            <FieldDescription>
              Usaremos este e-mail para entrar em contato com você. Não vamos
              compartilhar seu e-mail com ninguém.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="password">Senha</FieldLabel>
            <Input id="password" type="password" required />
            <FieldDescription>
              Deve ter pelo menos 8 caracteres.
            </FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="confirm-password">Confirmar Senha</FieldLabel>
            <Input id="confirm-password" type="password" required />
            <FieldDescription>Por favor, confirme sua senha.</FieldDescription>
          </Field>
          <Field className="mt-10">
            <Button type="submit">Criar Conta</Button>
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
