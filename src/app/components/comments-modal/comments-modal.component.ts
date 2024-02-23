import { Component, WritableSignal, inject, signal } from '@angular/core';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-comments-modal',
  standalone: true,
  imports: [],
  templateUrl: './comments-modal.component.html',
})
export class CommentsModalComponent {
  public commentService: CommentService = inject(CommentService);
  public findAllComments = this.commentService.getFindAll();
  public selectedPost: WritableSignal<number> = signal<number>(0);
  public modal: WritableSignal<boolean> = signal<boolean>(false);

  toggleModal(id?: number): void {
    this.modal.set(!this.modal());

    if (id) {
      this.selectedPost.set(id);
      this.commentService.findAll(this.selectedPost()).subscribe();
    } else {
      this.selectedPost.set(0);
    }
  }
}
