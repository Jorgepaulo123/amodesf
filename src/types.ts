export interface Region {
  name: string;
  lat: number;
  lng: number;
  description: string;
}

export interface Publicacao {
  id: number;
  titulo: string;
  conteudo: string;
  fotos: string[];
  created_at: string;
  updated_at: string;
  categoria: string;
  autor_id: number;
} 