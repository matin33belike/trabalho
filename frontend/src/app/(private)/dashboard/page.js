"use client";

import { useState, useEffect, useCallback } from "react";
import {
  CheckSquare, List, Tag, Plus, Trash2, Edit2, X, Check,
  LogOut, Menu, ChevronRight, AlertCircle, Clock, Flag,
  LayoutDashboard, Loader2, CheckCircle2, Circle
} from "lucide-react";

const API = "http://localhost:5501";

async function api(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(await res.text());
  if (res.status === 204) return null;
  return res.json();
}

const PRIORITY_LABELS = { 1: "Baixa", 2: "Média", 3: "Alta" };
const PRIORITY_COLORS = {
  1: "text-emerald-400 bg-emerald-400/10",
  2: "text-amber-400 bg-amber-400/10",
  3: "text-rose-400 bg-rose-400/10",
};

function Badge({ priority }) {
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${PRIORITY_COLORS[priority] || PRIORITY_COLORS[1]}`}>
      {PRIORITY_LABELS[priority] || "Baixa"}
    </span>
  );
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <button onClick={onClose} className="text-zinc-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{label}</label>}
      <input
        className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent placeholder:text-zinc-500 transition"
        {...props}
      />
    </div>
  );
}

function Select({ label, children, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">{label}</label>}
      <select
        className="bg-zinc-800 border border-zinc-700 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition"
        {...props}
      >
        {children}
      </select>
    </div>
  );
}

function Btn({ variant = "primary", className = "", ...props }) {
  const base = "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/30",
    ghost: "bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700",
    danger: "bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30",
    success: "bg-emerald-600 hover:bg-emerald-500 text-white",
  };
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 flex items-center gap-4 hover:border-zinc-700 transition-colors">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-zinc-500 font-medium">{label}</p>
      </div>
    </div>
  );
}

// ──── MODALS ──────────────────────────────────────────

function TaskModal({ lists, categories, task, listId, onClose, onSave }) {
  const [form, setForm] = useState({
    title: task?.title || "",
    description: task?.description || "",
    dueDate: task?.dueDate ? task.dueDate.slice(0, 10) : "",
    priority: task?.priority || 1,
    categoryId: task?.categoryId || "",
    listId: task?.listId || listId || lists[0]?.id || "",
  });
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function submit() {
    if (!form.title.trim()) return;
    setLoading(true);
    try {
      const body = {
        title: form.title,
        description: form.description || undefined,
        dueDate: form.dueDate || undefined,
        priority: Number(form.priority),
        categoryId: form.categoryId || undefined,
        listId: form.listId,
      };
      if (task) {
        await api(`/api/tasks/${task.id}`, { method: "PUT", body: JSON.stringify(body) });
      } else {
        await api("/api/tasks", { method: "POST", body: JSON.stringify(body) });
      }
      onSave();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title={task ? "Editar Tarefa" : "Nova Tarefa"} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <Input label="Título" value={form.title} onChange={e => set("title", e.target.value)} placeholder="Ex: Revisar relatório..." autoFocus />
        <Input label="Descrição" value={form.description} onChange={e => set("description", e.target.value)} placeholder="Detalhes opcionais..." />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Vencimento" type="date" value={form.dueDate} onChange={e => set("dueDate", e.target.value)} />
          <Select label="Prioridade" value={form.priority} onChange={e => set("priority", e.target.value)}>
            <option value={1}>Baixa</option>
            <option value={2}>Média</option>
            <option value={3}>Alta</option>
          </Select>
        </div>
        <Select label="Lista" value={form.listId} onChange={e => set("listId", e.target.value)}>
          {lists.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
        </Select>
        <Select label="Categoria" value={form.categoryId} onChange={e => set("categoryId", e.target.value)}>
          <option value="">Sem categoria</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </Select>
        <div className="flex gap-2 pt-2">
          <Btn variant="ghost" onClick={onClose} className="flex-1">Cancelar</Btn>
          <Btn onClick={submit} disabled={loading || !form.title.trim()} className="flex-1">
            {loading && <Loader2 size={14} className="animate-spin" />}
            {task ? "Salvar" : "Criar Tarefa"}
          </Btn>
        </div>
      </div>
    </Modal>
  );
}

function ListModal({ list, onClose, onSave }) {
  const [name, setName] = useState(list?.name || "");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!name.trim()) return;
    setLoading(true);
    try {
      if (list) {
        await api(`/api/lists/${list.id}`, { method: "PUT", body: JSON.stringify({ name }) });
      } else {
        await api("/api/lists", { method: "POST", body: JSON.stringify({ name }) });
      }
      onSave();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title={list ? "Renomear Lista" : "Nova Lista"} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <Input label="Nome da lista" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Trabalho, Pessoal..." autoFocus />
        <div className="flex gap-2">
          <Btn variant="ghost" onClick={onClose} className="flex-1">Cancelar</Btn>
          <Btn onClick={submit} disabled={loading || !name.trim()} className="flex-1">
            {loading && <Loader2 size={14} className="animate-spin" />}
            {list ? "Salvar" : "Criar"}
          </Btn>
        </div>
      </div>
    </Modal>
  );
}

function CategoryModal({ category, onClose, onSave }) {
  const [name, setName] = useState(category?.name || "");
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!name.trim()) return;
    setLoading(true);
    try {
      if (category) {
        await api(`/api/categories/${category.id}`, { method: "PUT", body: JSON.stringify({ name }) });
      } else {
        await api("/api/categories", { method: "POST", body: JSON.stringify({ name }) });
      }
      onSave();
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal title={category ? "Editar Categoria" : "Nova Categoria"} onClose={onClose}>
      <div className="flex flex-col gap-4">
        <Input label="Nome" value={name} onChange={e => setName(e.target.value)} placeholder="Ex: Urgente, Design..." autoFocus />
        <div className="flex gap-2">
          <Btn variant="ghost" onClick={onClose} className="flex-1">Cancelar</Btn>
          <Btn onClick={submit} disabled={loading || !name.trim()} className="flex-1">
            {loading && <Loader2 size={14} className="animate-spin" />}
            {category ? "Salvar" : "Criar"}
          </Btn>
        </div>
      </div>
    </Modal>
  );
}

// ──── VIEWS ──────────────────────────────────────────

function OverviewView({ lists, categories, onNewTask }) {
  const allTasks = lists.flatMap(l => (l.tasks || []).map(t => ({ ...t, listName: l.name })));
  const total = allTasks.length;
  const done = allTasks.filter(t => t.completed).length;
  const pending = total - done;
  const overdue = allTasks.filter(t => !t.completed && t.dueDate && new Date(t.dueDate) < new Date()).length;
  const high = allTasks.filter(t => !t.completed && t.priority === 3).length;

  const recent = [...allTasks].filter(t => !t.completed).sort((a, b) => {
    if (a.dueDate && b.dueDate) return new Date(a.dueDate) - new Date(b.dueDate);
    if (a.dueDate) return -1;
    if (b.dueDate) return 1;
    return b.priority - a.priority;
  }).slice(0, 5);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Visão Geral</h1>
        <p className="text-zinc-500 text-sm mt-0.5">Resumo das suas tarefas e listas</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CheckSquare} label="Total de tarefas" value={total} color="bg-violet-500/10 text-violet-400" />
        <StatCard icon={CheckCircle2} label="Concluídas" value={done} color="bg-emerald-500/10 text-emerald-400" />
        <StatCard icon={Clock} label="Pendentes" value={pending} color="bg-amber-500/10 text-amber-400" />
        <StatCard icon={AlertCircle} label="Atrasadas" value={overdue} color="bg-rose-500/10 text-rose-400" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-white">Próximas tarefas</h2>
            <Btn variant="primary" onClick={onNewTask} className="py-1.5 text-xs">
              <Plus size={13} /> Nova tarefa
            </Btn>
          </div>
          {recent.length === 0 ? (
            <div className="text-center py-10 text-zinc-600">
              <CheckCircle2 size={32} className="mx-auto mb-2 opacity-40" />
              <p className="text-sm">Nenhuma tarefa pendente!</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {recent.map(t => (
                <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-zinc-800/50 hover:bg-zinc-800 transition-colors">
                  <Circle size={16} className="text-zinc-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">{t.title}</p>
                    <p className="text-xs text-zinc-500">{t.listName}{t.dueDate ? ` · ${new Date(t.dueDate).toLocaleDateString("pt-BR")}` : ""}</p>
                  </div>
                  <Badge priority={t.priority} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <h2 className="font-bold text-white mb-3">Listas</h2>
            <div className="flex flex-col gap-2">
              {lists.map(l => (
                <div key={l.id} className="flex justify-between items-center text-sm">
                  <span className="text-zinc-300 truncate flex-1">{l.name}</span>
                  <span className="text-zinc-500 text-xs ml-2">{l.tasks?.length || 0} tarefas</span>
                </div>
              ))}
              {lists.length === 0 && <p className="text-zinc-600 text-sm">Nenhuma lista ainda.</p>}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <h2 className="font-bold text-white mb-3">Categorias</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <span key={c.id} className="text-xs bg-violet-500/10 text-violet-300 border border-violet-500/20 px-2 py-1 rounded-full">{c.name}</span>
              ))}
              {categories.length === 0 && <p className="text-zinc-600 text-sm">Nenhuma categoria ainda.</p>}
            </div>
          </div>

          {high > 0 && (
            <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Flag size={14} className="text-rose-400" />
                <span className="text-rose-400 font-semibold text-sm">Alta prioridade</span>
              </div>
              <p className="text-zinc-400 text-xs">{high} tarefa{high !== 1 ? "s" : ""} aguardando atenção</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TasksView({ lists, categories, onRefresh }) {
  const [selectedList, setSelectedList] = useState(null);
  const [taskModal, setTaskModal] = useState(null); // null | "new" | task object
  const [filter, setFilter] = useState("all"); // all | pending | done

  const currentList = selectedList ? lists.find(l => l.id === selectedList) : null;
  const rawTasks = currentList
    ? (currentList.tasks || [])
    : lists.flatMap(l => (l.tasks || []).map(t => ({ ...t, listName: l.name })));

  const tasks = rawTasks.filter(t =>
    filter === "all" ? true : filter === "done" ? t.completed : !t.completed
  );

  async function toggleDone(task) {
    await api(`/api/tasks/${task.id}`, {
      method: "PUT",
      body: JSON.stringify({ completed: !task.completed, listId: task.listId }),
    });
    onRefresh();
  }

  async function deleteTask(task) {
    if (!confirm(`Remover "${task.title}"?`)) return;
    await api(`/api/tasks/${task.id}`, { method: "DELETE" });
    onRefresh();
  }

  const categoryMap = Object.fromEntries(categories.map(c => [c.id, c.name]));

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Tarefas</h1>
          <p className="text-zinc-500 text-sm">{tasks.length} tarefa{tasks.length !== 1 ? "s" : ""}</p>
        </div>
        <div className="sm:ml-auto flex items-center gap-2 flex-wrap">
          <div className="flex bg-zinc-800 rounded-lg p-0.5 border border-zinc-700">
            {["all", "pending", "done"].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${filter === f ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white"}`}
              >
                {f === "all" ? "Todas" : f === "pending" ? "Pendentes" : "Concluídas"}
              </button>
            ))}
          </div>
          <select
            className="bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
            value={selectedList || ""}
            onChange={e => setSelectedList(e.target.value || null)}
          >
            <option value="">Todas as listas</option>
            {lists.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
          </select>
          <Btn onClick={() => setTaskModal("new")} className="text-xs py-2">
            <Plus size={13} /> Nova tarefa
          </Btn>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
          <CheckSquare size={40} className="mb-3 opacity-30" />
          <p className="font-medium">Nenhuma tarefa encontrada</p>
          <p className="text-sm mt-1">Crie uma nova para começar</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {tasks.map(task => (
            <div
              key={task.id}
              className={`group flex items-start gap-3 p-4 rounded-xl border transition-all ${task.completed ? "bg-zinc-900/50 border-zinc-800/50 opacity-60" : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"}`}
            >
              <button onClick={() => toggleDone(task)} className="mt-0.5 flex-shrink-0">
                {task.completed
                  ? <CheckCircle2 size={18} className="text-emerald-400" />
                  : <Circle size={18} className="text-zinc-600 hover:text-violet-400 transition-colors" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`font-medium text-sm ${task.completed ? "line-through text-zinc-500" : "text-white"}`}>{task.title}</p>
                {task.description && <p className="text-xs text-zinc-500 mt-0.5 truncate">{task.description}</p>}
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  {task.listName && <span className="text-xs text-zinc-600">{task.listName}</span>}
                  {task.dueDate && (
                    <span className={`text-xs flex items-center gap-1 ${new Date(task.dueDate) < new Date() && !task.completed ? "text-rose-400" : "text-zinc-500"}`}>
                      <Clock size={11} />
                      {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                    </span>
                  )}
                  {task.categoryId && categoryMap[task.categoryId] && (
                    <span className="text-xs bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                      {categoryMap[task.categoryId]}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex-shrink-0">
                <Badge priority={task.priority} />
                <button onClick={() => setTaskModal(task)} className="p-1.5 rounded-lg hover:bg-zinc-700 text-zinc-500 hover:text-white transition-colors">
                  <Edit2 size={13} />
                </button>
                <button onClick={() => deleteTask(task)} className="p-1.5 rounded-lg hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {taskModal && (
        <TaskModal
          lists={lists}
          categories={categories}
          task={taskModal === "new" ? null : taskModal}
          listId={selectedList}
          onClose={() => setTaskModal(null)}
          onSave={() => { setTaskModal(null); onRefresh(); }}
        />
      )}
    </div>
  );
}

function ListsView({ lists, onRefresh }) {
  const [modal, setModal] = useState(null); // null | "new" | list obj

  async function deleteList(list) {
    if (!confirm(`Remover lista "${list.name}" e todas as suas tarefas?`)) return;
    await api(`/api/lists/${list.id}`, { method: "DELETE" });
    onRefresh();
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Listas</h1>
          <p className="text-zinc-500 text-sm">{lists.length} lista{lists.length !== 1 ? "s" : ""}</p>
        </div>
        <Btn onClick={() => setModal("new")}><Plus size={14} /> Nova lista</Btn>
      </div>

      {lists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
          <List size={40} className="mb-3 opacity-30" />
          <p className="font-medium">Nenhuma lista ainda</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {lists.map(l => {
            const done = (l.tasks || []).filter(t => t.completed).length;
            const total = (l.tasks || []).length;
            const pct = total ? Math.round((done / total) * 100) : 0;
            return (
              <div key={l.id} className="group bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-2xl p-5 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
                    <List size={16} className="text-violet-400" />
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => setModal(l)} className="p-1.5 rounded-lg hover:bg-zinc-700 text-zinc-500 hover:text-white transition-colors">
                      <Edit2 size={13} />
                    </button>
                    <button onClick={() => deleteList(l)} className="p-1.5 rounded-lg hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 transition-colors">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <h3 className="font-bold text-white mb-1">{l.name}</h3>
                <p className="text-xs text-zinc-500 mb-3">{total} tarefa{total !== 1 ? "s" : ""} · {done} concluída{done !== 1 ? "s" : ""}</p>
                <div className="w-full bg-zinc-800 rounded-full h-1.5">
                  <div
                    className="bg-violet-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-zinc-600 mt-1.5 text-right">{pct}%</p>
              </div>
            );
          })}
        </div>
      )}

      {modal && (
        <ListModal
          list={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); onRefresh(); }}
        />
      )}
    </div>
  );
}

function CategoriesView({ categories, onRefresh }) {
  const [modal, setModal] = useState(null);

  async function deleteCategory(cat) {
    if (!confirm(`Remover categoria "${cat.name}"?`)) return;
    await api(`/api/categories/${cat.id}`, { method: "DELETE" });
    onRefresh();
  }

  const colors = [
    "bg-violet-500/10 text-violet-400 border-violet-500/20",
    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "bg-amber-500/10 text-amber-400 border-amber-500/20",
    "bg-rose-500/10 text-rose-400 border-rose-500/20",
    "bg-sky-500/10 text-sky-400 border-sky-500/20",
    "bg-pink-500/10 text-pink-400 border-pink-500/20",
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Categorias</h1>
          <p className="text-zinc-500 text-sm">{categories.length} categoria{categories.length !== 1 ? "s" : ""}</p>
        </div>
        <Btn onClick={() => setModal("new")}><Plus size={14} /> Nova categoria</Btn>
      </div>

      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-zinc-600">
          <Tag size={40} className="mb-3 opacity-30" />
          <p className="font-medium">Nenhuma categoria ainda</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <div key={cat.id} className={`group flex items-center justify-between p-4 rounded-2xl border bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-all`}>
              <div className="flex items-center gap-3">
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center border text-sm font-bold ${colors[i % colors.length]}`}>
                  {cat.name[0]?.toUpperCase()}
                </span>
                <span className="text-white font-medium">{cat.name}</span>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setModal(cat)} className="p-1.5 rounded-lg hover:bg-zinc-700 text-zinc-500 hover:text-white transition-colors">
                  <Edit2 size={13} />
                </button>
                <button onClick={() => deleteCategory(cat)} className="p-1.5 rounded-lg hover:bg-rose-500/20 text-zinc-500 hover:text-rose-400 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <CategoryModal
          category={modal === "new" ? null : modal}
          onClose={() => setModal(null)}
          onSave={() => { setModal(null); onRefresh(); }}
        />
      )}
    </div>
  );
}

// ──── MAIN ──────────────────────────────────────────

const NAV = [
  { id: "overview", label: "Visão Geral", icon: LayoutDashboard },
  { id: "tasks", label: "Tarefas", icon: CheckSquare },
  { id: "lists", label: "Listas", icon: List },
  { id: "categories", label: "Categorias", icon: Tag },
];

export default function Dashboard() {
  const [view, setView] = useState("overview");
  const [lists, setLists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [newTaskModal, setNewTaskModal] = useState(false);

  const load = useCallback(async () => {
    try {
      const [ls, cats, me] = await Promise.all([
        api("/api/lists"),
        api("/api/categories"),
        api("/api/me"),
      ]);
      setLists(ls);
      setCategories(cats);
      setUser(me?.user);
      setError(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function logout() {
    try {
      await api("/api/auth/sign-out", { method: "POST" });
    } finally {
      window.location.href = "/login";
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-zinc-500">
          <Loader2 size={32} className="animate-spin text-violet-500" />
          <p className="text-sm">Carregando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <AlertCircle size={40} className="text-rose-400 mx-auto mb-3" />
          <h2 className="text-white font-bold text-lg mb-2">Erro de conexão</h2>
          <p className="text-zinc-500 text-sm mb-4">{error}</p>
          <p className="text-zinc-600 text-xs mb-4">Verifique se o backend está rodando em localhost:5501</p>
          <Btn onClick={load}>Tentar novamente</Btn>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-zinc-950 border-r border-zinc-800 flex flex-col
        transform transition-transform duration-200 lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-5 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
              <CheckSquare size={16} className="text-white" />
            </div>
            <span className="font-bold text-white text-lg tracking-tight">TaskManager</span>
          </div>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setView(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                view === id
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-900/30"
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              }`}
            >
              <Icon size={16} />
              {label}
              {view === id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-zinc-800">
          {user && (
            <div className="flex items-center gap-2.5 px-2 py-2 mb-2">
              <div className="w-7 h-7 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-300 text-xs font-bold flex-shrink-0">
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-zinc-500 truncate">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-zinc-500 hover:bg-zinc-800 hover:text-rose-400 transition-all"
          >
            <LogOut size={14} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-14 border-b border-zinc-800 flex items-center justify-between px-4 lg:px-6 bg-zinc-950 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-zinc-400 hover:text-white transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1 lg:flex-none" />
          <Btn onClick={() => setNewTaskModal(true)} className="text-xs py-1.5 px-3">
            <Plus size={13} /> Nova tarefa
          </Btn>
        </header>

        <div className="flex-1 overflow-auto p-4 lg:p-6">
          {view === "overview" && (
            <OverviewView
              lists={lists}
              categories={categories}
              onNewTask={() => setNewTaskModal(true)}
            />
          )}
          {view === "tasks" && (
            <TasksView lists={lists} categories={categories} onRefresh={load} />
          )}
          {view === "lists" && (
            <ListsView lists={lists} onRefresh={load} />
          )}
          {view === "categories" && (
            <CategoriesView categories={categories} onRefresh={load} />
          )}
        </div>
      </main>

      {newTaskModal && lists.length > 0 && (
        <TaskModal
          lists={lists}
          categories={categories}
          task={null}
          listId={null}
          onClose={() => setNewTaskModal(false)}
          onSave={() => { setNewTaskModal(false); load(); }}
        />
      )}

      {newTaskModal && lists.length === 0 && (
        <Modal title="Crie uma lista primeiro" onClose={() => setNewTaskModal(false)}>
          <p className="text-zinc-400 text-sm mb-4">Você precisa de pelo menos uma lista antes de criar tarefas.</p>
          <Btn onClick={() => { setNewTaskModal(false); setView("lists"); }}>Ir para Listas</Btn>
        </Modal>
      )}
    </div>
  );
}
