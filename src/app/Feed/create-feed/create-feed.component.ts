import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FeedService } from '../../servicios/feed.service';
import { Feed } from '../../modelos/feed';


import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import {  ReactiveFormsModule } from '@angular/forms';
import {  ActivatedRoute } from '@angular/router'; 


@Component({
  selector: 'app-create-feed',
  standalone : true,
  providers : [FeedService],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, ReactiveFormsModule],

  templateUrl: './create-feed.component.html',
  styleUrls: ['./create-feed.component.scss']
})
export class CreateFeedComponent implements OnInit {
  feedForm: FormGroup;
  token: string = ''; // Aseguramos que token siempre sea de tipo string
  images: File[] = [];
  userId: number = 4; // Usuario predefinido con user_id = 4

  constructor(
    private feedService: FeedService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.feedForm = this.fb.group({
      content: ['', Validators.required],
      images: [''],
      videoLink: ['']
    });
  }

  ngOnInit(): void {
    this.recuperarToken();
  }

  recuperarToken(): void {
    this.token = localStorage.getItem('clave') || ''; // Asignamos '' si no hay token
    if (!this.token) {
      this.router.navigate(['/']); // Redirige si no hay token
    }
  }

  onSubmit(): void {
    if (this.feedForm.invalid) {
      console.error('Formulario no válido');
      return;
    }

    const formData = new FormData();
    formData.append('content', this.feedForm.value.content);
    formData.append('video_link', this.feedForm.value.videoLink);

    this.images.forEach((image) => {
      formData.append('images[]', image, image.name);
    });

    // Crear un objeto Feed con los datos necesarios
    const feed: Feed = {
      content: this.feedForm.value.content,
      user_id: this.userId,
    };

    this.feedService.createFeed(feed, this.token, formData).subscribe(
      (response: any) => {
        console.log('Feed creado exitosamente:', response);
        this.router.navigate(['/feeds/listado']); // Redirige a la lista de feeds
      },
      (error: any) => {
        console.error('Error creando feed:', error);
      }
    );
  }

  onFileSelected(event: any): void {
    this.images = Array.from(event.target.files);
  }
}