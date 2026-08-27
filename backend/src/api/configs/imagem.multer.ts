import multer, { FileFilterCallback } from 'multer'
import { Request } from 'express'
import path from 'path'
import crypto from 'crypto'
import fs from 'fs'

interface MulterConfig {
    folder: string
    allowedTypes: string[]
    fileSize: number
}

const baseUploadDir = path.resolve(process.cwd(), 'uploads')

const verificaDir = (dir: string): void => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
    }
}

const createMulter = ({ folder, allowedTypes, fileSize }: MulterConfig) => {

    const uploadDir = path.join(baseUploadDir, folder)
    verificaDir(uploadDir)

    const storage = multer.diskStorage({
        destination: (req: Request, file, cb) => {
            cb(null, uploadDir)
        },
        filename: (req: Request, file, cb) => {
            const hash = crypto.randomBytes(12).toString('hex')
            cb(null, `${hash}-${file.originalname}`)
        }
    })

    const fileFilter = (
        req: Request,
        file: Express.Multer.File,
        cb: FileFilterCallback
    ) => {
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error('Tipo de arquivo não permitido.'))
        }
        cb(null, true)
    }

    return multer({
        storage,
        limits: { fileSize },
        fileFilter
    })
}

export default createMulter;