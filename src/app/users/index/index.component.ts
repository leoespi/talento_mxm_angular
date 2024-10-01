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
  styleUrl: './index.component.scss'
})
export class IndexComponent {
  id: string | null;
  listaUserss: Users[] = [];
  token: string | null = null;
  searchTerm: string = '';
  cargandoReferidos: boolean = false;

  currentPage: number = 1; // Página actual
  itemsPerPage: number = 10; // Elementos por página

  constructor(private usersService: UsersService, private _router: Router, private aRouter: ActivatedRoute) {
    this.id = this.aRouter.snapshot.paramMap.get('id');
    this.searchTerm = '';
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

  // Carga la lista de usuarios desde el servidor
  cargaUsers(): void {
    this.cargandoReferidos = true;
    this.usersService.getUserss(this.token).subscribe(data => {
      console.log(data);
      this.cargandoReferidos = false;
      this.listaUserss = data;
    },
    err => {
      console.log(err);
      this.cargandoReferidos = false;
    });
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
  
  

  // Filtra la lista de usuarios según el término de búsqueda
  filtrarUsers(): Users[] {
    if (!this.searchTerm.trim()) {
      return this.listaUserss;
    }
    return this.listaUserss.filter(user => 
      (user.cedula?.toString() ?? '').includes(this.searchTerm.trim())
    );
  }

  // Devuelve los usuarios paginados
  // Devuelve los usuarios paginados en orden inverso
paginatedUsers(): Users[] {
  const filteredUsers = this.filtrarUsers();
  const startIndex = (this.currentPage - 1) * this.itemsPerPage;
  // Invertir la lista antes de paginar
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
}
