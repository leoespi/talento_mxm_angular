import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedService } from '../../servicios/feed.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Feed, FeedImage } from '../../modelos/feed';
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

    const baseUrl = 'http://localhost:8000'; // Base URL del backend

    this.feedService.getAllFeeds(this.token).subscribe(
        response => {
            this.feeds = response.feeds;

            // Ordenar los feeds por el id de mayor a menor
            this.feeds.sort((a, b) => b.id - a.id); // Suponiendo que "id" es un número

            this.feeds.forEach(feed => {
                if (feed.image_path) {
                    feed.image_path = `${baseUrl}${feed.image_path}`; // Solo una vez
                }
                if (feed.images) {
                    feed.images.forEach((image: FeedImage) => {
                        image.image_path = `${baseUrl}${image.image_path}`; // Solo una vez
                    });
                }
            });

            this.cargandoReferidos = false;
        },
        error => {
            console.log('Error fetching feeds:', error);
            this.cargandoReferidos = false;
        }
    );
}


  mostrarImagen(imagePath: string): void {
    Swal.fire({
      title: 'Imagen de Publicación',
      html: `
        <div class="flex flex-col items-center">
          <img src="${imagePath}" alt="Imagen" style="width: 100%; height: auto; max-width: 500px;" />
          <button id="viewInTab" class="bg-blue-600 text-white rounded-md px-4 py-2 mt-4">Visualizar en Pestaña</button>
        </div>
      `,
      showCloseButton: true,
      showConfirmButton: false,
      width: '80%',
      padding: '1rem',
      willOpen: () => {
        const viewInTabButton = document.getElementById('viewInTab');
        if (viewInTabButton) {
          viewInTabButton.onclick = () => {
            window.open(imagePath, '_blank'); // Abre la imagen en una nueva pestaña
          };
        }
      }
    });
  }
  
  

  recuperarToken(): void {
    this.token = localStorage.getItem('clave');
    if (this.token == null) {
      this.router.navigate(['/']);
    }
  }

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
