import { Pipe, PipeTransform } from '@angular/core';
import { Post } from '../models/Post';

@Pipe({
  name: 'hasDownvoted',
})
export class hasDownvotedPipe implements PipeTransform {
  transform(post: Post, currentUserId: string): any {
    const hasDownvoted = post.downvoters.find((voter) => {
      return voter.voterId === currentUserId;
    });
    if (hasDownvoted) {
      return true;
    } else return false;
  }
}
