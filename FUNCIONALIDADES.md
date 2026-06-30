# FEA Angels — Funcionalidades

## Stack
- **Framework:** TanStack Start (React 19, SSR, file-based routing)
- **Banco:** Supabase (PostgreSQL + Storage)
- **Auth:** Supabase Auth (email/senha)
- **Estilo:** Tailwind CSS v4 + shadcn/ui
- **Deploy:** Nitro + Cloudflare Pages

---

## 1. Autenticação

| Rota | Descrição |
|---|---|
| `/login` | Login com email e senha via Supabase Auth |
| `/cadastro` | Cadastro com validação de senha (8+ chars, maiúscula, minúscula, número, especial) + código de convite (`VITE_INVITE_CODE`) |

- Header dinâmico: usuário logado vê email + "Painel" + "Sair"; não logado vê "Entrar" + "Cadastre-se"

---

## 2. Dashboard Administrativo (`/dashboard`)

Protegido por autenticação — redireciona para `/login` se não logado.

| Rota | Descrição |
|---|---|
| `/dashboard/membros` | CRUD membros (nome, cargo, bio, iniciais, categoria) |
| `/dashboard/eventos` | CRUD eventos (título, data, local, descrição, status futuro/passado) |
| `/dashboard/posts` | CRUD posts do blog (slug, título, conteúdo markdown, published/draft) |
| `/dashboard/textos` | Editar todos os textos da home: hero, descrições, labels, números, slides |
| `/dashboard/portfolio` | CRUD portfólio de startups (nome, setor, estágio, ano) |
| `/dashboard/faq` | CRUD FAQ (categoria investidores/startups, pergunta, resposta, ordem) |
| `/dashboard/depoimentos` | CRUD depoimentos (nome, cargo, empresa, tipo investidor/fundador, quote, ordem) |

---

## 3. Upload de Imagens

- Bucket público `images` no Supabase Storage
- No Dashboard > Textos, campos de slide têm botão **Upload** que envia imagem do computador e salva a URL pública automaticamente

---

## 4. Páginas Públicas (dados do Supabase)

| Rota | Descrição |
|---|---|
| `/` | Home com hero, stats animados, portfólio, depoimentos, FAQ |
| `/sobre` | Sobre a FEA Angels |
| `/membros` | Grid de membros com FlipCard 3D |
| `/eventos` | Agenda de eventos (futuros/passados) |
| `/blog` | Lista de posts publicados |
| `/blog/$slug` | Post individual com formatação markdown |
| `/startups` | Formulário de submissão de startups |
| `/contato` | Página de contato |

---

## 5. Supabase — Estrutura

### Tabelas

| Tabela | Finalidade | RLS |
|---|---|---|
| `members` | Membros da rede | Leitura pública, escrita autenticada |
| `events` | Eventos | Leitura pública, escrita autenticada |
| `posts` | Posts do blog | Leitura pública (se published=true), escrita autenticada |
| `page_content` | Textos editáveis das páginas | Leitura pública, escrita autenticada |
| `portfolio` | Startups do portfólio | Leitura pública, escrita autenticada |
| `faq` | Perguntas frequentes | Leitura pública, escrita autenticada |
| `testimonials` | Depoimentos da home | Leitura pública, escrita autenticada |

### Storage

| Bucket | Finalidade |
|---|---|
| `images` | Upload de imagens (slides, fotos) — público |

---

## 6. Manutenção — Keep Alive

O Supabase free pausa projetos após 7 dias de inatividade.

- **GitHub Actions** (`.github/workflows/keep-alive.yml`): dispara toda segunda 12h UTC fazendo um GET no Supabase
- Requer secrets no repositório: `SUPABASE_URL` e `SUPABASE_ANON_KEY`

---

## 7. Variáveis de Ambiente (`.env`)

```
VITE_SITE_NAME
VITE_SITE_DESCRIPTION
VITE_ADDRESS
VITE_MAPS_EMBED_URL
VITE_CONTACT_EMAIL
VITE_CONTACT_PHONE
VITE_SOCIAL_INSTAGRAM
VITE_SOCIAL_LINKEDIN
VITE_SOCIAL_YOUTUBE
VITE_CHAT_MODEL
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_INVITE_CODE
AI_API_KEY
AI_API_URL
```
