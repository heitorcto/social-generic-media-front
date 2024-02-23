import {
  Component,
  OnInit,
  ViewChild,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { PostService } from '../../services/post.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { concatMap } from 'rxjs';
import { SkeletonComponent } from '../skeleton/skeleton.component';
import { CommentsModalComponent } from '../comments-modal/comments-modal.component';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    SkeletonComponent,
    CommentsModalComponent,
  ],
  templateUrl: './post.component.html',
})
export class PostComponent implements OnInit {
  @ViewChild(CommentsModalComponent) commentsModal!: CommentsModalComponent;

  public postService: PostService = inject(PostService);
  public findAllPosts = this.postService.getFindAll();
  public postContent: WritableSignal<string> = signal<string>('');
  public modalOpen: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit(): void {
    this.postService.findAll().subscribe();
  }

  callModalFunction(id: number): void {
    this.commentsModal.toggleModal(id);
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
