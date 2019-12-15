import { Component, OnInit , Input} from '@angular/core';

import { Post } from '../post.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  // posts = [
  //   {title: 'first Post', content: 'this is the first post\'s content'},
  //   {title: 'second Post', content: 'this is the second post\'s content'},
  //   {title: 'third Post', content: 'this is the third post\'s content'}
  // ];
  @Input() posts: Post[] = [];

  constructor() { }

  ngOnInit() {
  }

}
