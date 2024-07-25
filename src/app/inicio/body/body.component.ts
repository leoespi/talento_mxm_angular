import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { LoginService } from '../../servicios/login.service';
import { Login } from '../../modelos/login';
import { Router } from '@angular/router';
import { Users } from '../../modelos/users';
import { GlobalComponent } from '../../global/global.component';




@Component({
  selector: 'app-body',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  providers: [LoginService],
  
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss'
})
export class BodyComponent {

  
  loginForm = this.fb.group({
    cedula: '',
    password: ''
  });

  respuesta: Login | null = null;
  clave: string | null = null;
  usuario: Users| null = null;


  constructor(private fb: FormBuilder, private loginService: LoginService, private _router: Router) {

  }

  ngOnInit(): void {
    this.clave=localStorage.getItem("clave");
    if (this.clave) {
      this._router.navigate(['/home/index']);
     
      
    }
  }

  ngOnChanges(): void {

  }

  login(): void {
    this.loginService.login(this.loginForm.get('cedula')?.value, this.loginForm.get('password')?.value)
      .subscribe(rs => {
        this.respuesta = rs;
  
        if (this.respuesta != null && this.respuesta.user !== undefined && this.respuesta.user.rol_id !== undefined  && this.respuesta.user.rol_id !== 2) {
          localStorage.setItem('clave', rs.token);
          localStorage.setItem('rolId', this.respuesta.user.rol_id.toString());
          window.location.reload();
        }
      }, err => {
        console.log(err);
      });
  }
  
  


}
