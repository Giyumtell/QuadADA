import { Group } from './group';
import { User } from './user';
import { UserAccess } from './userAccess';

export interface Data {
  users: User[];
  groups: Group[];
  userAccesses: UserAccess[];
}
