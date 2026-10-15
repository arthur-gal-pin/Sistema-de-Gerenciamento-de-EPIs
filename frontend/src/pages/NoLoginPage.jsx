import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NoLoginPage(){
    const [formData, setFormData] = useState({
        nome: '',
        cpf: '',
        email: '',
        equipe: '',
        texto: ''
    });
    const [error, setError] = useState(null);
}