import { useEffect, useState } from "react";

const DADOS_MOCKADOS = [
  { 
    id: 1, 
    title: 'Ensaio de Capacete de Proteção', 
    description: 'Teste de resistência a impacto mecânico concluído com sucesso.', 
    time: '10 min atrás', 
    tag: 'Aprovado' 
  },
  { 
    id: 2, 
    title: 'Ensaio de Luva Isolante de Borracha', 
    description: 'Verificação de rigidez dielétrica e estanqueidade.', 
    time: '1 hora atrás', 
    tag: 'Aprovado' 
  },
  { 
    id: 3, 
    title: 'Calibração de Dosímetro de Ruído', 
    description: 'Aguardando validação dos parâmetros de ruído em campo.', 
    time: '2 horas atrás', 
    tag: 'Em Análise' 
  }
];

export function useEnsaios() {
  const [ensaios, setEnsaios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {
      setEnsaios(DADOS_MOCKADOS);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return { ensaios, loading };
}