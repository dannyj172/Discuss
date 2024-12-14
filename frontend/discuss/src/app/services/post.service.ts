import { Injectable } from '@angular/core';
import { Post } from '../shared/models/Post';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  POST_BY_ID_URL,
  POST_CREATE_URL,
  POST_EDIT_URL,
  POSTS_BY_SEARCH_URL,
  POSTS_BY_TOPIC_URL,
  POSTS_URL,
} from '../shared/constants/urls';

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
}
