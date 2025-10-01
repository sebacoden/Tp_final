export class Mensaje {
  constructor(contenido = '', tipo = 'usuario') {
    this.contenido = contenido;
    this.tipo = tipo; // 'usuario' o 'asistente'
  }
}
