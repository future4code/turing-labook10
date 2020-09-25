import { BaseDatabase } from "./BaseDatabase";

export class UsersRelationDatabase extends BaseDatabase{
  private static TABLE_NAME = 'Labook_Users_Relation';

  public async addFriendship(userId:string, friendshipId: string): Promise<void> {
    await this.getConnection()
      .insert({
        user_id: userId,
        friend_id: friendshipId
      }).into(UsersRelationDatabase.TABLE_NAME)
  }

  public async undoFriendship(userId:string, undoFriendshipId: string): Promise<void> {
    await this.getConnection()
      .del()
      .from(UsersRelationDatabase.TABLE_NAME)
      .where({
        user_id: userId,
        friend_id: undoFriendshipId
      });
  }
  
}