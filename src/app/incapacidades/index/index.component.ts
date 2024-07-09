import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncapacidadesService } from '../../servicios/incapacidades.service';
import { Incapacidades } from '../../modelos/incapacidades';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

  year: string = ''; // Agrega la propiedad year
  listarIncapacidades: Incapacidades[] = [];
  token: string | null = null;
  searchTerm: string = '';
  clave: string | null = null;
  
  imagenVisible: boolean = false;
  imagenVisualizadaSrc: string | null = null; 
  searchMonth: string = '';
  tipoIncapacidadSeleccionada: string = '';
  tiposIncapacidad: string[] = [];

  constructor(private incapacidadesService: IncapacidadesService, private router: Router, private aRouter: ActivatedRoute) {
    this.id = this.aRouter.snapshot.paramMap.get('id');
    this.searchTerm = '';
  }

  ngOnInit(): void {
    this.recuperarToken();
    this.cargarIncapacidades();
  }

  // Recupera el token del almacenamiento local
  recuperarToken(): void {
    this.token = localStorage.getItem('clave');
    if (this.token == null) {
      this.router.navigate(['/']);
    }
  }

  // Visualiza la imagen asociada a una incapacidad en una nueva pestaña
  visualizarImagen(uuid: string): void {
    this.incapacidadesService.downloadImage(uuid, this.token).subscribe((data: Blob) => {
      const url = window.URL.createObjectURL(data);
      const newWindow = window.open(url, '_blank');
      if (newWindow) {
        newWindow.focus();
      } else {
        console.error('No se pudo abrir una nueva pestaña.');
      }
    }, error => {
      console.log(error);
    });
  }

  // Carga las incapacidades desde el servidor
  cargarIncapacidades(): void {
    this.cargandoReferidos = true; // Activar el estado de carga al inicio de la solicitud
    this.incapacidadesService.getIncapacidades(this.token).subscribe(
      (data: any) => {
        console.log(data);
        this.listarIncapacidades = data.incapacidades;
        this.cargandoReferidos = false; // Desactivar el estado de carga al recibir la respuesta
        this.obtenerTiposIncapacidad();
      },
      err => {
        console.log(err);
        this.cargandoReferidos = false; // Desactivar el estado de carga en caso de error
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

  // Método para descargar incapacidades por año
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
    this.incapacidadesService.deleteIncapacidades(id, this.token).subscribe(
      data => {
        this.cargarIncapacidades();
      },
      error => {
        console.log(error);
      }
    );
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

  // Descarga una imagen asociada a una incapacidad
  downloadImage(uuid: string): void {
    this.incapacidadesService.downloadImage(uuid, this.token).subscribe((data: Blob) => {
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


  downloadZip(uuid: string, cedula: number): void {
    this.incapacidadesService.downloadZip(uuid, this.token).subscribe((data: Blob) => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `incapacidad_${cedula}__${uuid}.zip`; // Aquí se incluye la cédula del usuario en el nombre del archivo ZIP
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, error => {
      console.log(error);
    });
  }
  

  // Redirige a la página de edición de una incapacidad por su ID
  editarIncapacidades(id: any): void {
    this.router.navigateByUrl("/incapacidades/editar/"+id);
  }
}
