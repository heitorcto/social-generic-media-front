import { Component, WritableSignal, inject, signal } from '@angular/core';
import { CommentService } from '../../services/comment.service';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { concatMap } from 'rxjs';

@Component({
  selector: 'app-comments-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './comments-modal.component.html',
})
export class CommentsModalComponent {
  public commentService: CommentService = inject(CommentService);
  public findAllComments = this.commentService.getFindAll();
  public selectedPost: WritableSignal<number> = signal<number>(0);
  public modal: WritableSignal<boolean> = signal<boolean>(false);
  public commentContent: FormControl = new FormControl<string>('', [
    Validators.required,
    Validators.minLength(5),
  ]);

  toggleModal(id?: number): void {
    this.modal.set(!this.modal());
    this.commentContent.setValue('');

    if (id) {
      this.selectedPost.set(id);
      this.commentService.findAll(this.selectedPost()).subscribe();
    } else {
      this.selectedPost.set(0);
    }
  }

  postComment() {
    if (this.commentContent.valid) {
      this.commentService
        .createComment(this.selectedPost(), this.commentContent.value)
        .pipe(concatMap(() => this.commentService.findAll(this.selectedPost())))
        .subscribe();
      this.commentContent.setValue('');
    }
  }
}
