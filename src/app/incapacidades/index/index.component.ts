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

  listarIncapacidades: Incapacidades[] = [];
  token: string | null = null;
  searchTerm: string = '';
  clave: string | null = null;
  imagenVisible: boolean = false;
  imagenVisualizadaSrc: string | null = null; 
  searchMonth: string = '';


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
    this.incapacidadesService.getIncapacidades(this.token).subscribe(
      (data: any) => {
        console.log(data);
        this.listarIncapacidades = data.incapacidades;
      },
      err => {
        console.log(err);
      }
    );
  }




  // Descarga las incapacidades en formato de archivo
  downloadIncapacidades(): void {
    this.incapacidadesService.downloadIncapacidades(this.token).subscribe((data: Blob) => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'incapacidades.xlsx';
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

 
   // Modificamos la función filtrarIncapacidades para incluir el filtro por mes
filtrarIncapacidades(): Incapacidades[] {
  let incapacidadesFiltradas = this.listarIncapacidades;

  // Filtrar por término de búsqueda
  if (this.searchTerm.trim()) {
    incapacidadesFiltradas = incapacidadesFiltradas.filter(incapacidad => 
      (incapacidad.user?.cedula?.toString() ?? '').includes(this.searchTerm.trim())
    );
  }

  
if (this.searchMonth) {
  const partes = this.searchMonth.split('-');
  const mesSeleccionado = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1);
  incapacidadesFiltradas = incapacidadesFiltradas.filter(incapacidad => {
    const fechaIncapacidad = new Date(incapacidad.fecha_inicio_incapacidad);
    return fechaIncapacidad.getMonth() === mesSeleccionado.getMonth() && fechaIncapacidad.getFullYear() === mesSeleccionado.getFullYear();
  });
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

  // Redirige a la página de edición de una incapacidad por su ID
  editarIncapacidades(id: any): void {
    this.router.navigateByUrl("/incapacidades/editar/"+id);
  }
  


  
}
