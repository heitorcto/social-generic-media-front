import { Injectable, Signal, inject, signal } from '@angular/core';
import { Comment } from '../interfaces/comment';
import { Observable, shareReplay, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  private http = inject(HttpClient);
  private url = 'http://localhost:3000/comments';
  private comments = signal<Comment[] | null>(null);

  public findAll(post_id: number) {
    return this.http.get<Comment[] | null>(`${this.url}/${post_id}`).pipe(
      shareReplay(),
      tap((res) => this.comments.set(res)),
    );
  }

  public getFindAll(): Signal<Comment[] | null> {
    return this.comments.asReadonly();
  }

  public createComment(post_id: number, content: string): Observable<Comment> {
    return this.http
      .post<Comment>(this.url, { post_id, content })
      .pipe(shareReplay());
  }
}
