import { Authenticator } from "../services/Authenticator";
import { PostDatabase } from "../data/PostDatabase";
import { SearchPostDTO } from "../model/Post";

export class PostBusiness {

    public async getPostInfoAndUserName(token: string) {

        const authenticator = new Authenticator();
        authenticator.verify(token);

        const postDatabase = new PostDatabase();
        const posts = await postDatabase.getPostInfoAndUserName();

        return posts;

    }

    public async searchPost(searchData:SearchPostDTO){
        const validOrderByValues = ["title", "createdAt"]
        const validOrderTypeValues = ["ASC", "DESC"]

        if(!validOrderByValues.includes(searchData.orderBy)){
            throw new Error("Valores para \"orderBy\" devem ser \"title\" ou \"createdAt\"")
        }

        if(!validOrderTypeValues.includes(searchData.orderType)){
            throw new Error("Valores para \"orderType\" devem ser \"ASC\" ou \"DESC\"")
        }

        if(!searchData.title){
            throw new Error("Informe um valor para \"title\"")
        }

        if(searchData.page < 0){
            throw new Error("Número da página deve ser maior que zero")
        }

        const result = await new PostDatabase().searchPost(searchData)

        if(!result.length){
            throw new Error("Nenhum post encontrado")
        }

        return result
    }
}