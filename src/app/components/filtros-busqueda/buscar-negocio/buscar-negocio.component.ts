import { Component, OnInit } from '@angular/core';
import { RegistrarEmpresaService } from '../../../services/mycompany/registrar_empresa.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-buscar-negocio',
  templateUrl: './buscar-negocio.component.html',
  styleUrls: ['./buscar-negocio.component.css'],
  providers: [RegistrarEmpresaService]
})
export class BuscarNegocioComponent implements OnInit {

  keyword = 'name';
  data:any[];

  constructor(private _router: Router ,private _registrarEmpresaService: RegistrarEmpresaService) {
  }

  selectEvent(item) {
    // do something with selected item
    this._router.navigate(
      ['/perfil-negocio', item._id]
    );
  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.
  }

  onFocused(e) {
    // do something when input is focused
  }

  ngOnInit() {
    this.listaNombreNegocios();
  }
 
  listaNombreNegocios() {
  
    this._registrarEmpresaService.listaNombreNegocio().subscribe(
      response => {
       // console.log(response);
        if(response.status =="success"){
          this.data = response.message;
          //console.log(this.data); 
        }
      },
      error => {

      }
    );
  }
 
}