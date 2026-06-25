-- Migração: MiniURL → TodoApp
-- Execute este SQL no banco ANTES de rodar `prisma migrate deploy`
-- ATENÇÃO: Remove dados de short_links e click_tracking permanentemente

-- 1. Remover tabelas do domínio antigo (ordem importa por FK)
DROP TABLE IF EXISTS click_tracking;
DROP TABLE IF EXISTS short_links;

-- 2. Adaptar tabela de planos (renomear coluna max_links → max_tasks, remover max_clicks)
ALTER TABLE plans
  RENAME COLUMN max_links TO max_tasks;

ALTER TABLE plans
  DROP COLUMN IF EXISTS max_clicks;

-- 3. Criar tabela de tarefas
CREATE TABLE tasks (
  id            TEXT        NOT NULL PRIMARY KEY,
  user_id       TEXT        NOT NULL REFERENCES users(id),
  title         TEXT        NOT NULL,
  description   TEXT,
  status        TEXT        NOT NULL DEFAULT 'pending',
  created_at    TIMESTAMP   NOT NULL DEFAULT NOW(),
  completed_at  TIMESTAMP
);

-- 4. Índice de performance para listagem por usuário
CREATE INDEX IF NOT EXISTS tasks_user_id_idx ON tasks(user_id);
