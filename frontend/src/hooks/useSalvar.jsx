import { useState, useCallback } from "react";

export default function useSave(onSave) {
    const [nomeInstrumento, setNomeInstrumento] = useState('');
    const [funcaoInstrumento, setFuncaoInstrumento] = useState('');
    const [ultimaCalibracao, setUltimaCalibracao] = useState('');
    const [erro, setErro] = useState('');

    
}