import { Photo } from '../types/Photo';
import { storage } from '../libs/firebase';
import { ref, listAll, getDownloadURL, uploadBytes } from 'firebase/storage';
import {v4 as createId} from 'uuid';


export const getAll = async () => {
    
    /** Cria o array onde será armazenado as photos */
    let list: Photo[] = [];


    /** Cria a referência da pasta do firebase a qual irei ler o seu conteúdo */
    const imagesFolder = ref(storage, "images");

    
    /** Lê os arquivos que estão na pasta referenciada */
    const photoList = await listAll(imagesFolder);


    /** Realizo um loop nesses arquivos, no caso em photList (contém o resultado da busca) */
    for(let i in photoList.items) {

        /** Pega o link direto para acessar a foto */
        let photoUrl = await getDownloadURL(photoList.items[i]);

        /** Monto o array com as informações da foto */
        list.push({
            name: photoList.items[i].name,
            url: photoUrl,
        });
    }
    
    /** Ao final de tudo retorno a lista de fotos encontradas na pasta referenciada no firebase */
    return list;
}


export const insert = async (file: File) => {
    if(['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {

        /** Gera nome aleatório */
        let randomName = createId();
        let newFile = ref(storage, `images/${randomName}`);

        /** Faz o upload do arquivo */
        let upload = await uploadBytes(newFile, file);
        let photoUrl = await getDownloadURL(upload.ref);

        return { name: upload.ref.name, url: photoUrl } as Photo;
    } else {
        return new Error('Tipo de arquivo não permitido.');
    }
}
