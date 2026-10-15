import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NoLoginPage() {
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        email: '',
        equipe: '',
        texto: ''
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        //Service para enviar e-mail;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    const dadosEquipe = [
        {
            id: 1,
            equipe: 'gerenciamento',
            lider: 'roberto',
            email: 'roberto@gmail.com'
        },
        {
            id: 2,
            equipe: 'azul',
            lider: 'lagarto',
            email: 'lagarto@gmail.com'
        }
    ];

    return (
        <div>
            <h3>Mandar mensagem para o coordenador de sua equipe</h3>
            <form>
                <label>Seu nome completo</label>
                <input type='text' placeholder="Ex: João Silva" value={formData.nome} onChange={handleChange} required></input>

                <label>Seu CPF</label>
                <input type='text' placeholder="Ex: XXX.XXX.XXX-XX" value={formData.cpf} onChange={handleChange} required></input>

                <label>Seu E-mail</label>
                <input type='email' placeholder="Ex: joaosilva@gmail.com" value={formData.email} onChange={handleChange} required></input>

                <label>Escolha a sua equipe</label>
                <select name="" id="">
                    {dadosEquipe.map((equipe) => {
                        <option value={equipe.id}>{equipe.equipe}</option>
                    })}
                </select>

                <label>Deixe uma mensagem para seu coordenador</label>
                <input type='text' placeholder="Digite aqui..." value={formData.texto} onChange={handleChange} required></input>

                <button type="submit" onClick={handleSubmit}>Enviar dados</button>
            </form>
        </div>
    )
}