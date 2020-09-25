import { BaseDatabase } from "./BaseDatabase";
import { Post } from "../model/Post";


export class PostDatabase extends BaseDatabase {
    private static TABLE_NAME = 'Labook_Posts';

    public async createPost(post_id: string, user_id: string, title: string, description: string, createdAt: number): Promise<void> {
        await this.getConnection()
            .insert({
                post_id,
                user_id,
                title,
                description,
                createdAt
            }).into(PostDatabase.TABLE_NAME)
    }

    public async getPostById(postId: string): Promise<Post> {
        const result = await this.getConnection()
            .select('*')
            .from(PostDatabase.TABLE_NAME)
            .where({ post_id: postId });

        return Post.toPostModel(result[0]);
    }

    public async getPostByUserId(userId: string): Promise<Post[]> {
        const result = await this.getConnection()
            .select('*')
            .from(PostDatabase.TABLE_NAME)
            .where({ user_id: userId });

        const posts: Post[] = [];

        for (let post of result) {
            posts.push(Post.toPostModel(post));
        }

        return posts;
    }
}