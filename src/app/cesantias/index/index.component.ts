import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CesantiasService } from '../../servicios/cesantias.service';
import { Cesantias } from '../../modelos/cesantias';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-index',
  standalone: true,
  providers:[CesantiasService],
  imports: [ FormsModule,CommonModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent {


  

  id: string | null;
  listarCesantias: Cesantias[] = [];
  token: string | null = null;
  yearToDownload: number | null = null;
  cargandoReferidos: boolean = false; 

  searchTerm: string = '';
  clave: string | null = 'valor'; // Asumiendo que `clave` tiene un valor inicial  yearToDownload: number = 0; // Declaración de la propiedad yearToDownload   
   
  
  tipoCesantiasSeleccionada: string = '';
  tiposCesantias: string[] = [];


  constructor(private cesantiasService: CesantiasService, private router: Router, private aRouter: ActivatedRoute) {
    this.id = this.aRouter.snapshot.paramMap.get('id');
    this.searchTerm = '';
  }

  navigateToCesantiasDenegadas(): void {
    this.router.navigate(['/cesantiasdenegadas/index']); // Navegación a la ruta deseada
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

  // Carga las cesantias desde el servidor
  cargarCesantias(): void {
    this.cargandoReferidos = true;
    this.cesantiasService.getCesantias(this.token).subscribe(
      (data: any) => {
        console.log(data);
        this.cargandoReferidos = false;
        this.listarCesantias = data.cesantias;
        this.obtenerTiposCesantias();
      },
      err => {
        console.log(err);
        this.cargandoReferidos = false;
      }
    );
  }


  autorizarCesantia(id: number | undefined): void {
    if (id === undefined) {
      console.error('ID de cesantía no definido');
      return;
    }

    // Obtener token de algún lugar, por ejemplo del almacenamiento local
    const access_token = localStorage.getItem('clave');
    if (!access_token) {
      console.error('Token de acceso no encontrado');
      return;
    }

    // Llamar al servicio para autorizar la cesantía
    this.cesantiasService.authorizeCesantia(id, access_token).subscribe(
      (data) => {
        console.log('Cesantía autorizada exitosamente:', data);
        // Aquí podrías actualizar la lista de cesantías si es necesario
        this.cargarCesantias();
      },
      (error) => {
        console.error('Error al autorizar la cesantía:', error);
      }
    );
  }


  denegarCesantiaAdmin(id: number | undefined): void {
    if (!id) {
      console.error('ID de cesantía no definido');
      return;
    }

    // Puedes pedir una justificación al usuario si es necesario
    const justificacion = prompt('Ingrese la justificación para la denegación:');
    if (!justificacion) {
      console.error('Justificación requerida');
      return;
    }

    this.cesantiasService.denyCesantiaAdmin(id, this.token!, justificacion).subscribe(
      (data) => {
        console.log('Cesantía denegada exitosamente:', data);
        this.cargarCesantias(); // Actualizar la lista después de denegar
      },
      (error) => {
        console.error('Error al denegar la cesantía:', error);
      }
    );
  }




   // Obtener tipos únicos de cesantias
   obtenerTiposCesantias(): void {
    const tipos: Set<string> = new Set();
    this.listarCesantias.forEach(cesantias => {
      if (cesantias.tipo_cesantia_reportada) {
        tipos.add(cesantias.tipo_cesantia_reportada);
      }
    });
    this.tiposCesantias = Array.from(tipos);
  }


 



  // Elimina una cesantia por su ID
  eliminarCesantias(id: any): void {
    this.cesantiasService.deleteCesantias(id, this.token).subscribe(
      data => {
        this.cargarCesantias();
      },
      error => {
        console.log(error);
      }
    );
  }

  // Filtramos las cesantias por término de búsqueda, mes y tipo de cesantias reportada
  filtrarCesantias():Cesantias[] {
    let cesantiasFiltradas = this.listarCesantias;

    // Filtrar por término de búsqueda
    if (this.searchTerm.trim()) {
      cesantiasFiltradas = cesantiasFiltradas.filter(cesantias => 
        (cesantias.user?.cedula?.toString() ?? '').includes(this.searchTerm.trim())
      );
    }

    // Filtrar por tipo de cesantia reportada
    if (this.tipoCesantiasSeleccionada) {
      cesantiasFiltradas =cesantiasFiltradas.filter(cesantias => 
        (cesantias.tipo_cesantia_reportada?.toLowerCase() === this.tipoCesantiasSeleccionada.toLowerCase())
      );
    }

    return cesantiasFiltradas;
  }
  
  // Descarga una imagen asociada a una cesantia
  downloadImage(uuid: string): void {
    this.cesantiasService.downloadImage(uuid, this.token).subscribe((data: Blob) => {
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
    this.cesantiasService.downloadZip(uuid, this.token).subscribe((data: Blob) => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cesantias_${cedula}__${uuid}.zip`; // Aquí se incluye la cédula del usuario en el nombre del archivo ZIP
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, error => {
      console.log(error);
    });
  }


  // Redirige a la página de edición de una cesantia por su ID
  editarCesantias(id: any): void {
    this.router.navigateByUrl("/cesantias/editar/"+id);
  }




  




}
