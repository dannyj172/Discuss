import { Pipe, PipeTransform } from '@angular/core';
import { Post } from '../models/Post';

@Pipe({
  name: 'hasUpvoted',
})
export class hasUpvotedPipe implements PipeTransform {
  transform(post: Post, currentUserId: string): any {
    const hasUpvoted = post.upvoters.find((voter) => {
      return voter.voterId === currentUserId;
    });
    if (hasUpvoted) {
      return true;
    } else return false;
  }
}
