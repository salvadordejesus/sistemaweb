import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { HttpResponse, HttpEventType } from '@angular/common/http';

import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute, Params } from '@angular/router';
import Swal from 'sweetalert2';

import { MuebleriaService } from '../../services/muebleria.service';
import { MuebleriaModel } from '../../models/muebleria';

@Component({
  selector: 'app-add-muebleria',
  templateUrl: './add-muebleria.component.html',
  styleUrls: ['./add-muebleria.component.css'],
  providers: [MuebleriaService]
})
export class AddMuebleriaComponent implements OnInit {

  @ViewChild("contenedorImg") contenedorImg: ElementRef;

  private dataModel: MuebleriaModel;
  public validacionForm: FormGroup;

  private dataModelUpdate: MuebleriaModel;
  public editDatos: Boolean;
  public titlePage: String;
  public _idProducto: string;

  selectedFiles: FileList;
  selecImage: boolean;
  currentFileUpload: File;
  progress: { percentage: number } = { percentage: 0 };
  //Contiene los nombres de las imagenes
  listImagen: any[];

  campaignOne: FormGroup;

  constructor(
    private renderer: Renderer2,
    private _muebleriaService: MuebleriaService,
    private formBuilder: FormBuilder,
    private _router: Router,
    private _activatedRoute: ActivatedRoute
  ) {
    this.editDatos = false;
    this.titlePage = "AGREGAR PRODUCTO";

    this.dataModel = new MuebleriaModel("", "", "", "", "", "", "", "", "", "", "", "", "", "", 0, 0, null, null, 0, null, null);

    //VALIDACION DEL FORMULARIO
    this.validacionForm = this.formBuilder.group({
      nombre: ['', [Validators.required, Validators.maxLength(50)]],
      descripcion: ['', [Validators.nullValidator, Validators.maxLength(300)]],
      especificacion: ['', [Validators.required, Validators.maxLength(200)]],
      alto: ['', [Validators.required, Validators.maxLength(50)]],
      ancho: ['', [Validators.required, Validators.maxLength(50)]],
      profundidad: ['', [Validators.required, Validators.maxLength(50)]],
      peso: ['', [Validators.required, Validators.maxLength(50)]],
      unidadventa: ['Pieza', Validators.required],
      color: ['', [Validators.required, Validators.maxLength(50)]],
      marca: ['', [Validators.nullValidator, Validators.maxLength(50)]],
      tipo_acabado: ['', [Validators.nullValidator, Validators.maxLength(50)]],
      recomendacion_uso: ['', [Validators.nullValidator, Validators.maxLength(200)]],
      otra_inf: ['', [Validators.nullValidator, Validators.maxLength(300)]],
      precio: ['', [Validators.required, Validators.pattern(/^[+]?[0-9]{1,9}(?:.[0-9]{1,2})?$/), Validators.maxLength(10)]],
      precio_anterior: ['', [Validators.required, Validators.pattern(/^[+]?[0-9]{1,9}(?:.[0-9]{1,2})?$/), Validators.maxLength(10)]],
      existencia: ['', [Validators.required, Validators.pattern(/^[0-9]*$/), Validators.maxLength(7)]]
    });

    //=================CODIGO PARA FECHAS==============================
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();

    this.campaignOne = new FormGroup({
      start: new FormControl(new Date(year, month)),
      end: new FormControl(new Date(year, month))
    });
    //==================================================
  }

  ngOnInit(): void {
    this.datosEdit();
  }
  datosEdit() {
    this._idProducto = null;
    this._activatedRoute.params.subscribe(params => {
      let _id = params['_id'];
      //SI SE MANDA UN ID POR PARAMETRO, SE BUSCA LOS DATOS DEL PRODUCTO
      if (_id) {
        this._idProducto = _id;
        this.editDatos = true;
        this.titlePage = "ACTUALIZAR DATOS";

        this._muebleriaService.getProductNegocio(_id).subscribe(

          response => {

            if (response.status == 'success') {
              //Recuperamos la lista de productos
              this.dataModelUpdate = response.message.muebleria;
              //recuperamos la lista de nombres de las imagenes
              this.listImagen = this.dataModelUpdate[0].imagen;
              //recorremos la lista de nombre de las imagenes
              this.selecImage = true;
              if (this.listImagen != null) {
                this.listImagen.forEach(data => {
                  this.getImageName(data.ruta);
                });

                if (this.listImagen.length == 3) {
                  this.selecImage = false;
                }
              }

              this.validacionForm.setValue(
                {
                  nombre: this.dataModelUpdate[0].nombre,
                  descripcion: this.dataModelUpdate[0].descripcion,
                  especificacion: this.dataModelUpdate[0].especificacion,
                  alto: this.dataModelUpdate[0].alto,
                  ancho: this.dataModelUpdate[0].ancho,
                  profundidad: this.dataModelUpdate[0].profundidad,
                  peso: this.dataModelUpdate[0].peso,
                  unidadventa: this.dataModelUpdate[0].unidadventa,
                  color: this.dataModelUpdate[0].color,
                  marca: this.dataModelUpdate[0].marca,
                  tipo_acabado: this.dataModelUpdate[0].tipo_acabado,
                  recomendacion_uso: this.dataModelUpdate[0].recomendacion_uso,
                  otra_inf: this.dataModelUpdate[0].otra_inf,
                  existencia: this.dataModelUpdate[0].existencia,
                  precio: this.dataModelUpdate[0].precio,
                  precio_anterior: this.dataModelUpdate[0].precio_anterior
                }
              );
              this.campaignOne.setValue(
                {
                  start: this.dataModelUpdate[0].fecha_inicio,
                  end: this.dataModelUpdate[0].fecha_fin
                }
              );
            }
          },
          error => {

          }
        );
      }
    });
  }
  onSubmit() {

    this.recogerAsignar();

    if (this.campaignOne.value.start == null || this.campaignOne.value.end == null) {
      Swal.fire('Datos incorrectos',
        'Corrige la fecha de promoción',
        'error');
    } else {

      this._muebleriaService.saveData(this.dataModel).subscribe(
        response => {
          if (response.status == 'success') {
            console.log(response);
            Swal.fire("Producto creado",
              "Datos guardados correctamente",
              "success").then((value) => {
                this._idProducto = response.message;
                this._router.navigate(['/agregar-muebleria', this._idProducto]);
              });
          }
        },
        error => {
        }
      );
    }
  }


  recogerAsignar() {
    if (this._idProducto != null) {
      this.dataModel._id = this._idProducto;
    }
    this.dataModel.imagen = this.listImagen;
    this.dataModel.nombre = this.validacionForm.value.nombre;
    this.dataModel.descripcion = this.validacionForm.value.descripcion;
    this.dataModel.especificacion = this.validacionForm.value.especificacion;
    this.dataModel.alto = this.validacionForm.value.alto;
    this.dataModel.ancho = this.validacionForm.value.ancho;
    this.dataModel.profundidad = this.validacionForm.value.profundidad;
    this.dataModel.peso = this.validacionForm.value.peso;
    this.dataModel.unidadventa = this.validacionForm.value.unidadventa;
    this.dataModel.color = this.validacionForm.value.color;
    this.dataModel.marca = this.validacionForm.value.marca;
    this.dataModel.tipo_acabado = this.validacionForm.value.tipo_acabado;
    this.dataModel.recomendacion_uso = this.validacionForm.value.recomendacion_uso;
    this.dataModel.otra_inf = this.validacionForm.value.otra_inf;
    this.dataModel.existencia = this.validacionForm.value.existencia;
    this.dataModel.precio = this.validacionForm.value.precio;
    this.dataModel.precio_anterior = this.validacionForm.value.precio_anterior;
    this.dataModel.fecha_inicio = this.campaignOne.value.start;
    this.dataModel.fecha_fin = this.campaignOne.value.end;
  }

  /**
   * METODO PARA VERIFICAR SI VA A GUARDAR O ACTUALIZAR
   */
  saveOrUpdate() {
    if (this.editDatos) {
      this.onSubmitEdit();
    } else {
      this.onSubmit();
    }
  }

  /**
   * METODO DE ACTUALIZACION DE DATOS
   */
  onSubmitEdit() {

    this.recogerAsignar();
    if (this.campaignOne.value.start == null || this.campaignOne.value.end == null) {
      Swal.fire('Datos incorrectos',
        'Corrige la fecha de promoción',
        'error');
    } else {
      this._muebleriaService.updateProductNegocio(this._idProducto, this.dataModel).subscribe(
        response => {

          if (response.status == 'success') {
            console.log(response);
            Swal.fire("Producto actualizado",
              "Datos actualizados correctamente",
              "success").then((value) => {
                window.location.href = window.location.href;
              });
          }
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  crearVistasImg(rutaImg, nameImage) {
    var div = this.renderer.createElement("div"); //CREAMOS EL div
    var subdiv = this.renderer.createElement("div"); //CREAMOS EL div
    var btnEliminar = this.renderer.createElement("button"); //CREAMOS EL div
    var textEliminar = this.renderer.createText("Eliminar"); //CREAMOS UN TEXTO
    var img = this.renderer.createElement("img"); //CREAMOS LA IMG

    //SE AÑADE CLASES
    this.renderer.addClass(div, "div-img");
    //this.renderer.setAttribute(div,"#","divImg");
    this.renderer.addClass(subdiv, "div-btn");
    this.renderer.addClass(btnEliminar, "btnPerfil-negocio");
    this.renderer.addClass(btnEliminar, "btnEliminar");

    //EVENTO CLICK PARA LOS BOTONES ELIMINAR
    this.renderer.listen(btnEliminar, 'click', (event) => {
      this.deleteImage(nameImage);
    })

    this.renderer.setAttribute(img, "src", rutaImg);//AÑADIMOS VALOR AL ATRIBUTO SRC
    this.renderer.appendChild(btnEliminar, textEliminar); //AÑADIMOS UN TEXTO AL BOTON
    this.renderer.appendChild(div, img); //AGREGAMOS LA IMG AL CONTENEDOR DIV
    this.renderer.appendChild(subdiv, btnEliminar); //AGREGAMOS EL BOTON ELLIMINAR AL CONTENEDOR SUBDIV
    this.renderer.appendChild(div, subdiv); //AGREGAMOS EL div AL CONTENEDOR DIV principal
    this.renderer.appendChild(this.contenedorImg.nativeElement, div); //AGREGAMOS EL div AL CONTENEDOR DIV principal
  }

  tamanioImg: number;
  /*SELECCIONAMOS LA IMAGEN*/
  selectImage(event) {
    this.tamanioImg = 400000;
    this.selectedFiles = event.target.files;
    if (this.selectedFiles[0].size > this.tamanioImg) {
      this.selectedFiles = undefined;
      Swal.fire("Tamaño de la imagen grande",
        "La imagen debe pesar menos de " + this.tamanioImg / 1000 + " KB",
        "info");
    }
  }

  /*SUBIR LA IMAGEN AL SERVIDOR NODEJS*/
  uploadImage() {
    //CAMBIO<============================= ya no hay cambios
    if (this.listImagen == null) {
      this.listImagen = [];
    }

    if (this.listImagen.length < 3) {

      this.progress.percentage = 0;
      this.currentFileUpload = this.selectedFiles.item(0);

      this._muebleriaService.uploadImage(this.currentFileUpload, this._idProducto).subscribe(
        event => {

          if (event.type === HttpEventType.UploadProgress) {
            this.progress.percentage = Math.round(100 * event.loaded / event.total);
          } else if (event instanceof HttpResponse) {
            window.location.href = window.location.href;
            this.datosEdit();
          }

        });

      this.selectedFiles = undefined;
    } else {
      Swal.fire("Archivo máximo",
        "Solo puedes guardar 3 imagenes, gracias",
        "info");
    }
  }

  /*LLAMADA AL METODO DEL SERVICIO PARA RECUPERAR LA IMAGEN EN TIPO BLOB */
  getImageName(nameImage) {

    this._muebleriaService.getImageName(nameImage).subscribe(
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
      this.crearVistasImg(this.imageResultBlob, nameImage);
    }
  }

  /*ELIMINA LAS IMAGENES GUARDADAS EN EL BACKEND */
  deleteImage(nameImage) {
    this._muebleriaService.deleteImageProduct(nameImage).subscribe(
      response => {

        if (response.status == 'success') {
          this.deleteImageMongodb(nameImage);
        }
      }
    );
  }

  /*ELIMINA LOS DATOS GUARDADOS EN MONGODB */
  deleteImageMongodb(nameImage) {
    var index = this.listImagen.findIndex(function (item, i) {
      return item.ruta === nameImage
    });
    //primer parametro =>posicion
    //segundo parametro =>cantida de datos a eliminar comenzando desde la posicion indicada
    this.listImagen.splice(index, 1);
    this.onSubmitEdit();
  }

  //================MOSTRAR Y OCULTAR CONTADOR DE LETRAS EN LOS INPUT================================

  //OBJETO JSON DONDE ESTAS TODO LOS ATRIBUTOS DEL PRODUCTO
  listaDatosMostrar = {
    nombre: false,
    descripcion: false,
    especificacion: false,
    alto: false,
    ancho: false,
    profundidad: false,
    peso: false,
    color: false,
    marca: false,
    tipo_acabado: false,
    recomendacion_uso: false,
    otra_inf: false,
    precio: false,
    precio_anterior: false,
    existencia: false
  }
  //METODO PAR MOSTRAR/OCULTAR CADA CAMPO
  showNumber(nombreCampo, valor) {
    if (nombreCampo == "nombre") { this.listaDatosMostrar.nombre = valor; }
    if (nombreCampo == "descripcion") { this.listaDatosMostrar.descripcion = valor; }
    if (nombreCampo == "especificacion") { this.listaDatosMostrar.especificacion = valor; }
    if (nombreCampo == "alto") { this.listaDatosMostrar.alto = valor; }
    if (nombreCampo == "ancho") { this.listaDatosMostrar.ancho = valor; }
    if (nombreCampo == "profundidad") { this.listaDatosMostrar.profundidad = valor; }
    if (nombreCampo == "peso") { this.listaDatosMostrar.peso = valor; }
    if (nombreCampo == "color") { this.listaDatosMostrar.color = valor; }
    if (nombreCampo == "marca") { this.listaDatosMostrar.marca = valor; }
    if (nombreCampo == "tipo_acabado") { this.listaDatosMostrar.tipo_acabado = valor; }
    if (nombreCampo == "recomendacion_uso") { this.listaDatosMostrar.recomendacion_uso = valor; }
    if (nombreCampo == "otra_inf") { this.listaDatosMostrar.otra_inf = valor; }
    if (nombreCampo == "precio") { this.listaDatosMostrar.precio = valor; }
    if (nombreCampo == "precio_anterior") { this.listaDatosMostrar.precio_anterior = valor; }
    if (nombreCampo == "existencia") { this.listaDatosMostrar.existencia = valor; }
  }

}
