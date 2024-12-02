import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PermisosService } from '../../servicios/permisos.service';
import { Permisos } from '../../modelos/permisos';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { error } from 'console';

@Component({
  selector: 'app-index',
  standalone: true,
  providers: [PermisosService],
  imports: [FormsModule, CommonModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent {

  permisos: Permisos[] = [];
  id: string | null;
  token: string | null = null;
  cargandoReferidos: boolean = false; 
  permisoSeleccionado: Permisos | null = null;

  permisosFiltrados: Permisos[] = []; 
  tipoCategoriaSeleccionada: string = '';
  tipoSede: string = '';
  TipoSede: string[] = [];
  tipoCategoria: string[] = [];

  cedulaBusqueda: string = '';
  fechaPermisoBusqueda: string = '';

  currentPage: number = 1;  // Página actual
 itemsPerPage: number = 10; // Elementos por página

  

  permisosform = this.fb.group({
    estado: '',
  });

  constructor(
    private fb: FormBuilder,
    private permisosService: PermisosService, 
    private aRouter: ActivatedRoute, 
    private router: Router
  ) {
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.recuperarToken();
    this.cargarPermisos();
  }

  // Recupera el token del almacenamiento local
  recuperarToken(): void {
    this.token = localStorage.getItem('clave');
    if (this.token == null) {
      this.router.navigate(['/']);
    }
  }

  cargarPermisos(): void {
    this.cargandoReferidos = true;
    this.permisosService.getpermisos(this.token).subscribe(
      (data: any) => {
        this.cargandoReferidos = false;
        this.permisos = data.permisos;
        this.obtenerTiposPermisos();

        this.permisos.sort((a:Permisos, b:Permisos) => b.id! - a.id!);
        
        // Filtra los permisos si ya hay una categoría seleccionada
        this.filtrarPermisos();
      },
      (error: any) => {
        console.error(error);
        this.cargandoReferidos = false;
      }
    );
  }

  obtenerTiposPermisos(): void {
    const tiposCategorias: Set<string> = new Set();
    const tiposSedes: Set<string> = new Set(); // Crear un set dedicado para las sedes
    
    this.permisos.forEach(permiso => {
      if (permiso.categoria_solicitud) {
        tiposCategorias.add(permiso.categoria_solicitud);
      }
      if (permiso.p_venta) {
        tiposSedes.add(permiso.p_venta); // Usar p_venta solo para las sedes
      }
    });
    
    this.tipoCategoria = Array.from(tiposCategorias);
    this.TipoSede = Array.from(tiposSedes); // Asegurarse de que se asigna correctamente
  }
  

  exportarPermisos(): void {
    this.permisosService.exportpermisos(this.token).subscribe((data: Blob) => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'permisos.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.appendChild(a);
    }, error => {console.log(error);

    })
  }
  filtrarPermisos(): Permisos[] {
    let permisosFiltrados = this.permisos;
    
    // Filtrar por tipo de categoría
    if (this.tipoCategoriaSeleccionada) {
      permisosFiltrados = permisosFiltrados.filter(permiso => 
        (permiso.categoria_solicitud?.toLowerCase() === this.tipoCategoriaSeleccionada.toLowerCase())
      );
    }

    if (this.tipoSede) {
      permisosFiltrados = permisosFiltrados.filter(permiso => 
        (permiso.p_venta?.toLowerCase() === this.tipoSede.toLowerCase())
      );
    }
    
    
    // Filtrar por mes y año de fecha_permiso
    if (this.fechaPermisoBusqueda) {
      permisosFiltrados = permisosFiltrados.filter(permiso => {
        const fechaPermiso = new Date(permiso.fecha_permiso);
        const fechaPermisoStr = `${fechaPermiso.getFullYear()}-${(fechaPermiso.getMonth() + 1).toString().padStart(2, '0')}`;
        return fechaPermisoStr === this.fechaPermisoBusqueda;
      });
    }
    
    // Filtrar por cédula
    if (this.cedulaBusqueda) {
      permisosFiltrados = permisosFiltrados.filter(permiso => 
        permiso.user.cedula?.toString().includes(this.cedulaBusqueda)
      );
    }
    
    // Actualiza la variable de permisos filtrados
    this.permisosFiltrados = permisosFiltrados;
    
    // Ensure to return the filtered array
    return permisosFiltrados;  // Add this return statement
  }
  

  // Método para filtrar y paginar las incapacidades
  paginatedPermisos(): Permisos[] {
    const filteredPermisos = this.filtrarPermisos();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return filteredPermisos.slice(startIndex, startIndex + this.itemsPerPage);
  }

  totalPages(): number {
    return Math.ceil(this.filtrarPermisos().length / this.itemsPerPage);
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

  
  
  
  
  
  

  editarPermiso(id: number | undefined): void {
    if (!id) {
      console.error('ID del permiso no definido');
      return;
    }
  
    // Aquí definimos las opciones para el dropdown
    const opciones = [
      { value: 'Revisado', label: 'Revisado' },
      { value: 'Sin Revisar', label: 'Sin Revisar' }
      
    ];
  
    Swal.fire({
      title: 'Actualizar Permiso',
      text: 'Seleccione el estado del permiso',
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
  
        // Llamada al servicio para actualizar el permiso
        this.permisosService.updatepermisos(id, estado, this.token).subscribe(
          (data) => {
            console.log('Permiso actualizado exitosamente', data);
            this.cargarPermisos();
            Swal.fire('Permiso actualizado!', 'El estado del permiso ha sido actualizado.', 'success');
          },
          (error) => {
            console.error('Error al actualizar el permiso', error);
            Swal.fire('Error!', 'Ha ocurrido un error al actualizar el permiso.', 'error');
          }
        );
      }
    });
  }

  
  

  
 
}