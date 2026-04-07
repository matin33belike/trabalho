import Image from "next/image";

export default function Home() {
  return (
    <><header className="flex items-center justify-between p-4 bg-zinc-100 dark:bg-gray-800">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
        gerenciador de tarefas
      </h1>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              Sobre
            </a>
          </li>
          <li>
            <a href="#" className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200">
              Contato
            </a>
          </li>
        </ul>
      </nav>
    </header><div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <h1>
          Cadastro
        </h1>
        <h2>E-mail</h2>
        <input type="email" className="border border-zinc-300 p-2" />
        <h2>Senha</h2>
        <input type="password" className="border border-zinc-300 p-2" />
        <button className="bg-blue-500 text-white px-4 py-2 mt-4 rounded">
          Cadastrar
        </button>
      </div></>
  );
}
