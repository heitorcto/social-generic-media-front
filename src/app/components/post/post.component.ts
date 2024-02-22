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

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post.component.html',
})
export class PostComponent implements OnInit {
  public postService: PostService = inject(PostService);
  public findAllPosts = this.postService.getFindAll();
  public modal: WritableSignal<boolean> = signal<boolean>(false);
  public postContent: WritableSignal<string> = signal<string>('');

  ngOnInit(): void {
    this.postService.findAll().subscribe();
  }

  toggleModal(): void {
    this.modal.set(!this.modal());
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
