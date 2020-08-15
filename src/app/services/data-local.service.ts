import { Injectable, OnInit } from '@angular/core';
import { Registro } from '../models/registro.model';

import { Plugins } from '@capacitor/core';
import { NavController } from '@ionic/angular';

import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

import { File } from '@ionic-native/file/ngx';

import { EmailComposer } from '@ionic-native/email-composer/ngx';


const { Storage } = Plugins;


@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  guardados: Registro[] = [];

  constructor(private navCtrl: NavController,
              private iab: InAppBrowser,
              private file: File,
              private emailComposer: EmailComposer) { 

    this.cargarStorage();
    
  }
  async guardarRegistro(format: string, text: string) {

    await this.cargarStorage();


    const nuevoRegistro = new Registro(format, text);
    
    this.guardados.unshift(nuevoRegistro);

    this.guardarEnStorage();

    console.log(this.guardados);


    this.abrirRegistro(nuevoRegistro);

  }

  async guardarEnStorage() {

    await Storage.set({
      key: 'registros',
      value: JSON.stringify(this.guardados)
    });

  }

  async cargarStorage() {
    const respuesta = await Storage.get({ key: 'registros' });
    this.guardados = JSON.parse(respuesta.value) || [];


    return this.guardados;

  }

  abrirRegistro(registro: Registro) {
    

    this.navCtrl.navigateForward('/tabs/tab2');

    switch (registro.type) {
      case 'http':
        this.iab.create(registro.text, '_system');
        break;
      case 'geo':
        this.navCtrl.navigateForward(`/tabs/tab2/mapa/${registro.text}`);
        break;
    
      default:
        break;
    }


  }

  enviarCorreo() {

    const arregloTmp = [];

    const titulos = 'Tipo, Formato, Creado en, Texto\n';

    arregloTmp.push(titulos);
    

    this.guardados.forEach(registro => {

      const linea = `${registro.type}, ${registro.format}, ${registro.created}, ${registro.text.replace(',', ' ')}\n`;

      arregloTmp.push(linea);

    });

    this.crearArchivoFisico(arregloTmp.join(''));
  }

  crearArchivoFisico(text: string) {

    this.file.checkFile(this.file.dataDirectory, 'registros.csv')
      .then(existe => {
        console.log('Existe archivo?', existe);
        return this.escribirArchivo(text);
      })
      .catch(err => {
        return this.file.createFile(this.file.dataDirectory, 'registros.csv', false)
                .then(creado => this.escribirArchivo(text))
                .catch(err2 => console.log('No se pudo crear el archivo'));
      });

  }


  async escribirArchivo(text: string) {

   await this.file.writeExistingFile(this.file.dataDirectory, 'registros.csv', text);

   const archivo = `${this.file.dataDirectory}registros.csv`;

   const email = {
    to: 'ejemplo@gmail.com',
    // cc: 'erika@mustermann.de',
    // bcc: ['john@doe.com', 'jane@doe.com'],
    attachments: [
      archivo
    ],
    subject: 'Backup de scans',
    body: 'Registros de scans - <strong>QrScanApp</strong>',
    isHtml: true
  };

   this.emailComposer.open(email);

   
  }


}



// Native Storage código

// import { Injectable, OnInit } from '@angular/core';
// import { Registro } from '../models/registro.model';

// import { Plugins } from '@capacitor/core';

// import { NativeStorage } from '@ionic-native/native-storage/ngx';


// const { Storage } = Plugins;


// @Injectable({
//   providedIn: 'root'
// })
// export class DataLocalService {

//   guardados: Registro[] = [];

//   constructor(private nativeStorage: NativeStorage) { 

//     this.cargarStorage();
    
//   }
//   async guardarRegistro(format: string, text: string) {

//     this.cargarStorage();

//     const nuevoRegistro = new Registro(format, text);
    
//     this.guardados.unshift(nuevoRegistro);

//     this.guardarEnStorage();

//     console.log(this.guardados);
    

//   }

//   guardarEnStorage() {

//     this.cargarStorage();

//     this.nativeStorage.setItem('registros', this.guardados).then(
//       () => console.log('Información guardada!'),
//       error => console.error('Error guardando data', error)
//     );

//   }

//   cargarStorage() {
//     this.nativeStorage.getItem('registros')
//     .then(
//       data => this.guardados = data || [],
//       error => console.error(error)
//     );


//     return this.guardados;

//   }


// }
