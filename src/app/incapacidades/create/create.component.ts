import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Incapacidades } from '../../modelos/incapacidades';
import { IncapacidadesService } from '../../servicios/incapacidades.service';



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
    aplica_cobro: false,
    tipo_incapacidad: '',
  
   
    			
  });

  id: string | null;

  constructor(private fb: FormBuilder, private _router: Router, 
    private IncapacidadesServicio: IncapacidadesService, private aRoute: ActivatedRoute) {
    this.id = this.aRoute.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.recuperarToken();
    this.verEditar();
    
  }

  recuperarToken(){
    this.token = localStorage.getItem('clave');
    if (this.token == null) {
      this._router.navigate(['/']);
    }
  }

  verEditar(): void {
    if (this.id != null) {
      this.IncapacidadesServicio.getIncapacidades(this.token).subscribe(
        data => {
          this.incapcacidadForm.setValue({
            aplica_cobro: data.aplica_cobro || false, // Asigna un valor por defecto si data.aplica_cobro es nulo
            tipo_incapacidad: data.tipo || '',
            // Otros campos del formulario...
          })
        },
        err => {
          console.log(err);
        }
      )
    }
  }


  agregarIncapacidad(): void {
    // Obtén el valor actual de aplica_cobro y tipo_incapacidad del formulario
    const aplica_cobro = this.incapcacidadForm.get('aplica_cobro')?.value;
    const tipo_incapacidad = this.incapcacidadForm.get('tipo_incapacidad')?.value;
  
    // Crea un objeto Incapacidades solo con los campos que deseas editar
    const incapacidades: Partial<Incapacidades> = {
      aplica_cobro: aplica_cobro,
      tipo_incapacidad: tipo_incapacidad,
    };
  
    console.log(incapacidades);
  
    // Resto del código...
  }
  
  





}











