import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { 
    ClipboardCheck, 
    CheckCircle, 
    Save, 
    ArrowLeft, 
    Thermometer, 
    Droplets, 
    Gauge, 
    Microscope, 
    AlertCircle,
    Check
} from "lucide-react";
import { getEnsaioById, getAmostrasDoEnsaio } from "../../services/ensaioService";
import { 
    getCamposDoTipoEnsaio, 
    getDadosDaAmostraEnsaio, 
    salvarDadoEnsaio, 
    atualizarDadoEnsaio,
    atualizarAmostraEnsaio 
} from "../../services/dadosEnsaioService";
import { getAllInstrumentos } from "../../services/instrumentoService";
import { getAllAmostras } from "../../services/amostras/amostraService";

export default function RegistroEnsaioPage() {
    const { id: ensaioId } = useParams();
    const [ensaio, setEnsaio] = useState(null);
    const [amostrasEnsaio, setAmostrasEnsaio] = useState([]);
    const [amostrasCadastradas, setAmostrasCadastradas] = useState([]);
    const [instrumentos, setInstrumentos] = useState([]);
    const [camposDinamicos, setCamposDinamicos] = useState([]);
    const [itemSelecionado, setItemSelecionado] = useState(null);
    
    // Estado do formulário da amostra selecionada
    const [dadosAmbiente, setDadosAmbiente] = useState({
        temperatura: 22,
        umidade: 55,
        pressao: 1013,
        FK_idInstrumento: ""
    });

    // Estado dos valores dinâmicos: { [idCampoEnsaio]: { valor: string, idDadoSalvo?: string } }
    const [valoresCampos, setValoresCampos] = useState({});

    const [loading, setLoading] = useState(true);
    const [salvando, setSalvando] = useState(false);
    const [mensagemSucesso, setMensagemSucesso] = useState(null);
    const [erro, setErro] = useState(null);

    async function carregar() {
        try {
            setLoading(true);
            const [ens, todasAmostras, insts] = await Promise.all([
                getEnsaioById(ensaioId),
                getAllAmostras(),
                getAllInstrumentos()
            ]);

            setEnsaio(ens);
            setAmostrasCadastradas(todasAmostras);
            setInstrumentos(insts);

            // Carrega as amostras vinculadas ao ensaio
            const vinculadas = await getAmostrasDoEnsaio(ensaioId);
            setAmostrasEnsaio(vinculadas);

            // Carrega os campos dinâmicos do Tipo de Ensaio
            const tipoId = ens.fkIdTipoEnsaio || ens.FK_idTipoEnsaio;
            if (tipoId) {
                const campos = await getCamposDoTipoEnsaio(tipoId);
                setCamposDinamicos(campos);
            }

            if (vinculadas.length > 0) {
                await selecionarAmostra(vinculadas[0]);
            }
        } catch (err) {
            console.error("Erro ao carregar dados do ensaio:", err);
            setErro("Não foi possível carregar os dados do ensaio.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        carregar();
    }, [ensaioId]);

    const selecionarAmostra = async (item) => {
        setItemSelecionado(item);
        setMensagemSucesso(null);
        setErro(null);

        // Preenche dados ambientais
        setDadosAmbiente({
            temperatura: item.temperatura ?? 22,
            umidade: item.umidade ?? 55,
            pressao: item.pressao ?? 1013,
            FK_idInstrumento: item.fkIdInstrumento || item.FK_idInstrumento || ""
        });

        // Busca dados dinâmicos salvos para essa AmostraEnsaio
        try {
            const dadosSalvos = await getDadosDaAmostraEnsaio(item.idAmostraEnsaio);
            const mapa = {};
            dadosSalvos.forEach((d) => {
                const campoId = d.fkIdCampoEnsaio || d.FK_idCampoEnsaio;
                mapa[campoId] = {
                    valor: d.dado,
                    idDadoSalvo: d.idDadosEnsaio
                };
            });
            setValoresCampos(mapa);
        } catch (err) {
            console.error("Erro ao buscar dados salvos:", err);
        }
    };

    const handleSalvarResultados = async (e) => {
        e.preventDefault();
        if (!itemSelecionado) return;

        setSalvando(true);
        setErro(null);
        setMensagemSucesso(null);

        try {
            // 1. Atualiza dados ambientais e instrumento na AmostraEnsaio
            await atualizarAmostraEnsaio(itemSelecionado.idAmostraEnsaio, {
                temperatura: Number(dadosAmbiente.temperatura),
                umidade: Number(dadosAmbiente.umidade),
                pressao: Number(dadosAmbiente.pressao),
                FK_idInstrumento: dadosAmbiente.FK_idInstrumento || undefined
            });

            // 2. Salva cada campo dinâmico preenchido
            for (const campo of camposDinamicos) {
                const entry = valoresCampos[campo.idCampoEnsaio];
                const valorInformado = entry?.valor;

                if (valorInformado !== undefined && valorInformado !== "") {
                    if (entry?.idDadoSalvo) {
                        // Atualiza dado já existente
                        await atualizarDadoEnsaio(entry.idDadoSalvo, {
                            dado: String(valorInformado)
                        });
                    } else {
                        // Cria novo dado
                        const res = await salvarDadoEnsaio({
                            FK_idAmostraEnsaio: itemSelecionado.idAmostraEnsaio,
                            FK_idCampoEnsaio: campo.idCampoEnsaio,
                            nomeDado: campo.nomeCampo,
                            dado: String(valorInformado)
                        });
                        if (res?.data?.idDadosEnsaio) {
                            setValoresCampos((prev) => ({
                                ...prev,
                                [campo.idCampoEnsaio]: {
                                    ...prev[campo.idCampoEnsaio],
                                    idDadoSalvo: res.data.idDadosEnsaio
                                }
                            }));
                        }
                    }
                }
            }

            setMensagemSucesso("Resultados do ensaio gravados com sucesso!");
        } catch (err) {
            console.error("Erro ao salvar resultados:", err);
            setErro(err.response?.data?.message || "Erro ao salvar resultados do ensaio.");
        } finally {
            setSalvando(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                <div className="spinner" />
            </div>
        );
    }

    if (!ensaio) {
        return (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                <AlertCircle size={40} style={{ color: 'var(--danger)', marginBottom: '12px' }} />
                <h2>Ensaio não encontrado</h2>
                <Link to="/protocolos" className="btn-primary mt-16">Voltar aos Protocolos</Link>
            </div>
        );
    }

    const amostraInfoMap = Object.fromEntries(amostrasCadastradas.map((a) => [a.idAmostra, a]));

    return (
        <div>
            {/* Header da Página */}
            <div className="page-header" style={{ alignItems: 'flex-start' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <h1>Registro de Resultados: {ensaio.nomeEnsaio}</h1>
                        <span className={`badge ${ensaio.papel === 'prova' ? 'badge-blue' : 'badge-amber'}`}>
                            {ensaio.papel}
                        </span>
                    </div>
                    <p style={{ marginTop: '4px' }}>
                        Coleta de medições ambientais e variáveis específicas de ensaio conforme normas técnicas da Fundacentro.
                    </p>
                </div>

                <Link to={`/protocolos/${ensaio.fkIdProtocolo || ensaio.FK_idProtocolo}`} className="btn-secondary">
                    <ArrowLeft size={16} /> Voltar ao Protocolo
                </Link>
            </div>

            {/* Alertas */}
            {mensagemSucesso && <div className="alert alert-success">{mensagemSucesso}</div>}
            {erro && <div className="alert alert-error">{erro}</div>}

            {amostrasEnsaio.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px 0' }}>
                    <ClipboardCheck size={48} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
                    <h3>Nenhuma amostra vinculada a este ensaio</h3>
                    <p className="text-muted mt-8" style={{ maxWidth: '480px', margin: '8px auto' }}>
                        Para registrar resultados, volte aos Detalhes do Protocolo e clique em "Adicionar Amostra ao Ensaio".
                    </p>
                    <Link to={`/protocolos/${ensaio.fkIdProtocolo || ensaio.FK_idProtocolo}`} className="btn-primary mt-16">
                        Ir para Detalhes do Protocolo
                    </Link>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px', alignItems: 'flex-start' }}>
                    {/* Barra lateral de Amostras do Ensaio */}
                    <div className="card" style={{ padding: '16px' }}>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '12px', color: '#334155' }}>
                            Amostras no Ensaio ({amostrasEnsaio.length})
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {amostrasEnsaio.map((item, idx) => {
                                const am = amostraInfoMap[item.fkIdAmostra || item.FK_idAmostra];
                                const ativo = itemSelecionado?.idAmostraEnsaio === item.idAmostraEnsaio;

                                return (
                                    <button
                                        key={item.idAmostraEnsaio}
                                        type="button"
                                        onClick={() => selecionarAmostra(item)}
                                        style={{
                                            textAlign: 'left',
                                            padding: '10px 12px',
                                            borderRadius: '6px',
                                            border: ativo ? '2px solid var(--primary)' : '1px solid var(--border)',
                                            backgroundColor: ativo ? 'var(--primary-light)' : '#fff',
                                            cursor: 'pointer',
                                            transition: 'all 0.15s'
                                        }}
                                    >
                                        <div style={{ fontWeight: 600, fontSize: '0.9rem', color: ativo ? 'var(--primary)' : '#1e293b' }}>
                                            #{idx + 1} - {am?.codigoAmostra || 'Amostra'}
                                        </div>
                                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                            {am?.nomeAmostra || "Sem nome"} ({am?.subclassificacaoAmostra || ""})
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Formulário de Registro da Amostra Selecionada */}
                    {itemSelecionado && (
                        <div className="card">
                            <div className="flex-between mb-16" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.2rem' }}>
                                        Amostra: {amostraInfoMap[itemSelecionado.fkIdAmostra || itemSelecionado.FK_idAmostra]?.codigoAmostra}
                                    </h3>
                                    <p className="text-muted" style={{ fontSize: '0.88rem' }}>
                                        {amostraInfoMap[itemSelecionado.fkIdAmostra || itemSelecionado.FK_idAmostra]?.nomeAmostra}
                                    </p>
                                </div>
                                <span className="badge badge-blue">
                                    ID Amostra-Ensaio: {itemSelecionado.idAmostraEnsaio.slice(0, 8)}...
                                </span>
                            </div>

                            <form onSubmit={handleSalvarResultados}>
                                {/* Bloco 1: Condições Ambientais e Instrumentação */}
                                <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '14px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <Thermometer size={18} /> Condições Ambientais & Instrumentação
                                </h4>

                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Instrumento de Medição</label>
                                        <select
                                            value={dadosAmbiente.FK_idInstrumento}
                                            onChange={(e) => setDadosAmbiente({ ...dadosAmbiente, FK_idInstrumento: e.target.value })}
                                        >
                                            <option value="">Selecione o instrumento</option>
                                            {instrumentos.map((i) => (
                                                <option key={i.idInstrumento} value={i.idInstrumento}>
                                                    {i.nomeInstrumento} ({i.funcaoInstrumento || "Geral"})
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Temperatura do Laboratório (°C) *</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            required
                                            value={dadosAmbiente.temperatura}
                                            onChange={(e) => setDadosAmbiente({ ...dadosAmbiente, temperatura: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Umidade Relativa do Ar (%) *</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            required
                                            value={dadosAmbiente.umidade}
                                            onChange={(e) => setDadosAmbiente({ ...dadosAmbiente, umidade: e.target.value })}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Pressão Atmosférica (hPa / mbar)</label>
                                        <input
                                            type="number"
                                            step="1"
                                            value={dadosAmbiente.pressao}
                                            onChange={(e) => setDadosAmbiente({ ...dadosAmbiente, pressao: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Bloco 2: Parâmetros Dinâmicos do Tipo de Ensaio */}
                                <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
                                    <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '14px', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Gauge size={18} /> Parâmetros Específicos do Ensaio
                                    </h4>

                                    {camposDinamicos.length === 0 ? (
                                        <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: '16px' }}>
                                            Nenhum campo dinâmico cadastrado para este tipo de ensaio. Você pode adicionar variáveis personalizadas em "Tipos de Ensaio" no menu lateral.
                                        </p>
                                    ) : (
                                        <div className="form-grid">
                                            {camposDinamicos.map((campo) => {
                                                const idCampo = campo.idCampoEnsaio;
                                                const valorAtual = valoresCampos[idCampo]?.valor ?? "";

                                                return (
                                                    <div key={idCampo} className="form-group">
                                                        <label>
                                                            {campo.nomeCampo} {campo.unidadeMedida ? `(${campo.unidadeMedida})` : ""}
                                                            {campo.obrigatoriedade && <span style={{ color: 'var(--danger)' }}> *</span>}
                                                        </label>

                                                        {campo.tipoDado === 'number' ? (
                                                            <input
                                                                type="number"
                                                                step="any"
                                                                required={campo.obrigatoriedade}
                                                                placeholder={`Valor em ${campo.unidadeMedida || 'numérico'}`}
                                                                value={valorAtual}
                                                                onChange={(e) => {
                                                                    const val = e.target.value;
                                                                    setValoresCampos((prev) => ({
                                                                        ...prev,
                                                                        [idCampo]: { ...prev[idCampo], valor: val }
                                                                    }));
                                                                }}
                                                            />
                                                        ) : campo.tipoDado === 'date' ? (
                                                            <input
                                                                type="date"
                                                                required={campo.obrigatoriedade}
                                                                value={valorAtual}
                                                                onChange={(e) => {
                                                                    const val = e.target.value;
                                                                    setValoresCampos((prev) => ({
                                                                        ...prev,
                                                                        [idCampo]: { ...prev[idCampo], valor: val }
                                                                    }));
                                                                }}
                                                            />
                                                        ) : (
                                                            <input
                                                                type="text"
                                                                required={campo.obrigatoriedade}
                                                                placeholder="Digite o resultado..."
                                                                value={valorAtual}
                                                                onChange={(e) => {
                                                                    const val = e.target.value;
                                                                    setValoresCampos((prev) => ({
                                                                        ...prev,
                                                                        [idCampo]: { ...prev[idCampo], valor: val }
                                                                    }));
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                <div className="mt-24" style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                                    <button type="submit" className="btn-primary" disabled={salvando}>
                                        <Save size={18} /> {salvando ? "Salvando Dados..." : "Salvar Resultados da Amostra"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
