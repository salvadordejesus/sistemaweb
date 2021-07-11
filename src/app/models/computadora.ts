export class ComputadoraModel {
    constructor(
        public _id: string,
        public nombre: string,
        public descripcionPantalla: string,
        public descripcionSO: string,
        public descripcionAlmacenamiento: string,
        public descripcionMemoriaRam: string,
        public MemoriaRamExpandible: string,
        public DescripcionGPU: string,
        public sistemaEnfriamiento:string,
        public tecnologiaDesbloqueo:string,
        public tecnologiaAudio: string,
        public color:string,
        public marca:string,
        public grosor: string,
        public peso: string,
        public cpu: string,
        public marcaCPU: string,
        public modeloCPU: string,
        public generacionCPU: string,
        public velocidadCPU: string,
        public almacenamientoEmmc: string,
        public tipoTeclado: string,
        public resolucion: string,
        public camaraWeb: string,
        public lectorDisco: string,
        public microfono: string,
        public cargador:string,
        public entradaHdmi: string,
        public puertosUsb: string,
        public puertoEthernet:string,
        public tarjetaEthernet:string,
        public bluetooth: string,
        public duracionBateria: string,
        public tipoBateria: string,
        public medidas: string,
        public unidadventa: string,
        public garantia: string,
        public otra_inf: string,
        public existencia: Number,
        public precio:  Number,
        public precio_anterior:number,
        public fecha_inicio:Date,
        public fecha_fin:Date,
        public imagen: any[],
        public comentarios:[Object]
    ) { }
} 