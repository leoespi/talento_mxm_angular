import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent implements OnInit {

  id: string | null;
  token: string | null = null;
  clave: string | null = null;
  
  // Reemplaza estas URLs con las URLs de tus imágenes
  images: string[] = [
    'assets/img/sede1.jpg',
    'assets/img/sede2.jpg',
    'assets/img/sede3.jpg',

    'assets/img/sede4.jpg',
    'assets/img/sede5.jpg',
    'assets/img/sede6.jpg',

    'assets/img/sede7.jpg',
    'assets/img/sede8.jpg',
    'assets/img/sede9.jpg',

    'assets/img/sede10.jpg',
    'assets/img/sede11.jpg',
    'assets/img/sede12.jpg',

    'assets/img/sede13.jpg',
    'assets/img/sede14.jpg',
    'assets/img/sede15.jpg',

    'assets/img/sede16.jpg',
    'assets/img/sede17.jpg',
    'assets/img/sede18.jpg',

    'assets/img/sede19.jpg',
    'assets/img/sede20.jpg',
    

    
  ];
  currentIndex: number = 0;

  constructor(private router: Router, private aRouter: ActivatedRoute) {
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.recuperarToken();
    this.startImageRotation();
  }

  recuperarToken(): void {
    this.token = localStorage.getItem('clave');
    if (this.token == null) {
      this.router.navigate(['/']);  
    }
  }

  startImageRotation(): void {
    setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 5000); // Cambia la imagen cada 10 segundos
  }
}
