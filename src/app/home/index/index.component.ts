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
    'assets/img/flayer1.jpg',
    'assets/img/flayer2.jpg',
    'assets/img/flayer3.jpg',

    
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
    }, 8000); // Cambia la imagen cada 10 segundos
  }
}
