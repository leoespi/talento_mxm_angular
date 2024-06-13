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
  searchTerm: string = '';
  clave: string | null = null;
   
  
  tipoCesantiasSeleccionada: string = '';
  tiposCesantias: string[] = [];


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

  // Carga las cesantias desde el servidor
  cargarCesantias(): void {
    this.cesantiasService.getCesantias(this.token).subscribe(
      (data: any) => {
        console.log(data);
        this.listarCesantias = data.cesantias;
        this.obtenerTiposCesantias();
      },
      err => {
        console.log(err);
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