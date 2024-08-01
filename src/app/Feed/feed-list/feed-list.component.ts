import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedService } from '../../servicios/feed.service';
import { Feed } from '../../modelos/feed';

import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-feed-list',
  standalone: true,
  providers: [FeedService],
  imports: [CommonModule, FormsModule],
  templateUrl: './feed-list.component.html',
  styleUrls: ['./feed-list.component.scss']
})
export class FeedListComponent {
  id: string | null;
  cargandoReferidos: boolean = false;
  token: string | null = null;
  clave: string | null = 'valor';
  feeds: any[] = [];
  

 


  constructor(private feedService: FeedService, private router: Router, private aRouter: ActivatedRoute) { 
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  navigateToCreateFeed(): void {
    this.router.navigate(['/feeds/crear']); // Navegación a la ruta deseada
  }

  

  ngOnInit(): void {
    this.recuperarToken();
    this.cargandoReferidos = true;
    this.feedService.getAllFeeds(this.token).subscribe(
      response => {
        this.feeds = response.feeds;
        this.cargandoReferidos = false;
      },
      error => {
        console.log('Error fetching feeds:', error);
        this.cargandoReferidos = false;
      }
    );
  }

  // Recupera el token del almacenamiento local
  recuperarToken(): void {
    this.token = localStorage.getItem('clave');
    if (this.token == null) {
      this.router.navigate(['/']);
    }
  }


  aliminarfeeds(id:any):void{
    this.feedService.deleteFeeds(id, this.token).subscribe(
      data=>{
        this.ngOnInit();
      },
    )
  }

}
