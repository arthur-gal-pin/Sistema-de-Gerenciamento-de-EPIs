import { useEffect, useState } from "react";
import { FileSpreadsheet, Printer, FlaskConical, Download, CheckCircle, Search } from "lucide-react";
import { getAllProtocolos } from "../services/protocoloService";
import { getAmostrasPorProtocolo } from "../services/amostras/amostraService";
import { getEnsaiosPorProtocolo, getAmostrasDoEnsaio, getFuncionariosDoEnsaio } from "../services/ensaioService";
import { getDadosDaAmostraEnsaio, getCamposDoTipoEnsaio } from "../services/dadosEnsaioService";
import { getAllEmpresas } from "../services/amostras/empresaService";
import { getAllOcps } from "../services/amostras/ocpService";
import { getAllFuncionarios } from "../services/funcionarioService";
import { getAllInstrumentos } from "../services/instrumentoService";

export default function RelatoriosPage() {
    const [protocolos, setProtocolos] = useState([]);
    const [empresas, setEmpresas] = useState([]);
    const [ocps, setOcps] = useState([]);
    const [funcionarios, setFuncionarios] = useState([]);
    const [instrumentos, setInstrumentos] = useState([]);
    const [protocoloId, setProtocoloId] = useState("");
    const [dadosRelatorio, setDadosRelatorio] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function init() {
            try {
                const [protos, emp, ocp, funcs, insts] = await Promise.all([
                    getAllProtocolos(),
                    getAllEmpresas(),
                    getAllOcps(),
                    getAllFuncionarios(),
                    getAllInstrumentos()
                ]);
                setProtocolos(protos);
                setEmpresas(emp);
                setOcps(ocp);
                setFuncionarios(funcs);
                setInstrumentos(insts);

                if (protos.length > 0) {
                    setProtocoloId(protos[0].idProtocolo);
                }
            } catch (err) {
                console.error("Erro ao carregar dados de relatórios:", err);
            }
        }
        init();
    }, []);

    useEffect(() => {
        if (!protocoloId) return;

        async function gerarDados() {
            setLoading(true);
            try {
                const proto = protocolos.find(p => p.idProtocolo === protocoloId);
                const [amostras, ensaios] = await Promise.all([
                    getAmostrasPorProtocolo(protocoloId),
                    getEnsaiosPorProtocolo(protocoloId)
                ]);

                // Detalha os ensaios com amostras, medições e dados dinâmicos
                const ensaiosDetalhados = [];
                for (const ens of ensaios) {
                    const [vinculosAmostras, execs, camposTipo] = await Promise.all([
                        getAmostrasDoEnsaio(ens.idEnsaio).catch(() => []),
                        getFuncionariosDoEnsaio(ens.idEnsaio).catch(() => []),
                        ens.fkIdTipoEnsaio ? getCamposDoTipoEnsaio(ens.fkIdTipoEnsaio).catch(() => []) : []
                    ]);

                    const amostrasComMedicoes = [];
                    for (const v of vinculosAmostras) {
                        const dadosSalvos = await getDadosDaAmostraEnsaio(v.idAmostraEnsaio).catch(() => []);
                        amostrasComMedicoes.push({
                            ...v,
                            dadosColetados: dadosSalvos
                        });
                    }

                    ensaiosDetalhados.push({
                        ...ens,
                        amostrasEnsaiadas: amostrasComMedicoes,
                        executores: execs,
                        camposDefinidos: camposTipo
                    });
                }

                setDadosRelatorio({
                    protocolo: proto,
                    amostras,
                    ensaios: ensaiosDetalhados
                });
            } catch (err) {
                console.error("Erro ao gerar relatório:", err);
            } finally {
                setLoading(false);
            }
        }

        gerarDados();
    }, [protocoloId, protocolos]);

    const empresaMap = Object.fromEntries(empresas.map((e) => [e.idEmpresa || e.id, e.nomeEmpresa || e.nome]));
    const ocpMap = Object.fromEntries(ocps.map((o) => [o.idOCP || o.id, o.nomeOCP || o.nome]));
    const funcMap = Object.fromEntries(funcionarios.map((f) => [f.idFuncionario, `${f.nomeFuncionario} ${f.sobrenomeFuncionario || ''}`]));
    const instMap = Object.fromEntries(instrumentos.map((i) => [i.idInstrumento, i.nomeInstrumento]));
    const amostraMap = Object.fromEntries((dadosRelatorio?.amostras || []).map((a) => [a.idAmostra, a]));

    const handleImprimir = () => {
        window.print();
    };

    const handleExportarCSV = () => {
        if (!dadosRelatorio) return;

        const p = dadosRelatorio.protocolo;
        const linhas = [
            ["RELATORIO DE ENSAIOS DE CONFORMIDADE DE EPIS - FUNDACENTRO"],
            ["Protocolo:", p.numeroProtocolo, "SEI:", p.numeroSEI, "Abertura:", new Date(p.diaAbertura).toLocaleDateString("pt-BR")],
            ["Empresa Fabricante:", empresaMap[p.fkIdEmpresa || p.FK_idEmpresa] || "-", "OCP:", ocpMap[p.fkIdOcp || p.FK_idOCP] || "-"],
            [],
            ["--- RESUMO DE ENSAIOS E MEDICOES COLETADAS ---"],
            ["Ensaio", "Papel", "Amostra Cod.", "Classificacao", "Temperatura (C)", "Umidade (%)", "Pressao (hPa)", "Instrumento", "Variavel", "Resultado"]
        ];

        for (const ens of dadosRelatorio.ensaios) {
            for (const amEns of ens.amostrasEnsaiadas) {
                const am = amostraMap[amEns.fkIdAmostra || amEns.FK_idAmostra];
                const inst = instMap[amEns.fkIdInstrumento || amEns.FK_idInstrumento] || "-";

                if (amEns.dadosColetados && amEns.dadosColetados.length > 0) {
                    for (const dado of amEns.dadosColetados) {
                        linhas.push([
                            ens.nomeEnsaio,
                            ens.papel,
                            am?.codigoAmostra || "-",
                            am?.subclassificacaoAmostra || "-",
                            amEns.temperatura,
                            amEns.umidade,
                            amEns.pressao || "-",
                            inst,
                            dado.nomeDado,
                            dado.dado
                        ]);
                    }
                } else {
                    linhas.push([
                        ens.nomeEnsaio,
                        ens.papel,
                        am?.codigoAmostra || "-",
                        am?.subclassificacaoAmostra || "-",
                        amEns.temperatura,
                        amEns.umidade,
                        amEns.pressao || "-",
                        inst,
                        "-",
                        "-"
                    ]);
                }
            }
        }

        const csvContent = "data:text/csv;charset=utf-8," + linhas.map(e => e.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(",")).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `relatorio_protocolo_${p.numeroProtocolo.replace(/[/\\?%*:|"<>]/g, '_')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            {/* Header da Página */}
            <div className="page-header">
                <div>
                    <h1>Relatórios & Laudo Técnico de Ensaios</h1>
                    <p>Passo 7 do PDF: Consolidação dos resultados, impressão e exportação</p>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="button" onClick={handleExportarCSV} className="btn-secondary" disabled={!dadosRelatorio || loading}>
                        <FileSpreadsheet size={18} /> Exportar Planilha (CSV)
                    </button>
                    <button type="button" onClick={handleImprimir} className="btn-primary" disabled={!dadosRelatorio || loading}>
                        <Printer size={18} /> Imprimir / Salvar PDF
                    </button>
                </div>
            </div>

            {/* Seletor de Protocolo */}
            <div className="card mb-24">
                <div className="form-group" style={{ maxWidth: '460px', marginBottom: 0 }}>
                    <label>Selecione o Protocolo para visualização:</label>
                    <select
                        value={protocoloId}
                        onChange={(e) => setProtocoloId(e.target.value)}
                    >
                        {protocolos.map((p) => (
                            <option key={p.idProtocolo} value={p.idProtocolo}>
                                {p.numeroProtocolo} - SEI {p.numeroSEI} ({p.tipoProtocolo})
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
                    <div className="spinner" />
                </div>
            ) : !dadosRelatorio ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
                    <p className="text-muted">Nenhum protocolo selecionado.</p>
                </div>
            ) : (
                /* Laudo Consolidado Formatado */
                <div className="card" id="laudo-impresso" style={{ padding: '32px' }}>
                    <div style={{ borderBottom: '2px solid var(--secondary)', paddingBottom: '16px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h2 style={{ fontSize: '1.4rem', color: 'var(--secondary)' }}>FUNDACENTRO / CEPEPI</h2>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Centro de Equipamentos de Proteção Individual - Laboratório de Ensaio</p>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <span className="badge badge-blue" style={{ fontSize: '0.9rem' }}>
                                Protocolo Nº {dadosRelatorio.protocolo.numeroProtocolo}
                            </span>
                        </div>
                    </div>

                    {/* Dados Cadastrais do Processo */}
                    <div className="form-grid mb-24" style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
                        <div>
                            <strong>Processo SEI:</strong> {dadosRelatorio.protocolo.numeroSEI}
                        </div>
                        <div>
                            <strong>Data de Abertura:</strong> {new Date(dadosRelatorio.protocolo.diaAbertura).toLocaleDateString("pt-BR")}
                        </div>
                        <div>
                            <strong>Tipo de Avaliação:</strong> {dadosRelatorio.protocolo.tipoProtocolo}
                        </div>
                        <div>
                            <strong>Fabricante / Solicitante:</strong> {empresaMap[dadosRelatorio.protocolo.fkIdEmpresa || dadosRelatorio.protocolo.FK_idEmpresa] || "-"}
                        </div>
                        <div>
                            <strong>Organismo Certificador (OCP):</strong> {ocpMap[dadosRelatorio.protocolo.fkIdOcp || dadosRelatorio.protocolo.FK_idOCP] || "-"}
                        </div>
                    </div>

                    {/* Ensaios Realizados e Resultados */}
                    <h3 style={{ fontSize: '1.15rem', marginBottom: '16px' }}>
                        Ensaios Realizados e Medições ({dadosRelatorio.ensaios.length})
                    </h3>

                    {dadosRelatorio.ensaios.length === 0 ? (
                        <p className="text-muted">Nenhum ensaio registrado para este protocolo.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            {dadosRelatorio.ensaios.map((ens) => (
                                <div key={ens.idEnsaio} style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '16px' }}>
                                    <div className="flex-between mb-8">
                                        <h4 style={{ fontSize: '1.05rem', color: '#1e293b' }}>{ens.nomeEnsaio}</h4>
                                        <span className="badge badge-amber">Papel: {ens.papel}</span>
                                    </div>

                                    {/* Executores */}
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                                        <strong>Executores Técnicos: </strong>
                                        {ens.executores.length === 0 ? "Nenhum informado" : ens.executores.map(ex => funcMap[ex.fkIdFuncionario || ex.FK_idFuncionario]).filter(Boolean).join(", ")}
                                    </div>

                                    {/* Tabela de Amostras e Dados */}
                                    {ens.amostrasEnsaiadas.length === 0 ? (
                                        <p className="text-muted" style={{ fontSize: '0.85rem' }}>Nenhuma amostra ensaiada vinculada.</p>
                                    ) : (
                                        <div className="table-container">
                                            <table className="data-table" style={{ fontSize: '0.86rem' }}>
                                                <thead>
                                                    <tr>
                                                        <th>Amostra</th>
                                                        <th>Condições Ambientais</th>
                                                        <th>Instrumento</th>
                                                        <th>Resultados dos Parâmetros</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {ens.amostrasEnsaiadas.map((amEns) => {
                                                        const am = amostraMap[amEns.fkIdAmostra || amEns.FK_idAmostra];
                                                        const inst = instMap[amEns.fkIdInstrumento || amEns.FK_idInstrumento] || "-";

                                                        return (
                                                            <tr key={amEns.idAmostraEnsaio}>
                                                                <td>
                                                                    <strong>{am?.codigoAmostra}</strong> ({am?.subclassificacaoAmostra})
                                                                </td>
                                                                <td>
                                                                    {amEns.temperatura}°C | {amEns.umidade}% UR {amEns.pressao ? `| ${amEns.pressao} hPa` : ''}
                                                                </td>
                                                                <td>{inst}</td>
                                                                <td>
                                                                    {amEns.dadosColetados && amEns.dadosColetados.length > 0 ? (
                                                                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                                                            {amEns.dadosColetados.map((d) => (
                                                                                <li key={d.idDadosEnsaio}>
                                                                                    <strong>{d.nomeDado}:</strong> {d.dado}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    ) : (
                                                                        <span className="text-muted">Aguardando registro de dados</span>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
