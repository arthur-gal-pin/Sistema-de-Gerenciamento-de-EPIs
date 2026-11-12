import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FlaskConical, Microscope, Shield, Factory, Users, PlusCircle, ArrowRight } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { getAllProtocolos } from "../services/protocoloService";
import { getAllEmpresas } from "../services/amostras/empresaService";
import { getAllOcps } from "../services/amostras/ocpService";
import { getAllInstrumentos } from "../services/instrumentoService";

export default function HomePage() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        protocolos: 0,
        empresas: 0,
        ocps: 0,
        instrumentos: 0,
        loading: true
    });
    const [recentProtocolos, setRecentProtocolos] = useState([]);

    useEffect(() => {
        async function loadDashboard() {
            try {
                const [protos, emp, ocp, inst] = await Promise.all([
                    getAllProtocolos(),
                    getAllEmpresas(),
                    getAllOcps(),
                    getAllInstrumentos()
                ]);
                setStats({
                    protocolos: protos.length,
                    empresas: emp.length,
                    ocps: ocp.length,
                    instrumentos: inst.length,
                    loading: false
                });
                setRecentProtocolos(protos.slice(0, 5));
            } catch (err) {
                console.error("Erro ao carregar dashboard:", err);
                setStats((s) => ({ ...s, loading: false }));
            }
        }
        loadDashboard();
    }, []);

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>Painel de Controle</h1>
                    <p>Bem-vindo(a), {user?.nomeFuncionario || 'Usuário'}. Gestão de Ensaios e Conformidade de EPIs.</p>
                </div>
                <Link to="/protocolos" className="btn-primary">
                    <PlusCircle size={18} /> Novo Protocolo
                </Link>
            </div>

            {/* Cards de Resumo */}
            <div className="form-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', marginBottom: '28px' }}>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px' }}>
                    <div style={{ backgroundColor: 'var(--secondary-light)', color: 'var(--secondary-dark)', padding: '14px', borderRadius: '12px' }}>
                        <FlaskConical size={28} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-h)' }}>{stats.loading ? '...' : stats.protocolos}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Protocolos</div>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px' }}>
                    <div style={{ backgroundColor: 'var(--primary-light)', color: 'var(--secondary-dark)', padding: '14px', borderRadius: '12px' }}>
                        <Factory size={28} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-h)' }}>{stats.loading ? '...' : stats.empresas}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Empresas / Fabr.</div>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px' }}>
                    <div style={{ backgroundColor: '#edf2e6', color: 'var(--secondary)', padding: '14px', borderRadius: '12px' }}>
                        <Shield size={28} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-h)' }}>{stats.loading ? '...' : stats.ocps}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>OCPs Cadastrados</div>
                    </div>
                </div>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '18px' }}>
                    <div style={{ backgroundColor: 'var(--surface-alt)', color: 'var(--secondary-dark)', padding: '14px', borderRadius: '12px' }}>
                        <Microscope size={28} />
                    </div>
                    <div>
                        <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-h)' }}>{stats.loading ? '...' : stats.instrumentos}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Instrumentos</div>
                    </div>
                </div>
            </div>

            {/* Protocolos Recentes */}
            <div className="card">
                <div className="flex-between mb-16">
                    <h3>Protocolos Recentes</h3>
                    <Link to="/protocolos" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}>
                        Ver todos <ArrowRight size={16} />
                    </Link>
                </div>

                {stats.loading ? (
                    <p className="text-muted">Carregando protocolos...</p>
                ) : recentProtocolos.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px 0' }}>
                        <p className="text-muted">Nenhum protocolo cadastrado ainda.</p>
                        <Link to="/protocolos" className="btn-primary mt-12">
                            Criar Primeiro Protocolo
                        </Link>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Nº Protocolo</th>
                                    <th>Processo SEI</th>
                                    <th>Tipo</th>
                                    <th>Abertura</th>
                                    <th>Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentProtocolos.map((proto) => (
                                    <tr key={proto.idProtocolo}>
                                        <td><strong>{proto.numeroProtocolo}</strong></td>
                                        <td>{proto.numeroSEI}</td>
                                        <td>
                                            <span className={`badge ${proto.tipoProtocolo === 'inicial' ? 'badge-blue' : proto.tipoProtocolo === 'manutencao' ? 'badge-amber' : 'badge-green'}`}>
                                                {proto.tipoProtocolo}
                                            </span>
                                        </td>
                                        <td>{new Date(proto.diaAbertura).toLocaleDateString('pt-BR')}</td>
                                        <td>
                                            <Link to={`/protocolos/${proto.idProtocolo}`} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                                                Acessar
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
