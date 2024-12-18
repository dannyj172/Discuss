import { Injectable } from '@angular/core';
import { Post } from '../shared/models/Post';
import { Comment } from '../shared/models/Comment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  POST_BY_ID_URL,
  POST_COMMENT_DELETE_URL,
  POST_COMMENT_URL,
  POST_CREATE_URL,
  POST_DELETE_URL,
  POST_DOWNVOTE_URL,
  POST_EDIT_URL,
  POST_UPVOTE_URL,
  POSTS_BY_SEARCH_URL,
  POSTS_BY_TOPIC_URL,
  POSTS_BY_USER_URL,
  POSTS_URL,
} from '../shared/constants/urls';
import { User } from '../shared/models/User';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<Post[]> {
    return this.http.get<Post[]>(POSTS_URL);
  }

  getAllPostsByTopicName(topicName: string): Observable<Post[]> {
    return this.http.get<Post[]>(POSTS_BY_TOPIC_URL + topicName);
  }

  getAllPostsBySearchTerm(searchTerm: string): Observable<Post[]> {
    return this.http.get<Post[]>(POSTS_BY_SEARCH_URL + searchTerm);
  }

  getPostById(id: string): Observable<Post> {
    return this.http.get<Post>(POST_BY_ID_URL + id);
  }

  createPost(post: any): Observable<Post> {
    return this.http.post<Post>(POST_CREATE_URL, post);
  }

  editPost(post: any, postId: string): Observable<Post> {
    return this.http.post<Post>(POST_BY_ID_URL + postId + POST_EDIT_URL, post);
  }

  deletePost(postId: string): Observable<any> {
    return this.http.delete<any>(POST_BY_ID_URL + postId + POST_DELETE_URL);
  }

  comment(postId: string, commentInfo: Comment): Observable<Post> {
    return this.http.post<Post>(
      POST_BY_ID_URL + postId + POST_COMMENT_URL,
      commentInfo
    );
  }

  deleteComment(postId: string, commentId: string): Observable<Post> {
    return this.http.post<Post>(
      POST_BY_ID_URL + postId + POST_COMMENT_DELETE_URL + commentId,
      null
    );
  }

  getAllPostsByUser(username: string): Observable<Post[]> {
    return this.http.get<Post[]>(POSTS_BY_USER_URL + username);
  }

  upvote(postId: string, userId: string): Observable<Post> {
    return this.http.post<Post>(POST_BY_ID_URL + postId + POST_UPVOTE_URL, {
      userId,
    });
  }

  downvote(postId: string, userId: string): Observable<Post> {
    return this.http.post<Post>(POST_BY_ID_URL + postId + POST_DOWNVOTE_URL, {
      userId,
    });
  }
}
