export class OpticaModel {
    constructor(
        public _id: string,
        public nombre: string,
        public descripcion: string,
        public incluye: string,
        public unidadventa:string,
        public marca: string,
        public numero: string,
        public precio: number,
        public precio_anterior:number,
        public fecha_inicio:Date,
        public fecha_fin:Date,
        public existencia: number,
        public imagen: any[],
        public comentarios:any[]
    ) { }
} 