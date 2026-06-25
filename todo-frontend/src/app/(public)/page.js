import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <section className="flex flex-col justify-center items-center h-[calc(100vh-5rem)] max-h-screen">
      <div className="pb-8 max-w-2xl text-center">
        <h1 className="text-5xl font-extrabold mb-1.5 text-center">
          Organize. Foque. Conquiste.
        </h1>
        <h2 className="text-3xl font-semibold mb-10 text-center">
          O gerenciador de tarefas mais simples da internet
        </h2>
        <p className="text-xl text-center mb-16">
          Transformamos sua lista de afazeres em um sistema de produtividade
          poderoso. Crie tarefas, acompanhe o progresso e celebre cada
          conclusão. Milhares de pessoas já descobriram como organizar melhor o
          seu dia.
        </p>
        <div className="flex gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/register">Começar gratuitamente</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/login">Já tenho conta</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
