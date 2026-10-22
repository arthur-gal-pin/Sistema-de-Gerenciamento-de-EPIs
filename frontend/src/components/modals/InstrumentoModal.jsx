import { useEffect, useState } from "react";

export default function InstrumentoModal({ onSave, isOpen, onClose, children }) {
    const [formData, setFormData] = useState({
        idInstrumento: '',
        nomeInstrumento: '',
        funcaoInstrumento: '',
        ultimaCalibracao: ''
    })



    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        setFormData({
            idInstrumento: '',
            nomeInstrumento: '',
            funcaoInstrumento: '',
            ultimaCalibracao: ''
        })
        onCancelar();
    }

    const handleClose = (e) => {
        e.preventDefault();
        onClose(formData);
        setFormData({
            idInstrumento: '',
            nomeInstrumento: '',
            funcaoInstrumento: '',
            ultimaCalibracao: ''
        })
    }

    return (
        <div>
            <h2></h2>
            <button type="submit" onClick={handleSubmit}>Salvar Novo Instrumento</button>
            <button onClick={handleClose}>✕</button>
            <div>
                {children}
            </div>
        </div>
    );
}
