import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-black px-4">
			<div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8">
				<h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-2">
					Home
				</h1>
				<p className="text-center text-gray-600 dark:text-gray-400 mb-6">
					Bem-vindo ao gerenciador de tarefas!
				</p>
				<h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
					Suas Tarefas
				</h2>
				<div className="flex flex-col gap-3">
					<Button className="w-full bg-green-500 hover:bg-green-600 transition text-white py-2 rounded-lg">
						Adicionar Tarefa
					</Button>
					<Button className="w-full bg-blue-500 hover:bg-blue-600 transition text-white py-2 rounded-lg">
						Editar Tarefa
					</Button>
					<Button className="w-full bg-red-500 hover:bg-red-600 transition text-white py-2 rounded-lg">
						Remover Tarefa
					</Button>
				</div>
			</div>
		</div>
	);
}
