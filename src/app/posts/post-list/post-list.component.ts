import { Component, OnInit, OnDestroy ,} from '@angular/core';
import { Subscription } from 'rxjs';

import { Post } from '../post.model';
import { PostService } from '../posts.service';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

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
 isLoading = false;
 totalPosts = 0;
 postsPerPage = 2;
 currentPage = 1;
 pageSizeOption = [1 , 2 , 5 , 10 ];
 userIsAuthenticated = false;
 userId: string;
 private postsSub: Subscription;
 private authStatusSub: Subscription;

  constructor(public postService: PostService, private authService: AuthService) { }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPost(this.postsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postService.getPostUpdateListener()
    .subscribe((postData: {posts: Post[], postCount: number} ) => {
      this.isLoading = false;
      this.totalPosts = postData.postCount;
      this.posts = postData.posts ;
    });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub =  this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
    });
  }

  onChangePage(pageData: PageEvent) {
    this.isLoading = true;
    // console.log(pageData);
    this.currentPage = pageData.pageIndex + 1 ;
    this.postsPerPage = pageData.pageSize;
    this.postService.getPost(this.postsPerPage, this.currentPage );
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onDelete(postId) {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPost(this.postsPerPage, this.currentPage );
    });
  }

}
