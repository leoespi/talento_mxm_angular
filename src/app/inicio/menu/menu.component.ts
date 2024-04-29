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


  constructor( private router: Router){

  }

  ngOnInit():void {

    if(this.clave == null){
      this.clave=localStorage.getItem('clave');

    }
  }
  

  logout():void {
    localStorage.clear();
    window.location.reload();

  }

}
