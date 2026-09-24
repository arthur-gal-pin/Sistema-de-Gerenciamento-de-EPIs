import { prisma } from '../../configs/Database';
import {ITipoEnsaio} from '../../models/ensaios/dados/TipoEnsaio';
import { enumClassificacaoAmostra } from '../../enum/amostras/classificacaoAmostra.enum';

export default class TipoEnsaioRepository {
    /**
     * Cria um novo protocolo
     */
    static async create(data: ITipoEnsaio) {
        return await prisma.tipoEnsaio.create({
            data: {
                idTipoEnsaio: data.idTipoEnsaio ?? undefined,
                nomeEnsaio: data.nomeEnsaio,
                descricao: data.descricaoEnsaio,
                categoriaAplicavel: data.categoriaAplicavel,
                dataCad: data.dataCad, 
                dataMod: data.dataMod
            }
        });
    };

    static async update(id: string, data: Partial<ITipoEnsaio>){
        const result =  await prisma.tipoEnsaio.updateMany({
            where: {idTipoEnsaio: id},
            data: {
                nomeEnsaio: data.nomeEnsaio,
                descricao: data.descricaoEnsaio,
                categoriaAplicavel: data.categoriaAplicavel,
                dataCad: data.dataCad, 
                dataMod: new Date()
            }
        });
        return result.count > 0;
    }

    static async findAll(){
        return await prisma.tipoEnsaio.findMany();
    };

    static async findById(id: string) {
        return await prisma.tipoEnsaio.findUnique({
            where: {idTipoEnsaio: id}
        });
    };

    static async findByDescription(context: string) {
        return await prisma.tipoEnsaio.findMany({
            where: {descricao: {
                contains: `${context}`
            }}
        });
    }

    static async findByCategory(category: enumClassificacaoAmostra) {
        return await prisma.tipoEnsaio.findMany({
            where: {categoriaAplicavel:  category}
        });
    }

    static async delete(id: string){
        const result = await prisma.tipoEnsaio.delete({
            where: {idTipoEnsaio: id}
        });
        return result;
    }
}