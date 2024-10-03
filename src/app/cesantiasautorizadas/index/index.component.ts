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
  providers: [CesantiasAutorizadasService],
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
        this.listarCesantias = data.authorizedCesantia; // Asegúrate de que el nombre sea correcto según la respuesta de tu API
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

  aprobarCesantia(id: number | undefined): void {
    if (!id) {
      console.error('ID de cesantía no definido');
      return;
    }

    Swal.fire({
      title: 'Aprobar Cesantía',
      text: 'Ingrese la justificación para la aprobación:',
      input: 'textarea',
      inputPlaceholder: 'Justificación...',
      showCancelButton: true,
      confirmButtonText: 'Aprobar',
      cancelButtonText: 'Cancelar',
      preConfirm: (justificacion) => {
        if (!justificacion) {
          Swal.showValidationMessage('Justificación requerida');
        }
        return justificacion;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const justificacion = result.value;

        // Llamar al servicio para aprobar la cesantía
        this.cesantiasAutorizadasServicio.aprobarCesantia(id, justificacion, this.token).subscribe(
          (data) => {
            console.log('Cesantía aprobada exitosamente:', data);
            this.cargarCesantias();
            Swal.fire('Aprobada!', 'La cesantía ha sido aprobada.', 'success');
          },
          (error) => {
            console.error('Error al aprobar la cesantía:', error);
            Swal.fire('Error!', 'No se pudo aprobar la cesantía.', 'error');
          }
        );
      }
    });
  }

  denegarCesantiaAdmin(id: number | undefined): void {
    if (!id) {
      console.error('ID de cesantía no definido');
      return;
    }

    Swal.fire({
      title: 'Denegar Cesantía',
      text: 'Ingrese la justificación para la denegación:',
      input: 'textarea',
      inputPlaceholder: 'Justificación...',
      showCancelButton: true,
      confirmButtonText: 'Denegar',
      cancelButtonText: 'Cancelar',
      preConfirm: (justificacion) => {
        if (!justificacion) {
          Swal.showValidationMessage('Justificación requerida');
        }
        return justificacion;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const justificacion = result.value;

        this.cesantiasAutorizadasServicio.denyCesantiaAdmin(id, this.token!, justificacion).subscribe(
          (data) => {
            console.log('Cesantía denegada exitosamente:', data);
            this.cargarCesantias(); // Actualizar la lista después de denegar
            Swal.fire('Denegada!', 'La cesantía ha sido denegada.', 'success');
          },
          (error) => {
            console.error('Error al denegar la cesantía:', error);
            Swal.fire('Error!', 'No se pudo denegar la cesantía.', 'error');
          }
        );
      }
    });
  }

  downloadZip(uuid: string, cedula: number): void {
    this.cesantiasAutorizadasServicio.downloadZip(uuid, this.token).subscribe((data: Blob) => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cesantias_${cedula}__${uuid}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, error => {
      console.log(error);
    });
  }

  // Redirige a la página de edición de una cesantía por su ID
  editarCesantias(id: any): void {
    this.router.navigateByUrl("/cesantias/editar/" + id);
  }
}
