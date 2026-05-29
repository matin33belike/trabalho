import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-black px-4">
			<div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8">
				<h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-2">
					Home
				</h1>
				<h2 className="text-center text-gray-600 dark:text-gray-400 mb-6">
					Bem-vindo ao gerenciador de tarefas!
				</h2>
				<div className="mt-6 text-center">
					<Link href="/cadastro" className="px-6 text-center text-sm text-gray-600 dark:text-gray-400 hover:underline">
						Ir para página de cadastro
					</Link>
				</div>
			</div>
		</div>
	);
}