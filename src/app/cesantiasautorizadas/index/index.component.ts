import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CesantiasAutorizadasService } from '../../servicios/cesantias-autorizadas.service';
import { Cesantias } from '../../modelos/cesantias';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-index',
  standalone: true,
  providers:[CesantiasAutorizadasService],
  imports: [FormsModule,CommonModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent {
  id: string | null;
  listarCesantias: Cesantias[] = [];
  token: string | null = null;
  searchTerm: string = '';
  clave: string | null = null;
  yearToDownload: number = 0; // Declaración de la propiedad yearToDownload   
   

  
  tipoCesantiasSeleccionada: string = '';
  tiposCesantias: string[] = [];


  constructor(private CesantiasAutorizadasServicio: CesantiasAutorizadasService , private router: Router, private aRouter: ActivatedRoute) {
    this.id = this.aRouter.snapshot.paramMap.get('id');
    this.searchTerm = '';
  }

  ngOnInit(): void {
    this.recuperarToken(); // Recuperar el token primero
    this.cargarCesantias(); // Llamar a cargarCesantias para cargar los datos
  }
  


  // Recupera el token del almacenamiento local
  recuperarToken(): void {
    this.token = localStorage.getItem('clave');
    if (this.token == null) {
      this.router.navigate(['/']);
    }
  }

  // Carga las cesantias desde el servidor
  cargarCesantias(): void {
    this.CesantiasAutorizadasServicio.getCesantiasAutorizadas(this.token).subscribe(
      (data: any) => {
        console.log(data);
        this.listarCesantias = data.authorizedCesantia; // Asegúrate de que el nombre sea correcto según la respuesta de tu API
      },
      err => {
        console.log(err);
      }
    );
  }

  aprobarCesantia(id: number | undefined): void {
    if (!id) {
        console.error('ID de cesantía no definido');
        return;
    }

    const justificacion = prompt('Ingrese la justificación para la aprobación:');
    if (!justificacion) {
        console.error('Justificación requerida');
        return;
    }

    // Llamar al servicio para aprobar la cesantía
    this.CesantiasAutorizadasServicio.aprobarCesantia(id, justificacion, this.token).subscribe(
        (data) => {
            console.log('Cesantía aprobada exitosamente:', data);
            // Aquí podrías actualizar la lista de cesantías si es necesario
            this.cargarCesantias();
        },
        (error) => {
            console.error('Error al aprobar la cesantía:', error);
        }
    );
}

  

  denegarCesantiaAdmin(id: number | undefined): void {
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
    this.CesantiasAutorizadasServicio.denyCesantiaAdmin(id, access_token).subscribe(
      (data) => {
        console.log('Cesantía denegada exitosamente:', data);
        // Aquí podrías actualizar la lista de cesantías si es necesario
        this.cargarCesantias();
      },
      (error) => {
        console.error('Error al denegada la cesantía:', error);
      }
    );
  }


  downloadZip(uuid: string, cedula: number): void {
    this.CesantiasAutorizadasServicio.downloadZip(uuid, this.token).subscribe((data: Blob) => {
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
