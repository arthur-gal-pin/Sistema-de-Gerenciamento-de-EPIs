export const navItems = [
  { icon: 'dashboard', label: 'Dashboard', active: true },
  { icon: 'biotech', label: 'Amostras', badge: '874' },
  { icon: 'description', label: 'Relatórios' },
  { icon: 'settings', label: 'Configurações' },
]

export const statCards = [
  {
    id: 'ensaios',
    icon: 'biotech',
    bgIcon: 'science',
    bg: 'bg-lab-surface-container',
    iconColor: 'text-lab-tertiary',
    badge: 'Em execução',
    title: 'Ensaios Ativos',
    value: '142',
    trend: '+12%',
  },
  {
    id: 'equipe',
    icon: 'groups',
    bg: 'bg-lab-surface-container-low',
    iconColor: 'text-lab-primary',
    title: 'Equipe (Turno A)',
    value: '48',
    suffix: '/ 52 presentes',
    progress: 92,
  },
  {
    id: 'equipamentos',
    icon: 'precision_manufacturing',
    bg: 'bg-lab-surface-container',
    iconColor: 'text-lab-secondary',
    title: 'Status Equipamentos',
    value: '94%',
    suffix: 'operacional',
    alert: '2 requerem calibração',
    pulse: true,
  },
  {
    id: 'amostras',
    icon: 'inventory_2',
    bgIcon: 'inventory_2',
    bg: 'bg-lab-secondary-container',
    iconColor: 'text-lab-on-secondary-container',
    title: 'Recepção (Hoje)',
    value: '874',
    suffix: 'amostras novas',
    highlighted: true,
  },
]

export const recentActivities = [
  {
    id: 1,
    title: 'Lote #9822 Concluído',
    time: 'Há 10 min',
    description:
      'Análise espectrométrica finalizada pelo setor de química orgânica. Resultados liberados para revisão.',
    tag: 'Orgânica',
    dotColor: 'var(--lab-tertiary)',
  },
  {
    id: 2,
    title: 'Manutenção Preventiva Iniciada',
    time: 'Há 45 min',
    description:
      'Equipamento Centrifugadora B-04 fora de operação temporariamente para calibração trimestral.',
    dotColor: 'var(--lab-outline-variant)',
  },
  {
    id: 3,
    title: 'Recepção de Grande Volume',
    time: 'Há 2 horas',
    description:
      'Entrada de 300 amostras biológicas do hospital regional. Triagem em andamento no setor primário.',
    dotColor: 'var(--lab-secondary)',
  },
]

export const notices = [
  {
    id: 1,
    variant: 'tertiary',
    title: 'Atualização do Sistema LIMS',
    description:
      'O sistema principal de gestão passará por manutenção programada neste fim de semana, das 00h às 04h.',
    footer: '18 Outubro',
    footerIcon: 'calendar_month',
  },
  {
    id: 2,
    variant: 'error',
    title: 'Atenção: Reagentes',
    icon: 'priority_high',
    description:
      'O estoque do reagente X-14 está em nível crítico. Solicitações não urgentes devem aguardar novo lote.',
  },
  {
    id: 3,
    variant: 'secondary',
    title: 'Treinamento de Biossegurança',
    description:
      'Lembrete para todos os técnicos do Turno A sobre a reciclagem anual obrigatória na próxima terça-feira.',
    action: 'Inscrever-se',
  },
]

export const currentUser = {
  name: 'Dr. Silva',
  role: 'Diretor Técnico',
  avatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBEmn1PQvR6oCBGUsb9NW0J8zUqX2_cB3h7SqoD-K1iZaHAFYAorUTa80iF95mWjK0p4jbnP7GegJR1J0j5rVqxUzXOSXYrUXjZdU91exlKOBOJFwRp3AhD9nZUqPOhq7_9ePrOij2OOeyA4BJo-99x4fxp5RTz2bwt7pz1NFPopJXiRNwUyOrxoMXm6dplELR5_uuETR7oXrxNcqbq4s5b6GhvX3Y3I44fo0K7Q2pNd0Aqn7jistme6Q',
}
