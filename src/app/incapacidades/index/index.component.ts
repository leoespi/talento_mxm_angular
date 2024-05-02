import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncapacidadesService } from '../../servicios/incapacidades.service'; // Asegúrate de importar el servicio correcto
import { Incapacidades } from '../../modelos/incapacidades'; // Asegúrate de importar el modelo correcto
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-index',
  standalone: true,
  providers : [IncapacidadesService],
  imports: [CommonModule, FormsModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent {

  id: string | null;

  listarIncapacidades: Incapacidades[] = [];
  token: string | null = null;
  searchTerm: string = '';
  clave: string | null = null;


  constructor(private incapacidadesService: IncapacidadesService, private router: Router, private aRouter: ActivatedRoute) {

    this.id=this.aRouter.snapshot.paramMap.get('id');
    this.searchTerm = '';


   }

  ngOnInit(): void {
    this.recuperarToken();
    this.cargarIncapacidades();
  }

  recuperarToken() {
    this.token = localStorage.getItem('clave');
    if (this.token == null) {
      this.router.navigate(['/']);
    }
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
  
  
  

  



  downloadIncapacidades(): void {
    this.incapacidadesService.downloadIncapacidades(this.token).subscribe((data: Blob) => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'incapacidades.xlsx'; // Cambia la extensión del archivo según el tipo de archivo que Laravel devuelve
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, error => {
      console.log(error);
    });
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

  filtrarIncapacidades(): Incapacidades[] {
    if (!this.searchTerm.trim()) {
      // Si el término de búsqueda está vacío, devuelve todos los datos
      return this.listarIncapacidades;
    }
    // Filtra los datos según el término de búsqueda
    return this.listarIncapacidades.filter(incapacidad => {
      // Filtra solo por cédula (user_id)
      return (
        (incapacidad.cedula?.toString() ?? '').includes(this.searchTerm.trim()) 
      );
    });
  }
  
}
