import {
  Component,
  OnInit,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { concatMap } from 'rxjs';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post.component.html',
})
export class PostComponent implements OnInit {
  public postService: PostService = inject(PostService);
  public commentService: CommentService = inject(CommentService);

  public findAllPosts = this.postService.getFindAll();
  public findAllComments = this.commentService.getFindAll();
  public modal: WritableSignal<boolean> = signal<boolean>(false);
  public postContent: WritableSignal<string> = signal<string>('');
  public selectedPost: WritableSignal<number> = signal<number>(0);

  ngOnInit(): void {
    this.postService.findAll().subscribe();
  }

  toggleModal(id?: number): void {
    this.modal.set(!this.modal());

    if (id) {
      this.selectedPost.set(id);
      this.commentService.findAll(this.selectedPost()).subscribe();
    } else {
      this.selectedPost.set(0);
    }
  }

  createPost(): void {
    this.postService
      .create(this.postContent())
      .pipe(concatMap(() => this.postService.findAll()))
      .subscribe();
  }

  likePost(id: number, liked: boolean): void {
    this.postService
      .likePost(id, liked)
      .pipe(concatMap(() => this.postService.findAll()))
      .subscribe();
  }
}
