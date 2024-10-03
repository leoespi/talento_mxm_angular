import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CesantiasAutorizadasService } from '../../servicios/cesantias-autorizadas.service';
import { Cesantias } from '../../modelos/cesantias';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-index',
  standalone: true,
  providers:[CesantiasAutorizadasService],
  imports: [FormsModule, CommonModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  id: string | null;
  cargandoReferidos: boolean = false; 
  listarCesantias: Cesantias[] = [];
  token: string | null = null;
  currentPage: number = 1; // Página actual
  itemsPerPage: number = 10; // Elementos por página

  constructor(private cesantiasAutorizadasServicio: CesantiasAutorizadasService, private router: Router, private aRouter: ActivatedRoute) {
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.recuperarToken();
    this.cargarCesantias();
  }

  // Recupera el token del almacenamiento local
  recuperarToken(): void {
    this.token = localStorage.getItem('clave');
    if (this.token == null) {
      this.router.navigate(['/']);
    }
  }

  // Carga las cesantías desde el servidor
  cargarCesantias(): void {
    this.cargandoReferidos = true;
    this.cesantiasAutorizadasServicio.getCesantiasAutorizadas(this.token).subscribe(
      (data: any) => {
        console.log(data);
        this.cargandoReferidos = false;
        this.listarCesantias = data.authorizedCesantia;
      },
      err => {
        console.log(err);
        this.cargandoReferidos = false; 
      }
    );
  }

  // Devuelve las cesantías paginadas
  paginatedCesantias(): Cesantias[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.listarCesantias.slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Total de páginas
  totalPages(): number {
    return Math.ceil(this.listarCesantias.length / this.itemsPerPage);
  }

  // Cambia a la página anterior
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // Cambia a la página siguiente
  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  // Aprobar y denegar cesantías ya implementadas
  aprobarCesantia(id: number | undefined): void {
    // lógica para aprobar cesantías
  }

  denegarCesantiaAdmin(id: number | undefined): void {
    // lógica para denegar cesantías
  }

  // ... otras funciones
}
