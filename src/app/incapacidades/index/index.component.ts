import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncapacidadesService } from '../../servicios/incapacidades.service';
import { Incapacidades } from '../../modelos/incapacidades';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-index',
  standalone: true,
  providers: [IncapacidadesService],
  imports: [CommonModule, FormsModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  id: string | null;
  cargandoReferidos: boolean = false;

  year: string = '';
  listarIncapacidades: Incapacidades[] = [];
  token: string | null = null;
  searchTerm: string = '';
  
  searchMonth: string = '';
  tipoIncapacidadSeleccionada: string = '';
  tiposIncapacidad: string[] = [];

  categorias: any[] = []; // Lista de categorías
  categoriasMap: Map<number, string> = new Map(); // Mapa de id -> codigo

  currentPage: number = 1; // Página actual
  itemsPerPage: number = 10; // Elementos por página

  constructor(private incapacidadesService: IncapacidadesService, private router: Router, private aRouter: ActivatedRoute) {
    this.id = this.aRouter.snapshot.paramMap.get('id');
    this.searchTerm = '';
  }

  ngOnInit(): void {
    this.recuperarToken();
    this.cargarIncapacidades();
    this.cargarCategorias();  // Cargar las categorías al iniciar
  }

  // Recupera el token del almacenamiento local
  recuperarToken(): void {
    this.token = localStorage.getItem('clave');
    if (this.token == null) {
      this.router.navigate(['/']);
    }
  }
// Carga las incapacidades desde el servidor
cargarIncapacidades(): void {
  this.cargandoReferidos = true;
  this.incapacidadesService.getIncapacidades(this.token).subscribe(
    (data: any) => {
      this.cargandoReferidos = false;
      this.listarIncapacidades = data.incapacidades;

      // Ordenar las incapacidades por ID de mayor a menor
      this.listarIncapacidades.sort((a: Incapacidades, b: Incapacidades) => b.id! - a.id!);

      this.obtenerTiposIncapacidad();
    },
    err => {
      console.log(err);
      this.cargandoReferidos = false;
    }
  );
}


// Obtener tipos únicos de incapacidades
obtenerTiposIncapacidad(): void {
  const tipos: Set<string> = new Set();
  this.listarIncapacidades.forEach(incapacidad => {
    if (incapacidad.tipo_incapacidad_reportada) {
      tipos.add(incapacidad.tipo_incapacidad_reportada);
    }
  });
  this.tiposIncapacidad = Array.from(tipos);
}



 // Cargar las categorías desde el backend
 cargarCategorias(): void {
  this.incapacidadesService.getCategorias(this.token).subscribe(
    (data: any) => {
      // Crear un mapa id -> codigo
      this.categorias = data;
      this.categorias.forEach(categoria => {
        this.categoriasMap.set(categoria.id, categoria.codigo); // Mapear el id con el código
      });
    },
    err => {
      console.log(err);
    }
  );

}


// Método para obtener el código de la categoría por su id
obtenerCodigoCategoria(categoriaId: number): string {
  return this.categoriasMap.get(categoriaId) ?? 'Desconocido'; // Retorna 'Desconocido' si no se encuentra el id
}



  mostrarImagenes(incapacidad: Incapacidades): void {
    // Verificar si incapacidad.images está definido y es un array
    const imagenesConRuta = Array.isArray(incapacidad.images) ? incapacidad.images.map((image: any) => ({
      image_path: `http://localhost:8000/storage/${image.image_path}`
    })) : [];
  
    // Crear el HTML para mostrar las imágenes en la alerta
    const htmlContenido = `
      <div style="display: flex; flex-wrap: wrap; justify-content: center;">
        ${imagenesConRuta.map(img => `
          <div style="margin: 5px;">
            <img src="${img.image_path}" style="width: 100px; height: auto; margin: 5px;" onclick="window.open('${img.image_path}', '_blank')" />
          </div>
        `).join('')}
      </div>
      <div style="text-align: center; margin-top: 15px;">
        <button id="downloadButton" style="padding: 10px; cursor: pointer; background-color: green; color: white; border: none; border-radius: 5px; margin-right: 10px;">Descargar ZIP</button>
       
      </div>
    `;
  
    // Mostrar la alerta con las imágenes
    Swal.fire({
      title: 'Imágenes',
      html: htmlContenido,
      showCloseButton: true,
      confirmButtonText: 'Cerrar',
      customClass: {
        popup: 'my-popup' // Puedes agregar clases personalizadas si necesitas estilos adicionales
      }
    });

     // Agregar evento al botón de descarga
     setTimeout(() => {
      const downloadButton = document.getElementById('downloadButton');
      if (downloadButton) {
          downloadButton.addEventListener('click', () => {
              this.downloadZip(incapacidad.id, incapacidad.user?.cedula);
          });
      }
  }, 0);
  }


  // Descarga un ZIP de una cesantía
  downloadZip(id: any, cedula: number): void {
    this.incapacidadesService.downloadZip(id, this.token).subscribe((data: Blob) => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Incapacidad_${cedula}__${id}.zip`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, error => {
      console.log(error);
    });
  }

  
  
  
  

  
  // Método para filtrar y paginar las incapacidades
  paginatedIncapacidades(): Incapacidades[] {
    const filteredIncapacidades = this.filtrarIncapacidades();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return filteredIncapacidades.slice(startIndex, startIndex + this.itemsPerPage);
  }

  totalPages(): number {
    return Math.ceil(this.filtrarIncapacidades().length / this.itemsPerPage);
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

  // Filtramos las incapacidades por término de búsqueda, mes y tipo de incapacidad reportada
  filtrarIncapacidades(): Incapacidades[] {
    let incapacidadesFiltradas = this.listarIncapacidades;

    // Filtrar por término de búsqueda
    if (this.searchTerm.trim()) {
      incapacidadesFiltradas = incapacidadesFiltradas.filter(incapacidad => 
        (incapacidad.user?.cedula?.toString() ?? '').includes(this.searchTerm.trim())
      );
    }

    // Filtrar por mes
    if (this.searchMonth) {
      const partes = this.searchMonth.split('-');
      const mesSeleccionado = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1);
      incapacidadesFiltradas = incapacidadesFiltradas.filter(incapacidad => {
        const fechaIncapacidad = new Date(incapacidad.fecha_inicio_incapacidad);
        return fechaIncapacidad.getMonth() === mesSeleccionado.getMonth() && fechaIncapacidad.getFullYear() === mesSeleccionado.getFullYear();
      });
    }

    // Filtrar por tipo de incapacidad reportada
    if (this.tipoIncapacidadSeleccionada) {
      incapacidadesFiltradas = incapacidadesFiltradas.filter(incapacidad => 
        (incapacidad.tipo_incapacidad_reportada?.toLowerCase() === this.tipoIncapacidadSeleccionada.toLowerCase())
      );
    }

    return incapacidadesFiltradas;
  }

  // Método para descargar incapacidades por año
  downloadIncapacidadesByYear(year: string): void {
    this.incapacidadesService.downloadIncapacidadesByYear(year, this.token).subscribe((data: Blob) => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `incapacidades_${year}.xlsx`; // Nombre del archivo con el año
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, error => {
      console.log(error);
    });
  }

  // Elimina una incapacidad por su ID
  eliminarFeeds(id: any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¡Esta acción no se puede deshacer!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.incapacidadesService.deleteIncapacidades(id, this.token).subscribe(
          data => {
            Swal.fire(
              'Eliminado!',
              'La incapacidad ha sido eliminada.',
              'success'
            );
            this.cargarIncapacidades();
          },
          error => {
            console.log(error);
            Swal.fire(
              'Error!',
              'No se pudo eliminar la incapacidad.',
              'error'
            );
          }
        );
      }
    });
  }

// Descarga un ZIP de los documentos de incapacidad por ID
downloadDocumentsById(id: any): void {
  this.incapacidadesService.downloadDocumentsById(id, this.token).subscribe((data: Blob) => {
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = `documentos_incapacidad_${id}.zip`; // Nombre del archivo ZIP
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

  

  // Descarga una imagen asociada a una incapacidad
  downloadImage(id: string): void {
    this.incapacidadesService.downloadImage(id, this.token).subscribe((data: Blob) => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'imagen.jpg'; // Cambia 'imagen.jpg' por el nombre adecuado
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, error => {
      console.log(error);
    });
  }

   // Descarga un ZIP de una incapacidad
   

  // Redirige a la página de edición de una incapacidad por su ID
  editarIncapacidades(id: any): void {
    this.router.navigateByUrl("/incapacidades/editar/"+id);
  }
}
