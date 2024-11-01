import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CesantiasService } from '../../servicios/cesantias.service';
import { Cesantias } from '../../modelos/cesantias';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-index',
  standalone: true,
  providers: [CesantiasService],
  imports: [FormsModule, CommonModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  id: string | null;
  listarCesantias: Cesantias[] = [];
  token: string | null = null;
  yearToDownload: number | null = null;
  cargandoReferidos: boolean = false;

  searchTerm: string = '';
  tipoCesantiasSeleccionada: string = '';
  tiposCesantias: string[] = [];

  currentPage: number = 1; // Página actual
  itemsPerPage: number = 10; // Elementos por página

  constructor(private cesantiasService: CesantiasService, private router: Router, private aRouter: ActivatedRoute) {
    this.id = this.aRouter.snapshot.paramMap.get('id');
    this.searchTerm = '';
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
  this.cesantiasService.getCesantias(this.token).subscribe(
    (data: any) => {
      this.cargandoReferidos = false;
      // Ordenar las cesantías por ID de mayor a menor
      this.listarCesantias = data.cesantias.sort((a: Cesantias, b: Cesantias) => b.id! - a.id!);
      this.obtenerTiposCesantias();
    },
    err => {
      console.log(err);
      this.cargandoReferidos = false;
    }
  );
}



  
  mostrarImagenes(cesantias: Cesantias): void {
    // Verificar si incapacidad.images está definido y es un array
    const imagenesConRuta = Array.isArray(cesantias.images) ? cesantias.images.map((image: any) => ({
        image_path: `http://localhost:8000/storage/${image.image_path}`
    })) : [];

    // Crear el HTML para mostrar las imágenes y los botones
    const htmlContenido = `
      <div style="display: flex; flex-wrap: wrap; justify-content: center;">
        ${imagenesConRuta.map(img => `
          <div style="margin: 5px;">
            <img src="${img.image_path}" style="width: 100px; height: auto; margin: 5px;" onclick="window.open('${img.image_path}', '_blank')" />
          </div>
        `).join('')}
      </div>
      <div style="text-align: center; margin-top: 15px;">
        <button id="downloadButton" style="padding: 10px; cursor: pointer; background-color: green; color: white; border: none; border-radius: 5px; margin-right: 10px;">Descargar Imagenes</button>
       
      </div>
    `;

    // Mostrar la alerta con las imágenes
    Swal.fire({
        title: 'Imágenes',
        html: htmlContenido,
        showCloseButton: true,
        confirmButtonText: 'Cerrar',
        focusConfirm: false,
        customClass: {
            cancelButton: 'swal2-cancel', // Personaliza si es necesario
        }
    });

    // Agregar evento al botón de descarga
    setTimeout(() => {
        const downloadButton = document.getElementById('downloadButton');
        if (downloadButton) {
            downloadButton.addEventListener('click', () => {
                this.downloadZip(cesantias.id, cesantias.user?.cedula);
            });
        }
    }, 0);
}



// Descarga un ZIP de los documentos de incapacidad por ID
downloadDocumentsById(id: any): void {
  this.cesantiasService.downloadDocumentsById(id, this.token).subscribe((data: Blob) => {
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `documentos_cesantia_${id}.zip`; // Nombre del archivo ZIP
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }, error => {
    console.log(error);
    Swal.fire({
      title: 'Error',
      text: 'No se pudo descargar el ZIP.',
      icon: 'error',
    });
  });
}

  // Método para descargar cesantías por el año seleccionado
  descargarCesantiasPorAnio(): void {
    if (this.yearToDownload !== null) {
      this.cesantiasService.exportCesantias(this.yearToDownload).subscribe(
        (data: Blob) => {
          const url = window.URL.createObjectURL(data);
          const a = document.createElement('a');
          a.href = url;
          a.download = `cesantias_${this.yearToDownload}.xlsx`; // Nombre del archivo de descarga
          document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          document.body.removeChild(a);
        },
        error => {
          console.error('Error al descargar las cesantías:', error);
        }
      );
    } else {
      console.error('No se ha seleccionado ningún año para descargar.');
    }
  }

  // Filtramos las cesantías por término de búsqueda y tipo de cesantía
  filtrarCesantias(): Cesantias[] {
    let cesantiasFiltradas = this.listarCesantias;

    // Filtrar por término de búsqueda
    if (this.searchTerm.trim()) {
      cesantiasFiltradas = cesantiasFiltradas.filter(cesantia => 
        (cesantia.user?.cedula?.toString() ?? '').includes(this.searchTerm.trim())
      );
    }

    // Filtrar por tipo de cesantía reportada
    if (this.tipoCesantiasSeleccionada) {
      cesantiasFiltradas = cesantiasFiltradas.filter(cesantia => 
        (cesantia.tipo_cesantia_reportada?.toLowerCase() === this.tipoCesantiasSeleccionada.toLowerCase())
      );
    }

    return cesantiasFiltradas;
  }

  // Método para paginar las cesantías
  paginatedCesantias(): Cesantias[] {
    const filteredCesantias = this.filtrarCesantias();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return filteredCesantias.slice(startIndex, startIndex + this.itemsPerPage);
  }

  totalPages(): number {
    return Math.ceil(this.filtrarCesantias().length / this.itemsPerPage);
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

  autorizarCesantia(id: number | undefined): void {
    if (id === undefined) {
        console.error('ID de cesantía no definido');
        return;
    }

    Swal.fire({
        title: 'Autorizar Cesantía',
        text: '¿Está seguro de que desea autorizar esta cesantía?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Autorizar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            const access_token = localStorage.getItem('clave');
            if (!access_token) {
                console.error('Token de acceso no encontrado');
                return;
            }

            this.cesantiasService.authorizeCesantia(id, access_token).subscribe(
                (data) => {
                    console.log('Cesantía autorizada exitosamente:', data);
                    this.cargarCesantias();
                    Swal.fire('Autorizada!', 'La cesantía ha sido autorizada.', 'success');
                },
                (error) => {
                    console.error('Error al autorizar la cesantía:', error);
                    Swal.fire('Error!', 'No se pudo autorizar la cesantía.', 'error');
                }
            );
        }
    });
}

// Método para denegar cesantía
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

            this.cesantiasService.denyCesantiaAdmin(id, this.token!, justificacion).subscribe(
                (data) => {
                    console.log('Cesantía denegada exitosamente:', data);
                    this.cargarCesantias();
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
  // Obtener tipos únicos de cesantías
  obtenerTiposCesantias(): void {
    const tipos: Set<string> = new Set();
    this.listarCesantias.forEach(cesantia => {
      if (cesantia.tipo_cesantia_reportada) {
        tipos.add(cesantia.tipo_cesantia_reportada);
      }
    });
    this.tiposCesantias = Array.from(tipos);
  }

  // Descarga un ZIP de una cesantía
  downloadZip(id: any, cedula: number): void {
    this.cesantiasService.downloadZip(id, this.token).subscribe((data: Blob) => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cesantias_${cedula}__${id}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, error => {
      console.log(error);
    });
  }

 
}
