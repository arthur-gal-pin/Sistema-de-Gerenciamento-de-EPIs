import createMulter from '../configs/imagem.multer'

const uploadImagePerfil = createMulter({
    folder: 'imagens_perfil',
    allowedTypes: ['image/jpeg', 'image/png', 'image/jpg'],
    fileSize: 5 * 1024 * 1024 // 5MB
});

export {uploadImagePerfil};