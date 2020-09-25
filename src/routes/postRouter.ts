import express from "express";
import PostController from "../controller/PostController";

export const postRouter = express.Router();

const postController = new PostController()

postRouter.post('/', postController.createPost);
postRouter.get('/search', postController.searchPost)
postRouter.get('/feed', postController.getFeed);
postRouter.get('/:id', postController.getPost);
postRouter.get('/', postController.getPostInfoAndUserName);