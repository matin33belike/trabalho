import Link from "next/link";
import { Button } from "./button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./field";
import { Input } from "./input";

export default function LoginForm() {
  return (
    <div className="flex flex-col gap-6">
      <form>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center mb-10">
            <h1 className="text-xl font-bold">Bem-vindo ao minURL</h1>
            <FieldDescription>
              Não tem uma conta? <Link href="/register">Cadastre-se</Link>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="mary.doe@email.com"
              required
            />
          </Field>
          <Field className="mb-8">
            <FieldLabel htmlFor="password">Senha</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="Digite sua senha aqui"
              required
            />
          </Field>
          <Field>
            <Button type="submit">Login</Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        Ao clicar em continuar, você concorda com nossos{" "}
        <a href="#">Termos de Serviços</a> e{" "}
        <a href="#">Política de Privacidade</a>.
      </FieldDescription>
    </div>
  );
}
