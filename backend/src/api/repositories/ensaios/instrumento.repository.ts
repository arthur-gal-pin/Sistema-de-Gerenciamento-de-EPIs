import { prisma } from '../../configs/Database';
import { IInstrumento } from '../../models/ensaios/dados/Instrumento';

export default class InstrumentoRepository {
    /**
     * Cria um novo protocolo
     */
    static async create(data: IInstrumento) {
        return await prisma.instrumento.create({
            data: {
                idInstrumento: data.idInstrumento ?? undefined,
                nomeInstrumento: data.nomeInstrumento,
                funcaoInstrumento: data.funcaoInstrumento,
                ultimaCalibracao: data.ultimaCalibracao,
                dataCad: data.dataCad, 
                dataMod: data.dataMod
            }
        });
    };

    static async update(id: string, data: Partial<IInstrumento>){
        const result =  await prisma.instrumento.updateMany({
            where: {idInstrumento: id},
            data: {
                nomeInstrumento: data.nomeInstrumento,
                funcaoInstrumento: data.funcaoInstrumento,
                ultimaCalibracao: data.ultimaCalibracao,
                dataCad: data.dataCad, 
                dataMod: new Date()
            }
        });
        return result.count > 0;
    }

    static async findAll(){
        return await prisma.instrumento.findMany();
    };

    static async findById(id: string) {
        return await prisma.instrumento.findUnique({
            where: {idInstrumento: id}
        });
    };

    static async findByFunction(context: string) {
        return await prisma.instrumento.findMany({
            where: {funcaoInstrumento: {
                contains: `${context}`
            }}
        });
    }

    static async findByCalibration(date: Date) {
        return await prisma.instrumento.findMany({
            where: {ultimaCalibracao:  date}
        });
    }

    static async delete(id: string){
        const result = await prisma.protocolo.delete({
            where: {idProtocolo: id}
        });
        return result;
    }
}