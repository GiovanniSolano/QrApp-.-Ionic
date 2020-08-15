import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DataLocalService } from '../../services/data-local.service';


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  optsSlide = {

    allowSlidePrev: false,
    allowSlideNext: false

  };

  constructor(private barcodeScanner: BarcodeScanner,
              private dataLocal: DataLocalService) {
                
              }

  ionViewWillEnter() {
    
    this.scan();


  }

  scan() {
    this.barcodeScanner.scan().then(barcodeData => {
      console.log('Barcode data', barcodeData);

      if(!barcodeData.cancelled) {
        this.dataLocal.guardarRegistro(barcodeData.format, barcodeData.text);
      }

     }).catch(err => {
         console.log('Error', err);

        //  this.dataLocal.guardarRegistro('QRCode', 'https://google.com');         
         this.dataLocal.guardarRegistro('QRCode', 'geo:18.950776884849287, -99.19647589167484');         



     });
  }

}
