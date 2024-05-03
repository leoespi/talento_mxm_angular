import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../servicios/users.service';
import { Users } from '../../modelos/users';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';



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
  listaUserss: Users[]=[];
  token: string | null = null;
  searchTerm: string = '';


  constructor(private usersService: UsersService, private _router: Router, private aRouter: ActivatedRoute ) { 
    this.id=this.aRouter.snapshot.paramMap.get('id');
    this.searchTerm = '';
  }

  ngOnInit(): void {
    this.recuperarToken();
    this.cargaUsers();;
  }

  recuperarToken(){
    this.token = localStorage.getItem('clave');
    if (this.token == null) {
      this._router.navigate(['/']);
    }
  }


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



  
cargaUsers(): void{
  this.usersService.getUserss( this.token).subscribe(data=>{
    console.log(data);
    this.listaUserss = data;     
  },
  err =>{
    console.log(err);
  }
  )
}

  
  eliminarUsers(id:any): void {
    this.usersService.deleteUsers(id, this.token).subscribe(
      data=>{
      this.cargaUsers();
    },
    error =>{
      console.log(error);
    });
  }

  editarUsers(id:any): void{
    this._router.navigateByUrl("/users/editar/"+id);
  }

  filtrarUsers(): Users[] {
    if (!this.searchTerm.trim()) {
      // Si el término de búsqueda está vacío, devuelve todos los datos
      return this.listaUserss;
    }
    // Filtra los datos según el término de búsqueda
    return this.listaUserss.filter(Users => {
      // Filtra solo por cédula (user_id)
      return (
       
        (Users.cedula?.toString() ?? '').includes(this.searchTerm.trim()) 
      );
    });
  }




}
