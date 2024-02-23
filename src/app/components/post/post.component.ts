import {
  Component,
  OnInit,
  ViewChild,
  WritableSignal,
  inject,
  signal,
} from '@angular/core';
import { PostService } from '../../services/post.service';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { concatMap } from 'rxjs';
import { SkeletonComponent } from '../skeleton/skeleton.component';
import { CommentsModalComponent } from '../comments-modal/comments-modal.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [
    DatePipe,
    FormsModule,
    SkeletonComponent,
    CommentsModalComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './post.component.html',
})
export class PostComponent implements OnInit {
  public postService: PostService = inject(PostService);

  @ViewChild(CommentsModalComponent) commentsModal!: CommentsModalComponent;

  public findAllPosts = this.postService.getFindAll();

  public modalOpen: WritableSignal<boolean> = signal<boolean>(false);

  public postContent: FormControl<string | null> = new FormControl<
    string | null
  >('', [Validators.minLength(5), Validators.required]);

  ngOnInit(): void {
    this.postService.findAll().subscribe();
  }

  callModalFunction(id: number): void {
    this.commentsModal.toggleModal(id);
  }

  createPost(): void {
    if (this.postContent.valid) {
      this.postService
        .create(String(this.postContent.value))
        .pipe(concatMap(() => this.postService.findAll()))
        .subscribe();
    }
  }

  likePost(id: number, liked: boolean): void {
    this.postService
      .likePost(id, liked)
      .pipe(concatMap(() => this.postService.findAll()))
      .subscribe();
  }
}
