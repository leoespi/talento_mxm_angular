
export interface Feed {
  id?: number; // El ID puede ser opcional si es generado automáticamente por el servidor
  user_id: number; // User_id debería ser de tipo number y puede ser null si no se conoce aún
  content: string;
  video_link?: string; // Enlace del video opcional
}
