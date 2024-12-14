import { IVoter } from '../interfaces/IVoter';
import { Comment } from './Comment';

export class Post {
  id!: string;
  user!: string;
  owner!: string;
  topic!: string;
  createdAt!: string;
  title!: string;
  description?: string;
  imageUrl?: string;
  votes!: number;
  upvoters!: IVoter[];
  downvoters!: IVoter[];
  comments!: Comment[];
}
