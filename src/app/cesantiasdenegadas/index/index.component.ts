import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CesantiasDenegadasService } from '../../servicios/cesantias-denegadas.service';
import { Cesantias } from '../../modelos/cesantias';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-index',
  standalone: true,
  providers:[CesantiasDenegadasService],
  imports: [FormsModule,CommonModule],
  templateUrl: './index.component.html',
  styleUrl: './index.component.scss'
})
export class IndexComponent {

  id: string | null;
  listarCesantias: Cesantias[] = [];
  token: string | null = null;
  searchTerm: string = '';
  clave: string | null = null;
  yearToDownload: number = 0; // Declaración de la propiedad yearToDownload   
   

  
  tipoCesantiasSeleccionada: string = '';
  tiposCesantias: string[] = [];


  constructor(private CesantiasDenegadasServicio: CesantiasDenegadasService , private router: Router, private aRouter: ActivatedRoute) {
    this.id = this.aRouter.snapshot.paramMap.get('id');
    this.searchTerm = '';
  }

  ngOnInit(): void {
    this.recuperarToken(); // Recuperar el token primero
    this.cargarCesantias(); // Llamar a cargarCesantias para cargar los datos
  }
  


  // Recupera el token del almacenamiento local
  recuperarToken(): void {
    this.token = localStorage.getItem('clave');
    if (this.token == null) {
      this.router.navigate(['/']);
    }
  }

  // Carga las cesantias desde el servidor
  cargarCesantias(): void {
    this.CesantiasDenegadasServicio.getCesantiasDenegadas(this.token).subscribe(
      (data: any) => {
        console.log(data);
        this.listarCesantias = data.denyCesantia; // Asegúrate de que el nombre sea correcto según la respuesta de tu API
      },
      err => {
        console.log(err);
      }
    );
  }
  



}
