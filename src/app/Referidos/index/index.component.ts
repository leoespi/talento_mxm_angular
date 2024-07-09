import { Component,  } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReferidosService } from '../../servicios/crear-referido-service.service';
import { Referidos } from '../../modelos/referidos';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-index-referidos',
  standalone: true,
  providers:[ReferidosService],
  imports: [ FormsModule,CommonModule],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss']
})
export class IndexComponent  {
  
  referidos: Referidos[] = [];

  constructor(private referidosService: ReferidosService) { }

  ngOnInit(): void {
    this.loadReferidos();
  }

  loadReferidos(): void {
    this.referidosService.getReferidos().subscribe(
      (data: any) => {
        console.log(data);
        this.referidos = data.referidos;
      },
      (error: any) => {
        console.log(error);
      }
    );
  }

  downloadDocumento(id: number | undefined): void {
    if (id !== undefined) {
      this.referidosService.downloadDocumento(id).subscribe((data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'documento.pdf';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }, (error: any) => {
        console.log(error);
      });
    }
  }

  deleteReferido(id: number | undefined): void {
    if (id !== undefined) {
      this.referidosService.deleteReferido(id).subscribe(
        () => {
          this.loadReferidos();
        },
        (error: any) => {
          console.log(error);
        }
      );
    }
  }
}
