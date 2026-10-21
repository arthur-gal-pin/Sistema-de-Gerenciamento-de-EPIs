export enum enumEquipes {
    cepepi = 'CEPEPI', 
    clg = 'CLG'
}

// Mapeamento do cargo por equipe
export const CargosCoordenadores: Record<enumEquipes, string> = {
    [enumEquipes.cepepi]: 'Coordenador da Equipe CEPEPI',
    [enumEquipes.clg]:    'Coordenador Geral'
};

// Como usar:
// CargosCoordenadores[cepepi] -> 'Coordenador de TI'