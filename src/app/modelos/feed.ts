export interface FeedImage {
  image_path: string; // Definición para las imágenes
}

export interface Feed {
  id?: number;
  user_id: number;
  content: string;
  image_path: string; // Este puede ser el path de una imagen principal
  video_link?: string;
  images?: FeedImage[]; // Array de imágenes adicionales
}
