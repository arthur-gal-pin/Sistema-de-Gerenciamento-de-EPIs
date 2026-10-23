import {ArrowLeft} from "lucide-react"
import { useNavigate } from "react-router-dom";

export default function SetaVoltar() {
    const navigate = useNavigate()
    return <button type='button' onClick={(e) => navigate(-1)}><ArrowLeft size={30} /></button>;
}
