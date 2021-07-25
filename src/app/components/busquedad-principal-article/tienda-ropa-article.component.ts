import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { BusquedaGeneralProductoService } from '../../services/busquedaPrincipalProducto.service';

@Component({
  selector: 'app-tienda-ropa-article',
  templateUrl: './tienda-ropa-article.component.html',
  styleUrls: ['./tienda-ropa-article.component.css'],
  providers: [BusquedaGeneralProductoService]
})
export class TiendaRopaArticleComponent implements OnInit {

  //RECIBE LOS DATOS DEL PRODUCTO
  @Input() article: any;
  @Input() _idnegocio: string;
  @Input() _nameTableSearch: string;

  _imagen: any;

  constructor(private _router: Router,
    private rutaActiva: ActivatedRoute, private _busquedaProductoService: BusquedaGeneralProductoService) { }

  ngOnInit(): void {
    console.log("_nameTableSearch", this._nameTableSearch);
    console.log("_idnegocio",this._idnegocio);

    //RECUPERAMOS LA LISTA DE IMAGENES DEL PRODUCTO
    let imagen = [];
    imagen = this.article.imagen;
    if (imagen.length > 0) {
      //console.log(" Imagen " , imagen[0].ruta);
      //RECUPERADMOS LA PRIMERA IMAGEN
      this.getImageName(imagen[0].ruta);
    }
  }

  //REDIRECCION AL COMPONERNTE DETALLE DEL PRODUCTO CON EL IDNEGOCIO, IDPRODUCTO, NOMBRE TABLA MONGODB
  mostrarDetalleProducto(_id, data, nameTable) {
    //componente a ir ===>>>>> _idNegocio , _idproducto , nombre de la tabla MongoDB
    this._router.navigate(['/busqueda-detalle-producto', _id, data._id, nameTable]);
  }

  /*LLAMADA AL METODO DEL SERVICIO PARA RECUPERAR LA IMAGEN EN TIPO BLOB */
  getImageName(nameImage) {
    this._busquedaProductoService.getImageName(this._idnegocio, this._nameTableSearch, nameImage).subscribe(
      response => {
        this.createImageFromBlob(response, nameImage);
      },
      error => {
        console.log(error);
      }
    );
  }

  imageFile: File;
  imageResultBlob: any;
  //convierte el objecto Blob en un data leido por la etiqueta img
  createImageFromBlob(image: Blob, nameImage) {
    let reader = new FileReader();
    this.imageFile = new File([image], "foto.png", { type: 'image/jpeg' });
    reader.readAsDataURL(this.imageFile);
    reader.onload = (event: any) => {
      this.imageResultBlob = event.target.result;
      this._imagen = this.imageResultBlob;
      console.log("REcuperando imagen " , this._imagen);
    }
  }
}
