import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { HorariosService } from '../../servicios/horarios.service';
import { Horarios } from '../../modelos/horarios';
import { CommonModule } from '@angular/common'; // Importa CommonModule

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'] // Corrige el nombre aquí
})
export class HorariosComponent implements OnInit {
  horarios: Horarios[] = [];

  constructor(private horariosService: HorariosService) {}

  ngOnInit(): void {
    this.fetchHorarios();
  }

  fetchHorarios(): void {
    const access_token = localStorage.getItem('access_token'); // Obtén el token del almacenamiento local
    if (access_token) {
      this.horariosService.getHorarios(access_token).subscribe(
        (data) => {
          this.horarios = data;
        },
        (error) => {
          console.error('Error al obtener los horarios', error);
        }
      );
    } else {
      console.error('No se encontró el access_token');
    }
  }
}
