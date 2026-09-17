import { prisma } from '../../configs/Database';
import { IProtocolo } from '../../models/ensaios/Protocolo';
import { enumTipoProtocolo } from '../../enum/ensaios/tipoProtocolo.enum';

export default class ProtocoloRepository {
    /**
     * Cria um novo protocolo
     */
    static async create(data: IProtocolo) {
        return await prisma.protocolo.create({
            data: {
                idProtocolo: data.idProtocolo ?? undefined,
                fkIdOcp: data.FK_idOCP,
                fkIdEmpresa: data.FK_idEmpresa,
                nomeProtocolo: data.nomeProtocolo,
                numeroProtocolo: data.numeroProtocolo,
                numeroSEI: data.numeroSEI,
                tipoProtocolo: data.tipoProtocolo,
                diaAbertura: data.diaAbertura,
                diaEntrega: data.diaEntrega ? new Date(data.diaEntrega) : undefined,
                dataCad: data.dataCad, 
                dataMod: data.dataMod
            }
        });
    };

    static async update(id: string, data: Partial<IProtocolo>){
        const result =  await prisma.protocolo.updateMany({
            where: {idProtocolo: id},
            data: {
                fkIdOcp: data.FK_idOCP,
                fkIdEmpresa: data.FK_idEmpresa,
                nomeProtocolo: data.nomeProtocolo,
                numeroProtocolo: data.numeroProtocolo,
                numeroSEI: data.numeroSEI,
                tipoProtocolo: data.tipoProtocolo,
                diaAbertura: data.diaAbertura,
                diaEntrega: data.diaEntrega,
                dataCad: data.dataCad, 
                dataMod: new Date()
            }
        });
        return result.count > 0;
    }

    static async findAll(){
        return await prisma.protocolo.findMany();
    };

    static async findById(id: string) {
        return await prisma.protocolo.findUnique({
            where: {idProtocolo: id}
        })
    };

    static async findBySEI(SEI: string) {
        return await prisma.protocolo.findUnique({
            where: {numeroSEI: SEI}
        });
    }

    static async findByCode(code: string) {
        return await prisma.protocolo.findUnique({
            where: {numeroProtocolo: code}
        });
    }

    static async delete(id: string){
        const result = await prisma.protocolo.delete({
            where: {idProtocolo: id}
        });
        return result;
    }

    static async findByType(type: enumTipoProtocolo){
        return await prisma.protocolo.findMany({
            where: {tipoProtocolo: type}
        });
    }
}