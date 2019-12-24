import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({providedIn: 'root'})
export class PostService {

  private posts: Post[] = [];
  private postUpdated = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPost() {
    this.http.get<{message: string, posts: any}>('http://localhost:3000/api/posts')
    .pipe(map((postData) => {
      return postData.posts.map( post => {
        return{
          title: post.title,
          content: post.content,
          id: post._id
        };
      });
    }))
    .subscribe((transformaedposts) => {
      this.posts = transformaedposts;
      this.postUpdated.next([...this.posts]);
    });
  }

  getPostUpdateListener() {
    return this.postUpdated.asObservable();
  }

  getPost_byId(id: string) {
     return {...this.posts.find(p => p.id === id) };
  }

  updatePost(id: string, title: string, content: string) {
    const post: Post = { id: id, title: title,content: content};
    this.http.put('http://localhost:3000/api/posts/' + id, post)
    .subscribe(response => console.log(response));
  }


  addPost(title: string, content: string) {
    const post: Post = { id: null , title : title , content : content };
    this.http.post<{message : string, postId: string}>('http://localhost:3000/api/posts', post)
    .subscribe(responseData => {
      // console.log(responseData.message);
      const id = responseData.postId;
      post.id = id;
      this.posts.push(post);
      this.postUpdated.next([...this.posts]);
    });
  }

  deletePost(postId: string){
    this.http.delete("http://localhost:3000/api/posts/" + postId)
    .subscribe(()=>{
      // console.log("deleted!");
      const updatePosts = this.posts.filter(post => post.id !== postId);
      this.posts = updatePosts;
      this.postUpdated.next([...this.posts]);
    })
  }

}
