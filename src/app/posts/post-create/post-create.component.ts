import { Component, OnInit, } from '@angular/core';

import { NgForm } from '@angular/forms';
import { PostService } from '../posts.service';
import { ActivatedRoute } from '@angular/router';
import { Post } from '../post.model';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredContent = '';
  enteredTitle = '';
  public post: Post;

  private mode = 'create';
   private postId: string ;

  constructor(public postService: PostService , public route: ActivatedRoute) { }


  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        // console.log(this.postId);
        this.post = this.postService.getPost_byId(this.postId);

      } else {
        this.mode = 'create';
        this.postId = null ;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if( this.mode === 'create'){
      this.postService.addPost(form.value.title, form.value.content );

    } else {
      this.postService.updatePost(this.postId, form.value.title, form.value.content);
    }
    form.resetForm();
  }

}
