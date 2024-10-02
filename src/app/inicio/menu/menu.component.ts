import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Asegúrate de importar RouterModule

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule], // Agrega RouterModule aquí
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'] // Corrige 'styleUrl' a 'styleUrls'
})
export class MenuComponent {
  clave: string | null = null;
  rolId: number | null = null; // Almacena el rol del usuario

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.clave = localStorage.getItem('clave');
    this.rolId = parseInt(localStorage.getItem('rolId') || '0', 10); // Parsea el rolId a número
  }

  logout(): void {
    localStorage.clear();
    window.location.reload();
  }
}
