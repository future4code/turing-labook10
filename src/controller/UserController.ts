import { Request, Response } from "express";
import { Authenticator } from "../services/Authenticator";
import { UserDatabase } from "../data/UserDatabase";
import { UsersRelationDatabase } from "../data/UsersRelationDatabase";
import { UserBusiness } from "../business/UserBusiness";
import { SignupInputDTO } from "../model/User";
import { BaseDatabase } from "../data/BaseDatabase";

export default class UserController {

    public addFriendship = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization as string;
            const friendshipId = req.body.friendshipId;

            const authenticator = new Authenticator();
            const authenticationData = authenticator.getData(token);
            const userId = authenticationData.id;

            if (!friendshipId) {
                throw new Error('Insira um id válido')
            }

            const userDataBase = new UserDatabase();
            const user = await userDataBase.getUserById(friendshipId);

            if (!user) {
                throw new Error('Usuário não existe')
            }

            const usersRelationDatabase = new UsersRelationDatabase();
            await usersRelationDatabase.addFriendship(
                userId,
                friendshipId
            );

            res.status(200).send({
                message: 'Amigo adicionado com sucesso'
            })
        } catch (e) {
            res.status(400).send({
                message: e.message
            })
        }
        await BaseDatabase.destroyConnection();
    };

    public getUser = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization as string;
            const id = req.params.id as any;

            const authenticator = new Authenticator();
            authenticator.getData(token);

            const userDataBase = new UserDatabase();
            const user = await userDataBase.getUserById(id);

            res.status(200).send(user
            )
        } catch (e) {
            res.status(400).send({
                message: e.message
            })
        }
        await BaseDatabase.destroyConnection();
    };

    public getUserProfile = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization as string;

            const userBusiness = new UserBusiness();
            const user = await userBusiness.getUserProfile(token);

            res.status(200).send(user);

        } catch (e) {
            res.status(400).send({
                message: e.message
            })
        }
        await BaseDatabase.destroyConnection();
    };

    public login = async (req: Request, res: Response) => {
        try {

            const email = req.body.email;
            const password = req.body.password;

            const userBusiness = new UserBusiness();
            const token = await userBusiness.login(email, password);

            res.status(200).send({
                message: 'Usuário logado com sucesso',
                token
            });

        } catch (e) {
            res.status(400).send({
                message: e.message
            })
        }
        await BaseDatabase.destroyConnection();
    };

    public signUp = async (req: Request, res: Response) => {
        try {

            const input: SignupInputDTO = {
                name: req.body.name,
                email: req.body.email,
                password: req.body.password
            }


            const userBusiness = new UserBusiness();
            const token = await userBusiness.signUp(input.name, input.email, input.password);

            res.status(200).send({
                message: 'Usuário criado com sucesso',
                token
            });


        } catch (e) {
            res.status(400).send({
                message: e.message
            })
        }
        await BaseDatabase.destroyConnection();
    };

    public undoFriendship = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization as string;
            const friendshipToUndoId = req.body.friendshipToUndoId;

            const authenticator = new Authenticator();
            const authenticationData = authenticator.getData(token);
            const userId = authenticationData.id;

            if (!friendshipToUndoId) {
                throw new Error('Insira um id válido')
            }

            const userDataBase = new UserDatabase();
            const user = await userDataBase.getUserById(friendshipToUndoId);

            if (!user) {
                throw new Error('Usuário não existe')
            }

            const usersRelationDatabase = new UsersRelationDatabase();
            await usersRelationDatabase.undoFriendship(
                userId,
                friendshipToUndoId
            );

            res.status(200).send({
                message: 'Você desfez a amizade com sucesso'
            })
        } catch (e) {
            res.status(400).send({
                message: e.message
            })
        }
        await BaseDatabase.destroyConnection();
    };
}