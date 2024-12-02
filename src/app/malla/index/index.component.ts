import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MallaService } from '../../servicios/malla.service';
import { Malla } from '../../modelos/malla';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import Swal from 'sweetalert2';


@Component({
  selector: 'app-index',
  standalone: true,
  providers: [MallaService],
  imports: [CommonModule, FormsModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  mallas: Malla[] = [];  // Arreglo donde se almacenarán las mallas
  id: string | null;
  token: string | null = null;  // Token de acceso
  cargando: boolean = false;   // Indicador de carga

  tipoSede: string = '';
  TipoSede: string[] = [];

  TipoProceso: string[] = [];
  tipoProceso: string = '';
  cedulaBusqueda: string = '';
  mallasFiltradas: Malla[] = []; // Esta es la lista filtrada que usaremos en la tabla


  
  currentPage: number = 1;  // Página actual
 itemsPerPage: number = 10; // Elementos por página

  

  constructor(
    private mallaService: MallaService, 
    private router: Router,
    private aRouter: ActivatedRoute, 
  ) { 
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.recuperarToken();
    this.cargarMallas();
  }

  recuperarToken(): void {
    this.token = localStorage.getItem('clave');
    if (this.token == null) {
      this.router.navigate(['/']);
    }
  }

  cargarMallas(): void {
    this.cargando = true;
    this.mallaService.getMallas(this.token).subscribe(
      (data: any) => {
        this.cargando = false;
        this.mallas = data.malla;
        this.obtenerTiposMallas(); 
        this.mallas.sort((a: Malla, b: Malla) => b.id! - a.id!);
        this.filtrarMallas();  // Filtrar mallas después de cargarlas
      },
      (error: any) => {
        console.error(error);
        this.cargando = false;
      }
    );
  }
  
  obtenerTiposMallas(): void {
    const tiposSedes: Set<string> = new Set(); // Crear un set dedicado para las sedes
    const tiposProceso: Set<string> = new Set(); //
    
    this.mallas.forEach(mallas => {
      if (mallas.p_venta) {
        tiposSedes.add(mallas.p_venta); // Usar p_venta solo para las sedes
      }

      if (mallas.proceso) {
        tiposProceso.add(mallas.proceso); // Usar proceso para los procesos
      }


    });
    this.TipoSede = Array.from(tiposSedes); // Asegurarse de que se asigna correctamente
    this.TipoProceso = Array.from(tiposProceso); // Asegurarse de
  }


  

  downloadDocumento(id: number | undefined): void {
    if (id !== undefined) {
      this.mallaService.downloadDocumento(id, this.token!).subscribe((data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'documento.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, (error: any) => {
        console.log(error);
      });
    }
  }


  




  calificarMalla(id: number | undefined): void {
    if (!id) {
      console.error('ID de la malla no definido');
      return;
    }
  
    Swal.fire({
      title: 'Calificar Malla',
      input: 'number',
      inputPlaceholder: 'Ingrese la calificación de 1/100',
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      preConfirm: (calificacion) => {
        if (!calificacion) {
          Swal.showValidationMessage('La calificación es requerida');
        }
        return calificacion;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const calificacion = result.value;
  
        // Llamada al servicio para calificar la malla
        this.mallaService.calificarmalla(id, calificacion, this.token).subscribe(
          (data) => {
            console.log('Malla calificada exitosamente', data);
            // Aquí puedes cargar las mallas o realizar cualquier otra acción que necesites
            this.cargarMallas(); // Asegúrate de que este método exista para recargar la lista de mallas
            Swal.fire('Malla calificada!', 'La calificación de la malla ha sido actualizada.', 'success');
          },
          (error) => {
            console.error('Error al calificar la malla', error);
            Swal.fire('Error!', 'Ha ocurrido un error al calificar la malla.', 'error');
          }
        );
      }
    });
  }


  
  estadoMalla(id: number | undefined): void {
    if (!id) {
      console.error('ID de la malla no definido');
      return;
    }

     // Aquí definimos las opciones para el dropdown
     const opciones = [
      { value: 'Revisado', label: 'Revisado' },
      { value: 'Sin Revisar', label: 'Sin Revisar' }
      
    ];
  
    Swal.fire({
      title: 'Cambiar Estado',
      text:'Seleccione el estado de la malla',
      input: 'select',
      inputOptions: opciones.reduce<{ [key: string]: string }>((acc, option) => {
        acc[option.value] = option.label;
        return acc;
      }, {}),
      inputPlaceholder: 'Seleccione un estado',
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      preConfirm: (estado) => {
        if (!estado) {
          Swal.showValidationMessage('Estado requerido');
        }
        return estado;
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const estado = result.value;
  
        // Llamada al servicio para calificar la malla
        this.mallaService.estadomalla(id, estado, this.token).subscribe(
          (data) => {
            console.log('Malla cambiada exitosamente', data);
            // Aquí puedes cargar las mallas o realizar cualquier otra acción que necesites
            this.cargarMallas(); // Asegúrate de que este método exista para recargar la lista de mallas
            Swal.fire('Malla cambiada!', 'El cambio de la malla ha sido actualizado.', 'success');
          },
          (error) => {
            console.error('Error al cambiar el estado de  la malla', error);
            Swal.fire('Error!', 'Ha ocurrido un error.', 'error');
          }
        );
      }
    });
  }


  filtrarMallas(): Malla[] {
    let mallasFiltradas = this.mallas;
    
    // Filtrar por Sede
    if (this.tipoSede) {
      mallasFiltradas = mallasFiltradas.filter(malla => 
        malla.p_venta?.toLowerCase() === this.tipoSede.toLowerCase()
      );
    }
  
    // Filtrar por Proceso (usando tipoProceso, ya que es un string seleccionado, no un array)
    if (this.tipoProceso) {
      mallasFiltradas = mallasFiltradas.filter(malla => 
        malla.proceso?.toLowerCase() === this.tipoProceso.toLowerCase()
      );
    }
  
    // Filtrar por cédula
    if (this.cedulaBusqueda) {
      mallasFiltradas = mallasFiltradas.filter(malla => 
        malla.user.cedula?.toString().includes(this.cedulaBusqueda)
      );
    }
  
    this.mallasFiltradas = mallasFiltradas;
    return mallasFiltradas; // Devolver el valor filtrado
  }
  
  paginatedMallas(): Malla[] {
    const filteredMallas = this.filtrarMallas();  // Ahora devuelve un array filtrado
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return filteredMallas.slice(startIndex, startIndex + this.itemsPerPage);
  }
  

  totalPages(): number {
    return Math.ceil(this.filtrarMallas().length / this.itemsPerPage);  // Usar el valor filtrado
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




  
  
  

  
}
