import { Component,  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReferidosService } from '../../servicios/crear-referido-service.service';
import { Referidos } from '../../modelos/referidos';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-index-referidos',
  standalone: true,
  providers:[ReferidosService],
  imports: [ FormsModule,CommonModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent  {
  
  referidos: Referidos[] = [];
  cargandoReferidos: boolean = false; 
  id: string | null;
  token: string | null = null;

  constructor(private referidosService: ReferidosService,  private router: Router, private aRouter: ActivatedRoute) { 
    this.id = this.aRouter.snapshot.paramMap.get('id');

  }

  ngOnInit(): void {
    this.recuperarToken();

    this.loadReferidos();
  }

   // Recupera el token del almacenamiento local
   recuperarToken(): void {
    this.token = localStorage.getItem('clave');
    if (this.token == null) {
      this.router.navigate(['/']);
    }
  }
  
  loadReferidos(): void {
    this.cargandoReferidos = true; // Activar el estado de carga al inicio de la solicitud
    this.referidosService.getReferidos(this.token).subscribe(
      (data: any) => {
        console.log(data);
        this.referidos = data.referidos;
        this.cargandoReferidos = false; // Desactivar el estado de carga al recibir la respuesta
      },
      (error: any) => {
        console.log(error);
        this.cargandoReferidos = false; // Desactivar el estado de carga en caso de error
      }
    );
  }


  downloadDocumento(id: number | undefined): void {
    if (id !== undefined) {
      this.referidosService.downloadDocumento(id).subscribe((data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'documento.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, (error: any) => {
        console.log(error);
      });
    }
  }

  deleteReferido(id: number | undefined): void {
    if (id !== undefined) {
      this.referidosService.deleteReferido(id).subscribe(
        () => {
          this.loadReferidos();
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }



  // Redirige a la página de edición de una incapacidad por su ID
  editarReferidos(id: any): void {
    this.router.navigateByUrl("/referidos/editar/"+id);
  }
}
