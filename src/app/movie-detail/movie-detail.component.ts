import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Actor } from '../shared/_class/actor';
import { Movie } from '../shared/_class/movie';
import { MovieService } from '../shared/_services/movie.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss']
})
export class MovieDetailComponent implements OnInit, OnDestroy {

  constructor(
    private movieService:MovieService,
    private route:Router
    ) { }

  movie:Movie = new Movie();
  movieImageBaseUrl = '';
  actors:Actor[] = [];
  imageBaseUrl = '';
  flag = false;
  service = new Subscription();

  ngOnInit(): void {
    this.service = this.movieService.currentMessage
      .subscribe(message => {
        this.movie = message.movie;
        this.movieImageBaseUrl = message.imageBaseUrl;
        if(this.movie && this.movie.id !== undefined)
          this.getActors(this.movie.id);
        else{
          this.route.navigateByUrl('/');
        }
      });
  }

  ngOnDestroy(){
    this.service.unsubscribe();
  }

  getImage(base:string, path:string|undefined){
    if(path!== undefined){
      return `${base}${path}`;
    }
    return '';
  }


  getActors(id:number = 0){
    if(id !== 0){
      this.movieService.getActors(id)
      .subscribe((data:any)=>{
        this.actors = data.data
        this.imageBaseUrl = data.imageBaseUrl;
        this.flag = true;
      })
    }

  }

}
