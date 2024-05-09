import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncapacidadesService } from '../../servicios/incapacidades.service';
import { Incapacidades } from '../../modelos/incapacidades';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-index',
  standalone: true,
  providers: [IncapacidadesService],
  imports: [CommonModule, FormsModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent {

  id: string | null;

  listarIncapacidades: Incapacidades[] = [];
  token: string | null = null;
  searchTerm: string = '';
  clave: string | null = null;

  constructor(private incapacidadesService: IncapacidadesService, private router: Router, private aRouter: ActivatedRoute) {
    this.id = this.aRouter.snapshot.paramMap.get('id');
    this.searchTerm = '';
  }

  ngOnInit(): void {
    this.recuperarToken();
    this.cargarIncapacidades();
  }

  recuperarToken(): void {
    this.token = localStorage.getItem('clave');
    if (this.token == null) {
      this.router.navigate(['/']);
    }
  }

  cargarIncapacidades(): void {
    this.incapacidadesService.getIncapacidades(this.token).subscribe(
      (data: any) => {
        console.log(data);
        this.listarIncapacidades = data.incapacidades;
      },
      err => {
        console.log(err);
      }
    );
  }


 // visualizarImagen(uuid: string): void {
   // this.incapacidadesService.visualizarImagen(uuid, this.token).subscribe((imgSrc: string) => {
      // Asigna el src de la imagen al elemento img en la plantilla HTML
    //  document.getElementById('imagenVisualizada')!.setAttribute('src', imgSrc);
   // }, error => {
   // console.log(error);
   // });
  //}

  downloadIncapacidades(): void {
    this.incapacidadesService.downloadIncapacidades(this.token).subscribe((data: Blob) => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'incapacidades.xlsx';
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
      return this.listarIncapacidades;
    }
    return this.listarIncapacidades.filter(incapacidad => {
      return (
        (incapacidad.user?.cedula?.toString() ?? '').includes(this.searchTerm.trim())
      );
    });
  }
  


  downloadImage(uuid: string): void {
    this.incapacidadesService.downloadImage(uuid, this.token).subscribe((data: Blob) => {
      const url = window.URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'imagen.jpg'; // Cambia 'imagen.jpg' por el nombre adecuado
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }, error => {
      console.log(error);
    });
  }
  


  
}
