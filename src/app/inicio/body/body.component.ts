import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { LoginService } from '../../servicios/login.service';
import { Login } from '../../modelos/login';
import { Router } from '@angular/router';
import { Users } from '../../modelos/users';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [LoginService],
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent {
  
  loginForm = this.fb.group({
    cedula: '',
    password: ''
  });

  respuesta: Login | null = null;
  clave: string | null = null;
  usuario: Users | null = null;

  roles = [
    { id: 1, name: 'Administrador' },
    { id: 3, name: 'Comunicacion' },
    { id: 4, name: 'Superadmin' }
  ]; // Simulación de roles, reemplaza con una llamada real a tu API si es necesario

  constructor(private fb: FormBuilder, private loginService: LoginService, private _router: Router) { }

  ngOnInit(): void {
    this.clave = localStorage.getItem("clave");
    if (this.clave) {
      this._router.navigate(['/home/index']);
    }
  }

  login(): void {
    this.loginService.login(this.loginForm.get('cedula')?.value, this.loginForm.get('password')?.value)
      .subscribe(rs => {
        this.respuesta = rs;

        if (this.respuesta != null && this.respuesta.user !== undefined && this.respuesta.user.rol_id !== undefined && this.respuesta.user.rol_id !== 2) {
          localStorage.setItem('clave', rs.token);
          localStorage.setItem('rolId', this.respuesta.user.rol_id.toString());
          window.location.reload();
        }
      }, err => {
        console.log(err);
      });
  }

  registrarUsuario() {
    const rolesOptions = this.roles.map(role => `<option value="${role.id}">${role.name}</option>`).join('');
    
    Swal.fire({
      title: 'Registro de Administrator',
      html: `
        <div style="text-align: center;">
          <input type="text" id="name" class="swal2-input" placeholder="Nombre">
          <input type="text" id="cedula" class="swal2-input" placeholder="Cédula">
          <input type="text" id="email" class="swal2-input" placeholder="Email">
          <input type="password" id="password" class="swal2-input" placeholder="Contraseña">
          <select id="rol_id" class="swal2-select">
            <option value="">Seleccione un rol</option>
            ${rolesOptions}
          </select>
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Registrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#dc3545',
      preConfirm: () => {
        const name = (document.getElementById('name') as HTMLInputElement).value;
        const cedula = (document.getElementById('cedula') as HTMLInputElement).value;
        const email = (document.getElementById('email') as HTMLInputElement).value;
        const password = (document.getElementById('password') as HTMLInputElement).value;
        const rol_id = (document.getElementById('rol_id') as HTMLSelectElement).value;

        if (!name ||!cedula || !email || !password || !rol_id) {
          Swal.showValidationMessage('Por favor completa todos los campos');
        }
        return { name, cedula, email, rol_id, password };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.loginService.Register(result.value.name, result.value.cedula, result.value.email, result.value.rol_id, result.value.password)
          .subscribe(response => {
            Swal.fire({
              icon: 'success',
              title: '¡Registro Exitoso!',
              text: 'Tu cuenta ha sido creada con éxito.',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#28a745'
            });
          }, err => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo registrar el usuario.',
              confirmButtonText: 'Intenta de nuevo',
              confirmButtonColor: '#dc3545'
            });
            console.error(err);
          });
      }
    });
  }
}
