import { IdGenerator } from "../services/IdGenerator";
import { HashManager } from "../services/HashManager";
import { Authenticator } from "../services/Authenticator";
import { UserDatabase } from "../data/UserDatabase";

export class UserBusiness {

    public async signUp(name: string, email: string, password: string): Promise<string> {

        if (!name || !email || !password) {
            throw new Error('Insira todas as informações necessárias para o cadastro');
        }

        if (password.length < 6) {
            throw new Error('A senha deve conter no mínimo seis caracteres');
        }

        const idGenerator = new IdGenerator();
        const id = idGenerator.generateId();

        const hashManager = new HashManager();
        const hashPassword = await hashManager.hash(password);

        const userDataBase = new UserDatabase(); 
        await userDataBase.signUp(
            id,
            name,
            email,
            hashPassword
        );

        const authenticator = new Authenticator();
        const token = authenticator.generateToken({ id });

        return token;
    }

    public async login(email: string, password: string): Promise<string> {

        const userDataBase = new UserDatabase();
        const user = await userDataBase.getUserByEmail(email);

        const hashManager = new HashManager();
        const isPasswordCorrect = await hashManager.compare(password, user.password);

        if (!isPasswordCorrect) {
            throw new Error('Usuário ou senha incorretos');
        }

        const authenticator = new Authenticator();
        const token = authenticator.generateToken({
            id: user.id
        });

        return token;
    }

    public async getUserProfile(token: string): Promise<any> {

        const authenticator = new Authenticator();
        const authenticationData = authenticator.getData(token);

        const userDataBase = new UserDatabase();
        const user = await userDataBase.getUserById(authenticationData.id);

        return user;

    }

}