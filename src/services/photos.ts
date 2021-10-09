import { Photo } from '../types/Photo';
import { storage } from '../libs/firebase';
import { ref, listAll, getDownloadURL } from 'firebase/storage';


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
