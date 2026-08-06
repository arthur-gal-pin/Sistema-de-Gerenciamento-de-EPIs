# Portal de Cadastro Laboratorial

Dashboard convertido do protótipo estático (HTML + Tailwind) para **Vite + React + Bootstrap**.

## Stack
- **Vite** — build tool / dev server
- **React 18** — componentes de UI
- **Bootstrap 5** — grid, utilitários e componentes base (CSS + JS bundle)
- CSS customizado (`src/index.css`) com as variáveis do design system "Serene Nature" (cores, tipografia, espaçamento, raios), já que o Bootstrap não inclui esses tokens nativamente
- Ícones via Google Fonts "Material Symbols" (carregados no `index.html`, sem dependência de outro framework JS)

## Estrutura de pastas

```
vite-app/
├── index.html                 # HTML raiz do Vite (fontes + ícones)
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx                # bootstrap da aplicação React + imports do Bootstrap
│   ├── App.jsx                 # layout raiz (sidebar + conteúdo)
│   ├── index.css               # tokens de design (cores/tipografia/espaçamento)
│   ├── data/
│   │   └── dashboardData.js    # dados mockados (fácil de trocar por API)
│   └── components/
│       ├── Sidebar.jsx         # navegação lateral (SideNavBar)
│       ├── TopAppBar.jsx       # cabeçalho superior
│       ├── Dashboard.jsx       # área principal (boas-vindas + grids)
│       ├── StatCard.jsx        # cartão de estatística reutilizável
│       ├── RecentActivity.jsx  # timeline de atividades recentes
│       └── Notices.jsx         # avisos da instituição
└── public/
```

## Como rodar

```bash
npm install
npm run dev
```

Build de produção:

```bash
npm run build
npm run preview
```

## Observações da conversão
- As classes utilitárias do Tailwind (`bg-surface`, `font-headline-lg`, `rounded-lg`, etc.) foram convertidas em:
  - Utilitários do **Bootstrap** para layout, flexbox e espaçamento (`d-flex`, `row`/`col`, `gap-*`, `p-*`);
  - Classes customizadas com prefixo `lab-` (definidas em `src/index.css`) para as cores e tipografia específicas do design system, evitando conflito com as classes nativas do Bootstrap.
- Todo o conteúdo textual e numérico da tela original foi extraído para `src/data/dashboardData.js`, facilitando a futura integração com uma API real.
- O menu lateral em telas pequenas foi implementado como um overlay simples controlado por estado do React (sem depender de JS do Bootstrap para isso).
