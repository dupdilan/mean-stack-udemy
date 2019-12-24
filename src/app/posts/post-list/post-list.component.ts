import { Component, OnInit, OnDestroy ,} from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostService } from '../posts.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   {title: 'first Post', content: 'this is the first post\'s content'},
  //   {title: 'second Post', content: 'this is the second post\'s content'},
  //   {title: 'third Post', content: 'this is the third post\'s content'}
  // ];
 posts: Post[] = [];
 private postsSub: Subscription;

  constructor(public postService: PostService) { }

  ngOnInit() {
    this.postService.getPost();
    this.postsSub = this.postService.getPostUpdateListener()
    .subscribe((posts: Post[]) => {
      this.posts = posts;
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
  }

  onDelete(postId) {
    this.postService.deletePost(postId);
  }

}
