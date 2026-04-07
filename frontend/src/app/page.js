import { Button } from "@/components/ui/button";
export default function Cadastrar() {
	return (
		<>
			<header className="flex items-center justify-between px-6 py-4 bg-zinc-100 dark:bg-gray-800 shadow">
				<h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
					Gerenciador de Tarefas
				</h1>
				<nav>
					<ul className="flex space-x-6">
						<li>
							<a
								href="#"
								className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition"
							>
								Home
							</a>
						</li>
						<li>
							<a
								href="#"
								className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition"
							>
								Sobre
							</a>
						</li>
						<li>
							<a
								href="#"
								className="text-gray-600 dark:text-gray-400 hover:text-blue-500 transition"
							>
								Contato
							</a>
						</li>
					</ul>
				</nav>
			</header>
			<div className="flex items-center justify-center min-h-screen bg-zinc-50 dark:bg-black px-4">
				<div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-lg p-8">
					<h1 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-200 mb-6">
						Cadastro
					</h1>
					<div className="flex flex-col gap-4">
						<div>
							<label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
								E-mail
							</label>
							<input
								type="email"
								className="w-full border border-zinc-300 dark:border-zinc-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
							/>
						</div>

						<div>
							<label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
								Senha
							</label>
							<input
								type="password"
								className="w-full border border-zinc-300 dark:border-zinc-700 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent"
							/>
						</div>

						<Button className="w-full bg-blue-500 hover:bg-blue-600 transition text-white py-2 rounded-lg mt-2">
							Cadastrar
						</Button>
					</div>
					<p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
						Já tem uma conta?{" "}
						<a
							href="/login"
							className="text-blue-500 hover:underline"
						>
							Faça login
						</a>
					</p>
				</div>
			</div>
		</>
	);
}
