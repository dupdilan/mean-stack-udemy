import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { environment } from '../../environments/environment';


const BACKEDN_URL = environment.apiUrl +"/posts/";

@Injectable({providedIn: 'root'})
export class PostService {

  private posts: Post[] = [];
  private postUpdated = new Subject<{posts: Post[], postCount: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPost(postsPerPage: number , currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;
    this.http.get<{message: string, posts: any, maxPost: number}>( BACKEDN_URL + queryParams)
    .pipe(
      map((postData) => {
      return {posts : postData.posts.map( post => {
        return{
          title: post.title,
          content: post.content,
          id: post._id,
          imagePath: post.imagePath,
          creator: post.creator
        };
      }), maxPosts : postData.maxPost};
    }))
    .subscribe((transformaedpostData) => {
      // console.log(transformaedpostData);
      this.posts = transformaedpostData.posts;
      this.postUpdated.next({
        posts : [...this.posts] ,
         postCount : transformaedpostData.maxPosts
        });
    });
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  getPost_byId(id: string) {
     return this.http.get<{
       _id: string ;
        title: string ;
        content: string;
        imagePath: string;
        creator: string;
        }>(BACKEDN_URL + id );
  }

  updatePost(id: string, title: string, content: string, image : File | string) {
    // const post: Post = { id: id, title: title,content: content, imagePath: null};
    let postData: Post | FormData ;

    if (typeof(image) === 'object'){
       postData = new FormData();
       postData.append("id",id);
      postData.append("title", title);
      postData.append("content", content),
      postData.append("image", image, title)
    } else {
       postData = {
        id: id,
        title: title,
        content: content,
        imagePath: image,
        creator: null
      }
    }
    this.http.put( BACKEDN_URL + id, postData)
    .subscribe(response => {
      this.router.navigate(["/"]);
    });
  }


  addPost(title: string, content: string, image: File) {
    // const post: Post = { id: null , title : title , content : content };
    const postData = new FormData();
    postData.append("title", title);
    postData.append("content", content);
    postData.append("image", image, title);

    this.http.post<{message: string, post: Post}>(BACKEDN_URL, postData)
    .subscribe(responseData => {
      // console.log(responseData.message);
      this.router.navigate(["/"]);
    });
  }

  deletePost(postId: string){
    return this.http.delete( BACKEDN_URL + postId);
  }

}
