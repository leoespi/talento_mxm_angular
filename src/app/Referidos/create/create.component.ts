import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Referidos } from '../../modelos/referidos';
import { ReferidosService } from '../../servicios/crear-referido-service.service';
import { subscribe } from 'node:diagnostics_channel';



@Component({
  selector: 'app-create',
  standalone: true,
  providers:[ReferidosService],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {

  value = '';
  token: string | null = null;

  referidosForm = this.fb.group({
    aplica_cobro: null,
    estado: '',			
  });

  id: string | null;

  constructor(private fb: FormBuilder, private _router: Router, 
    private referidoservicio: ReferidosService, private aRoute: ActivatedRoute) {
    this.id = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.recuperarToken();
    //this.verEditar();
    
  }

   // Recupera el token
   recuperarToken(){
    this.token = localStorage.getItem('clave');
    if (this.token == null) {
      this._router.navigate(['/']);
    }
  }


  

  // Agrega una nueva incapacidad 
  agregarReferidos(): void {

    const referidos: Referidos = {
      estado: this.referidosForm.get('estado')?.value,
      user: this.referidosForm.get('user')?.value,
      user_id: this.referidosForm.get('user_id')?.value,
      cedula: this.referidosForm.get('cedula')?.value!,
      name: this.referidosForm.get('name')?.value,
      
    }

    if (this.id !=null){
      // Si hay un ID, actualiza la incapacidad existente
      this.referidoservicio.updateReferidos (this.id,referidos,this.token)
      .subscribe(data =>{
        this._router.navigate(['/referidos/index']);

      },err => {
        console.log(err);
        this._router.navigate(['/referidos/index']);
      }
    );

    

    
  }



  }}





