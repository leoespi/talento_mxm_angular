import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HorariosService } from '../../servicios/horarios.service';
import { Horarios } from '../../modelos/horarios';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-index',
  standalone: true,
  providers: [HorariosService],
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {
  horarios: Horarios[] = []; // Inicialización
  token: string | null = null;
  selectedFile: File | null = null; // Archivo seleccionado

  constructor(
    private horariosService: HorariosService,
    private router: Router,
    private aRouter: ActivatedRoute
  ) {
    const id = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.recuperarToken();
    this.loadHorarios(); // Cargar horarios al iniciar
  }

  recuperarToken(): void {
    this.token = localStorage.getItem('clave');
    if (this.token == null) {
      this.router.navigate(['/']);
    }
  }

  loadHorarios(): void {
    this.horariosService.getHorarios(this.token).subscribe(
      (data: any) => {
        console.log("Datos recibidos:", data);
        this.horarios = data.horarios || [];
        console.log("Horarios:", this.horarios);
      },
      err => {
        console.log("Error al cargar horarios:", err);
      }
    );
  }
  

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0]; // Obtiene el primer archivo seleccionado
  }

  importarExcel(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('import_file', this.selectedFile); // Agrega el archivo al FormData
  
      if (this.token) {
        this.horariosService.importHorarios(formData, this.token).subscribe(
          response => {
            console.log('Archivo importado con éxito:', response);
            this.loadHorarios(); // Vuelve a cargar los horarios
          },
          error => {
            console.error('Error al importar el archivo:', error);
          }
        );
      } else {
        console.error('No se ha encontrado el token.');
      }
    } else {
      console.error('No se ha seleccionado ningún archivo.');
    }
  }
}
