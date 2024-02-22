import { HttpClient } from '@angular/common/http';
import { Injectable, Signal, inject, signal } from '@angular/core';
import { Observable, shareReplay, tap } from 'rxjs';
import { Post } from '../interfaces/post';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private http = inject(HttpClient);
  private url = 'http://localhost:3000/posts';
  private posts = signal<Post[] | null>(null);

  public findAll(): Observable<Post[] | null> {
    return this.http.get<Post[]>(this.url).pipe(
      shareReplay(),
      tap((res) => this.posts.set(res)),
    );
  }

  public getFindAll(): Signal<Post[] | null> {
    return this.posts.asReadonly();
  }

  public create(content: string): Observable<Post> {
    return this.http.post<Post>(this.url, { content }).pipe(shareReplay());
  }

  public likePost(id: number, liked: boolean): Observable<Post> {
    return this.http
      .patch<Post>(`${this.url}/${id}`, { liked })
      .pipe(shareReplay());
  }
}
