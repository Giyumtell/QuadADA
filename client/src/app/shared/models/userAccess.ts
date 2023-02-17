import { Group } from './group';
import { User } from './user';

export interface UserAccess {
  userId: User['userId'];
  groupId: Group['id'];
  creationDate: Date;
}
