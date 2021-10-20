import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Movie } from '../shared/_class/movie';
import { AuthService } from '../shared/_services/auth.service';
import { MovieService } from '../shared/_services/movie.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private movieService: MovieService,
    private route: Router
  ) { }

  popularMovies: Movie[] = [];
  popularMoviesShow: Movie[] = [];
  playingMovies: Movie[] = [];
  playingMoviesShow: Movie[] = [];
  mapMoviesShow: any[] = [];
  subLogin: any;
  popularMoviesPage = 1;
  playingNowMoviesPage = 1;
  imageBaseUrlPlayingMovies = '';
  imageBaseUrlPopularMovies = '';
  popularMoviesTotal = 0;
  playingMoviesTotal = 0;
  perPage = 20;
  data: any;

  ngOnInit(): void {
    
    if (this.authService.isValid) {
      this.getData();
    }

    this.subLogin = this.authService.onLoginSuccess.subscribe(() => {
      this.getData();
    });
  }

  ngOnDestroy() {
    this.subLogin.unsubscribe();
  }

  getData() {
    if (this.playingMoviesTotal === 0)
      this.getNowPlayedMovies();
    if (this.popularMoviesTotal === 0)
      this.getPopularsMovies();
  }

  getNowPlayedMovies() {
    this.movieService.getNowPlayings({ page: this.playingNowMoviesPage })
      .subscribe((data: any) => {
        this.playingMovies = data.data;
        this.playingMoviesTotal += this.playingMovies.length;
        this.imageBaseUrlPlayingMovies = data.imageBaseUrl;
        this.mapMovies(this.playingMovies);
      })
  }

  getPopularsMovies() {
    this.movieService.getPopulars({ page: this.popularMoviesPage })
      .subscribe((data: any) => {
        this.popularMovies = data.data;
        this.popularMoviesTotal += this.popularMovies.length;
        this.imageBaseUrlPopularMovies = data.imageBaseUrl;
        this.popularMoviesShow.push(...this.popularMovies);
      })
  }

  getImage(resource: Movie, type: number) {
    if (type === 0) {
      return `${this.imageBaseUrlPlayingMovies}${resource.backdrop_path}`
    }
    else {
      return `${this.imageBaseUrlPopularMovies}${resource.backdrop_path}`
    }

  }
  onSlid(event:any){
    let page = parseInt(event.current);
    if((page+1)%5===0 && ((page+1)/5) == this.playingNowMoviesPage ){
      this.onHorizontalScroll();
    }
  }

  onVerticalScroll() {
    this.popularMoviesPage++;
    this.getPopularsMovies();
  }

  onHorizontalScroll() {
    this.playingNowMoviesPage++;
    this.getNowPlayedMovies();
  }

  viewDetail(movie: Movie, type: number) {
    let base = (type === 0) ? this.imageBaseUrlPlayingMovies : this.imageBaseUrlPopularMovies;
    this.movieService.changeMessage({ movie, imageBaseUrl: base });
    this.route.navigateByUrl(`/movie/${movie.id}`)
  }

  mapMovies(arr: any[]) {
    while (arr.length > 0) {
      this.mapMoviesShow.push(arr.splice(0, 4))
    }
  }
}
