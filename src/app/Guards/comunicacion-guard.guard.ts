// comunicacion.guard.ts

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComunicacionGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const rolId = localStorage.getItem('rolId');

    // Verificar si el rolId es 3 (Comunicacion)
    if (rolId && parseInt(rolId, 10) === 3) {
      return true; // Permite el acceso si el rol es Comunicacion
    } else {
      // Redirige a otra ruta o realiza alguna acción de denegación de acceso
      this.router.navigate(['/inicio/body']); // Redirige a la página de inicio o a una página de acceso denegado
      return false;
    }
  }
}
