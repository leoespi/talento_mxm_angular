import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Incapacidades } from '../../modelos/incapacidades';
import { IncapacidadesService } from '../../servicios/incapacidades.service';
import { subscribe } from 'node:diagnostics_channel';



@Component({
  selector: 'app-create',
  standalone: true,
  providers:[IncapacidadesService],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  value = '';
  token: string | null = null;


  incapcacidadForm = this.fb.group({
    aplica_cobro: null,
    tipo_incapacidad: '',
  
   
    			
  });

  id: string | null;

  constructor(private fb: FormBuilder, private _router: Router, 
    private IncapacidadesServicio: IncapacidadesService, private aRoute: ActivatedRoute) {
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
  agregarIncapacidad(): void {

    const incapacidad: Incapacidades = {
      aplica_cobro: this.incapcacidadForm.get("aplica_cobro")?.value,
      tipo_incapacidad: this.incapcacidadForm.get('tipo_incapacidad')?.value,
      user: this.incapcacidadForm.get('user')?.value,
      user_id: this.incapcacidadForm.get('user_id')?.value,
      cedula: this.incapcacidadForm.get('cedula')?.value!,
      name: this.incapcacidadForm.get('name')?.value,
      dias_incapacidad: this.incapcacidadForm.get('dias_incapacidad')?.value,
      fecha_inicio_incapacidad: this.incapcacidadForm.get('fecha_inicio_incapacidad')?.value!,
    }

    if (this.id !=null){
      // Si hay un ID, actualiza la incapacidad existente
      this.IncapacidadesServicio.updateIncapacidades (this.id,incapacidad,this.token)
      .subscribe(data =>{
        this._router.navigate(['/incapacidades/index']);

      },err => {
        console.log(err);
        this._router.navigate(['/incapacidades/index']);
      }
    );

    }else{
      // Si no hay un ID, agrega una nueva incapacidad
      this.IncapacidadesServicio.addIncapacidades(incapacidad, this.token).subscribe
      (data =>{
        this._router.navigate(['/incapacidades/index']);

      },err => {
        console.log(err);
        this._router.navigate(['/incapacidades/index']);
      }
    );
    }

    
  }


}











