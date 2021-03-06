import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatosGlobales } from '../datosGlobales';

@Injectable()
export class ImgLineaNegocioService {

    public _datosGlobales: DatosGlobales;
    private tblName: string;
    private httpHeaders: HttpHeaders;
    private httpHeadersImage: HttpHeaders;

    constructor(
        private _http: HttpClient,
    ) {
        this._datosGlobales = new DatosGlobales();

        this.httpHeaders = new HttpHeaders().set('Authorization', this._datosGlobales.getAuthorization);

        this.httpHeaders = this.httpHeaders.append('Content-Type', 'application/json');

        this.tblName = "img_linea_negocio";
    }

    getData(_id): Observable<any> {
        return this._http.get(this._datosGlobales.urlApi + this.tblName + '/get-data/' + _id, { headers: this.httpHeaders });
    }

    saveData(dataModel): Observable<any> {
        let params = JSON.stringify(dataModel);
        return this._http.post(this._datosGlobales.urlApi + this.tblName + '/save-data', params, { headers: this.httpHeaders });
    }

    getListNameImage():Observable<any>{
        return this._http.get(this._datosGlobales.urlApi + this.tblName + '/getListNameImage', { headers: this.httpHeaders });
    }

    getListProductNegocio(estado): Observable<any> {
        return this._http.get(this._datosGlobales.urlApi + this.tblName + '/getAllProductNegocio/' + estado, { headers: this.httpHeaders });
    }

    updateData(_id, dataModel): Observable<any> {
        let params = JSON.stringify(dataModel);
        return this._http.put(this._datosGlobales.urlApi + this.tblName + '/update-data/' + _id, params, { headers: this.httpHeaders });
    }

    deleteData(_id): Observable<any> {
        return this._http.delete(this._datosGlobales.urlApi + this.tblName + '/delete-data/' + _id, { headers: this.httpHeaders });
    }

    searchProductName(nameproduct): Observable<any> {
        return this._http.get(this._datosGlobales.urlApi + this.tblName + '/searchproductName/' + nameproduct, { headers: this.httpHeaders });
    }

    /*SUBIDA DE LA IMAGEN */
    uploadImage(file: File, _idDocument): Observable<any> {
        const formdata: FormData = new FormData();
        formdata.append('file', file);

        //this.httpHeadersImage = new HttpHeaders().set('Authorization', this._datosGlobales.getAuthorization);

        const req = new HttpRequest('POST', this._datosGlobales.urlApi + this.tblName + '/upload-imagen/' + _idDocument, formdata, {
           // headers: this.httpHeadersImage,
            reportProgress: true,
            responseType: 'json'
        });
        // responseType: text
        return this._http.request(req);
    }
    /*RECUPERAR IMAGEN */
    getImageName(nameImage): Observable<any> {
        return this._http.get(this._datosGlobales.urlApi + this.tblName + '/get-img/' + nameImage, { headers: this.httpHeaders, responseType: 'blob' });
    }
    /*ELIMINAR IMAGEN */
    deleteImageProduct(_nameImage): Observable<any> {
        return this._http.delete(this._datosGlobales.urlApi + this.tblName + '/delete-img/' + _nameImage, { headers: this.httpHeaders });
    }

}