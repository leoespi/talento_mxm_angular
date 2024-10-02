import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  clave: string | null = null;
  rolId: number | null = null; // Almacena el rol del usuario

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.clave = localStorage.getItem('clave');
    this.rolId = parseInt(localStorage.getItem('rolId') || '0', 10); // Parsea el rolId a número
  }

  // Método para navegar a diferentes rutas
  navigate(path: string): void {
    this.router.navigate([path]);
  }

  logout(): void {
    localStorage.clear();
    window.location.reload();
  }
}
