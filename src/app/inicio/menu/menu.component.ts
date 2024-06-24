import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  clave: string | null = null;
  rolId: number | null = null; // Agrega esta variable para almacenar el rol del usuario

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
