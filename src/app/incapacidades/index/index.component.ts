import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncapacidadesService } from '../../servicios/incapacidades.service'; // Asegúrate de importar el servicio correcto
import { Incapacidades } from '../../modelos/incapacidades'; // Asegúrate de importar el modelo correcto
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-index',
  standalone: true,
  providers : [IncapacidadesService],
  imports: [CommonModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent {

  id: string | null;

  listarIncapacidades: Incapacidades[] = [];
  token: string | null = null;
  clave: string | null = null;


  constructor(private incapacidadesService: IncapacidadesService, private router: Router, private aRouter: ActivatedRoute) {

    this.id=this.aRouter.snapshot.paramMap.get('id');


   }

  ngOnInit(): void {
    this.recuperarToken();
    this.cargarIncapacidades();
  }

  cargarIncapacidades(): void {
    this.incapacidadesService.getIncapacidades(this.token).subscribe(
      (data: any) => {
        console.log(data);
        this.listarIncapacidades = data.incapacidades; // Modificación: Asigna data.feeds en lugar de data
      },
      err => {
        console.log(err);
      }
    );
  }
  
  
  

  recuperarToken() {
    this.token = localStorage.getItem('clave');
    if (this.token == null) {
      this.router.navigate(['/']);
    }
  }

  eliminarFeeds(id: any): void {
    this.incapacidadesService.deleteIncapacidades(id, this.token).subscribe(
      data => {
        this.cargarIncapacidades();
      },
      error => {
        console.log(error);
      }
    );
  }

  editarFeeds(id: any): void {
    this.router.navigateByUrl("/feeds/editar/" + id);
  }

}
