import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

import { Router, ActivatedRoute } from '@angular/router';
import { Cesantias } from '../../modelos/cesantias';
import { CesantiasService } from '../../servicios/cesantias.service';

@Component({
  selector: 'app-create',
  standalone: true,
  providers: [CesantiasService],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './create.component.html',
  styleUrl: './create.component.scss'
})
export class CreateComponent {
  value = '';
  token: string | null = null;

  cesantiaForm = this.fb.group({
    estado: '',
    tipo_cesantia_reportada: '',
  
  });

  id: string | null;

  constructor(private fb: FormBuilder, private _router: Router, 
    private cesantiasService: CesantiasService, private aRoute: ActivatedRoute) {
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


  // Agrega una nueva cesantias 
  agregarCesantias(): void {

    const cesantias: Cesantias = {
      estado: this.cesantiaForm.get('estado')?.value,
      tipo_cesantia_reportada: this.cesantiaForm.get('tipo_cesantia_reportada')?.value,
      user: this.cesantiaForm.get('user')?.value,
      user_id: this.cesantiaForm.get('user_id')?.value,
      cedula: this.cesantiaForm.get('cedula')?.value!,
      name: this.cesantiaForm.get('name')?.value,
      
    }

    if (this.id !=null){
      // Si hay un ID, actualiza la cesantias existente
      this.cesantiasService.updateCesantias (this.id,cesantias,this.token)
      .subscribe(data =>{
        this._router.navigate(['/cesantias/index']);

      },err => {
        console.log(err);
        this._router.navigate(['/cesantias/index']);
      }
    );

    }else{
      // Si no hay un ID, agrega una nueva cesantia
      this.cesantiasService.addCesantias(cesantias, this.token).subscribe
      (data =>{
        this._router.navigate(['/cesantias/index']);

      },err => {
        console.log(err);
        this._router.navigate(['/cesantias/index']);
      }
    );
    }

    
  }





}
