import { useState } from "react"

const instrumentosMock = [
    {
        idInstrumento: 1,
        nomeInstrumento: 'Amassador',
        funcaoInstrumento: 'Amassar',
        ultimaCalibracao: Date.now(),
    },
    {
        idInstrumento: 2,
        nomeInstrumento: 'Pulmão mecânico',
        funcaoInstrumento: 'Testes repiratórios',
        ultimaCalibracao: Date.now(),
    }
    
]

export default function IntrumentosPage() {
    const [instrumentos, setInstrumentos] = useState(instrumentosMock);
    const [instrumentosEdit, setInstrumentosEdit] = useState(null)
    const [formData, setFormData] = useState({
        nomeInstrumento: '',
        funcaoInstrumento: '',
        ultimaCalibracao: '',
    })



    return(
        <div>
            <h3>Instrumentos</h3>

            <table>
                <thead>
                    <tr>
                        <th>Nome do instrumento</th>
                        <th>Função</th>
                        <th>Última calibração</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        instrumentos.map(
                            instrumentos => (
                                <tr key={instrumentos.id}>
                                    <td>{instrumentos.nomeInstrumento}</td>
                                    <td>{instrumentos.funcaoInstrumento}</td>
                                    <td>{instrumentos.ultimaCalibracao}</td>
                                    <td>
                                        <button onClick={() => setInstrumentosEdit(instrumentos)}>
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            )
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}