import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedService } from '../../servicios/feed.service';
import { Feed } from '../../modelos/feed';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-feed-list',
  standalone: true,
  providers: [FeedService],
  imports: [CommonModule, FormsModule],
  templateUrl: './feed-list.component.html',
  styleUrls: ['./feed-list.component.scss']
})
export class FeedListComponent implements OnInit {
  id: string | null;
  cargandoReferidos: boolean = false;
  token: string | null = null;
  clave: string | null = 'valor';
  feeds: any[] = [];

  // Paginación
  currentPage: number = 1; // Página actual
  itemsPerPage: number = 10; // Elementos por página

  constructor(private feedService: FeedService, private router: Router, private aRouter: ActivatedRoute) { 
    this.id = this.aRouter.snapshot.paramMap.get('id');
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

  // Paginación
  paginatedFeeds(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.feeds.slice(startIndex, startIndex + this.itemsPerPage);
  }

  totalPages(): number {
    return Math.ceil(this.feeds.length / this.itemsPerPage);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  aliminarfeeds(id: any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminarlo',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.feedService.deleteFeeds(id, this.token).subscribe(
          data => {
            Swal.fire(
              'Eliminado!',
              'La publicación ha sido eliminada.',
              'success'
            );
            this.ngOnInit(); // Recargar la lista
          },
          error => {
            Swal.fire(
              'Error!',
              'Hubo un problema al eliminar la publicación.',
              'error'
            );
          }
        );
      }
    });
  }

  navigateToCreateFeed(): void {
    this.router.navigate(['/feeds/crear']);
  }
}
