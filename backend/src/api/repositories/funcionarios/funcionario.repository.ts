import { prisma } from '../../configs/Database';
import { IFuncionario } from '../../models/funcionarios/Funcionario';

export class FuncionarioRepository {

    // Busca funcionário trazendo os dados do Cargo e a lista de Telefones (Eager Loading)
    static async buscarCompletoPorId(id: string) {
        return await prisma.funcionario.findUnique({
            where: { idFuncionario: id },
            include: {
                cargo: true,
                telefones: true
            }
        });
    }

    static async buscarPorCPF(cpf: string) {
        return await prisma.funcionario.findFirst({
            where: { cpf },
            include: { cargo: true }
        });
    }

    static async buscarPorEmail(email: string) {
        return await prisma.funcionario.findMany({
            where: { email }
        });
    }

    static async listarTodos() {
        return await prisma.funcionario.findMany({
            include: { cargo: true }
        });
    }

    static async listarPorNome(nome: string) {
        return await prisma.funcionario.findMany({
            where: {
                nomeFuncionario: { contains: nome }
            }
        });
    }

    static async listarPorId(id: string) {
        return await prisma.funcionario.findUnique({ where: { idFuncionario: id } });
    }

    // Recebe o objeto no formato do domínio (IFuncionario, chave FK_idCargo) e
    // traduz para o formato esperado pelo Prisma Client (fkIdCargo)
    static async criarFuncionario(dados: IFuncionario) {
        return await prisma.funcionario.create({
            data: {
                idFuncionario: dados.idFuncionario ?? undefined,
                fkIdCargo: dados.FK_idCargo,
                nomeFuncionario: dados.nomeFuncionario,
                sobrenomeFuncionario: dados.sobrenomeFuncionario,
                cpf: dados.cpf,
                email: dados.email,
                senhaHash: dados.senhaHash,
                caminhoImagemPerfil: dados.caminhoImagemPerfil || null,
                situacaoEmpregaticia: dados.situacaoEmpregaticia,
                dataCad: dados.dataCad,
                dataMod: dados.dataMod,
            }
        });
    }

    static async atualizarFuncionario(id: string, dados: any) {
        const result = await prisma.funcionario.updateMany({
            where: { idFuncionario: id },
            data: {
                fkIdCargo: dados.FK_idCargo,
                nomeFuncionario: dados.nomeFuncionario,
                sobrenomeFuncionario: dados.sobrenomeFuncionario,
                cpf: dados.cpf,
                email: dados.email,
                senhaHash: dados.senhaHash,
                caminhoImagemPerfil: dados.caminhoImagemPerfil || null,
                situacaoEmpregaticia: dados.situacaoEmpregaticia,
                dataMod: new Date(),
            }
        });
        return [result.count];
    }

    static async apagarFuncionario(id: string) {
        const result = await prisma.funcionario.deleteMany({
            where: { idFuncionario: id }
        });
        return result.count;
    }
}
