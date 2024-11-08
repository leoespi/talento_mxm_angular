import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../servicios/users.service';
import { Users } from '../../modelos/users';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-index',
  standalone: true,
  providers: [UsersService],
  imports: [CommonModule, FormsModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {
  id: string | null;
  listaUserss: Users[] = [];
  token: string | null = null;
  searchTerm: string = ''; // Campo único para la búsqueda
  cargandoReferidos: boolean = false;
  fileToImport: File | null = null;

  currentPage: number = 1; // Página actual
  itemsPerPage: number = 10; // Elementos por página

  constructor(private usersService: UsersService, private _router: Router, private aRouter: ActivatedRoute) {
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.recuperarToken();
    this.cargaUsers();
  }

  // Recupera el token del almacenamiento local
  recuperarToken() {
    this.token = localStorage.getItem('clave');
    if (this.token == null) {
      this._router.navigate(['/']);
    }
  }

  // Función para filtrar usuarios según el término de búsqueda (por nombre o cédula)
  filtrarUsers(): Users[] {
    if (!this.searchTerm.trim()) {
      return this.listaUserss;
    }

    // Intentamos filtrar primero por cédula (números)
    if (!isNaN(Number(this.searchTerm))) {
      return this.listaUserss.filter(user =>
        (user.cedula?.toString() ?? '').includes(this.searchTerm.trim())
      );
    }

    // Si no es número, lo buscamos por nombre (cadena de texto)
    return this.listaUserss.filter(user =>
      (user.name?.toLowerCase() ?? '').includes(this.searchTerm.trim().toLowerCase())
    );
  }

  // Devuelve los usuarios paginados
  paginatedUsers(): Users[] {
    const filteredUsers = this.filtrarUsers();
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return filteredUsers.reverse().slice(startIndex, startIndex + this.itemsPerPage);
  }

  // Total de páginas
  totalPages(): number {
    return Math.ceil(this.filtrarUsers().length / this.itemsPerPage);
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

  // Cargar la lista de usuarios desde el servidor
  cargaUsers(): void {
    this.cargandoReferidos = true;
    this.usersService.getUserss(this.token).subscribe(data => {
      this.cargandoReferidos = false;
      this.listaUserss = data;
    },
    err => {
      this.cargandoReferidos = false;
      console.log(err);
    });
  }

  // Descarga la lista de usuarios en formato de archivo
  downloadUsers(): void {
    this.usersService.downloadUsers(this.token).subscribe((data: Blob) => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'usuarios.xlsx'; // Cambia la extensión del archivo según el tipo de archivo que Laravel devuelve
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, error => {
      console.log(error);
    });
  }

  // Maneja la selección del archivo
  onFileChange(event: any): void {
    this.fileToImport = event.target.files[0];
  }

  // Subir el archivo Excel y realizar la importación
  importUsers(): void {
    if (this.fileToImport) {
      this.usersService.importUsers(this.fileToImport, this.token!).subscribe(
        (response) => {
          Swal.fire('Importación exitosa', 'Los usuarios se han importado correctamente.', 'success');
          // Refresca los datos de la tabla después de la importación exitosa
          this.cargaUsers();
        },
        (error) => {
          Swal.fire('Error', 'Hubo un problema al importar los usuarios.', 'error');
          console.error(error);
        }
      );
    } else {
      Swal.fire('Error', 'Por favor seleccione un archivo Excel.', 'warning');
    }
  }
  

  // Elimina un usuario por su ID
  eliminarUsers(id: any): void {
    this.usersService.deleteUsers(id, this.token).subscribe(
      data => {
        this.cargaUsers();
      },
      error => {
        console.log(error);
      });
  }

  // Redirige a la página de edición de un usuario por su ID
  editarUsers(id: any): void {
    this._router.navigateByUrl("/users/editar/" + id);
  }

  // Activa un usuario
  activarUser(id: any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas activar este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersService.activateUser(id, this.token).subscribe(
          data => {
            this.cargaUsers();
            Swal.fire('Activado!', 'Usuario activado con éxito!', 'success');
          },
          error => {
            console.log(error);
            Swal.fire('Error!', 'Error al activar el usuario.', 'error');
          }
        );
      }
    });
  }

  // Desactiva un usuario
  desactivarUser(id: any): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas desactivar este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usersService.deactivateUser(id, this.token).subscribe(
          data => {
            this.cargaUsers();
            Swal.fire('Desactivado!', 'Usuario desactivado con éxito!', 'success');
          },
          error => {
            console.log(error);
            Swal.fire('Error!', 'Error al desactivar el usuario.', 'error');
          }
        );
      }
    });
  }
}
