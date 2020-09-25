import { Request, Response } from 'express'
import { SearchPostDTO } from '../model/Post'
import moment from 'moment';
import { PostBusiness } from '../business/PostBusiness';
import { FeedDatabase } from '../data/FeedDatabase';
import { PostDatabase } from "../data/PostDatabase";
import { Authenticator } from "../services/Authenticator";
import { IdGenerator } from '../services/IdGenerator';
import { BaseDatabase } from '../data/BaseDatabase';

export default class PostController {

    public createPost = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization as string;
            const authenticator = new Authenticator();
            const authenticationData = authenticator.verify(token);
            const userId = authenticationData.id;

            const idGenerator = new IdGenerator();
            const postId = idGenerator.generateId();

            const { title, description } = req.body;
            const creationDate = Date.now();

            const postDatabase = new PostDatabase();
            await postDatabase.createPost(
                postId,
                userId,
                title,
                description,
                creationDate
            );
            res.status(200).send({
                message: 'Post criado com sucesso'
            })
        } catch (e) {
            res.status(400).send({
                message: e.message
            })
        }
        await BaseDatabase.destroyConnection();
    };

    public getFeed = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization as string;
            const authenticator = new Authenticator();
            const authenticationData = authenticator.verify(token);
            const userId = authenticationData.id;

            const feedDatabase = new FeedDatabase();
            const feed = await feedDatabase.getFeed(userId);
            const mappedFeed = feed.map((item: any) => ({
                id: item.recipe_id,
                title: item.title,
                description: item.description,
                createdAt: moment(item.createdAt).format('DD/MM/YYYY'),
                userId: item.id,
                userName: item.name
            }));
            res.status(200).send(mappedFeed);
        } catch (e) {
            res.status(400).send({
                message: e.message
            })
        }
        await BaseDatabase.destroyConnection();
    };

    public getPost = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization as string;
            const postId = req.params.id as any;

            const authenticator = new Authenticator();
            authenticator.verify(token);

            const postDatabase = new PostDatabase();
            const post = await postDatabase.getPostById(postId);

            const postDate = moment(post.getCreatedAt()).format('DD/MM/YYYY');

            res.status(200).send({
                id: post.getId(),
                title: post.getTitle(),
                description: post.getDescription(),
                createdAt: postDate
            })
        } catch (e) {
            res.status(400).send({
                message: e.message
            })
        }
        await BaseDatabase.destroyConnection();
    };

    public getPostInfoAndUserName = async (req: Request, res: Response) => {
        try {

            const token = req.headers.authorization!;

            const postBusiness = new PostBusiness();
            const posts = await postBusiness.getPostInfoAndUserName(token);

            res.status(200).send(posts);
        } catch (e) {
            res.status(400).send({
                message: e.message
            })
        }
        await BaseDatabase.destroyConnection();
    };

    public searchPost = async (req: Request, res: Response) => {
        try {
            const searchData: SearchPostDTO = {
                title: req.query.title as string,
                orderBy: req.query.orderBy as string || "createdAt",
                orderType: req.query.orderType as string || "ASC",
                page: Number(req.query.page) || 1
            }
             
            const result = await new PostBusiness().searchPost(searchData)

            res.status(200).send(result)
        } catch (error) {
            res.status(400).send(error.message)
        }
    }
}