import { Component, OnInit } from '@angular/core';

import { IPayPalConfig } from 'ngx-paypal';
import { ICreateOrderRequest } from "ngx-paypal";

import { NumberService } from '../services/number.service';

@Component({
  selector: 'app-wiki',
  templateUrl: './wiki.component.html',
  styleUrls: ['./wiki.component.css']
})
export class WikiComponent implements OnInit {

  
  public payPalConfig?: IPayPalConfig;
  public showPaypalButtons: boolean;
  public value: string | number;
  
  operacion: string;
  o1: number;
  signo: boolean;
  mirame: string;
  resultado: number;
  ss: string;
  result: string;

  constructor(private numbeer: NumberService) { }
  ngOnInit(): void {
    this.initConfig();



    this.resultado = 0;
    this.operacion = '0';
    this.signo = false;
    this.mirame = '0';
    this.ss = '';
    this.numbeer.getResultado().subscribe(r => {
      this.resultado = r;
    });

    this.op(0);


    this.result = '';
    this.numbeer.getResultado().subscribe(x => {
      this.result = this.result + x + ' \n';
    });
  }

  private initConfig(): void {
    this.payPalConfig = {
        currency: 'MXN',
        clientId: 'AYE1W62dyiQC37MC7zAnUke8svgtRYHLudY-n8qa_oB2Ydcig30Ty5e3pVCVAx48dCadBcxjxGaG9Z9W',
        createOrderOnClient: (data) => < ICreateOrderRequest > {
            intent: 'CAPTURE',
            purchase_units: [{
                amount: {
                    currency_code: 'MXN',
                    value: '100.00',
                    breakdown: {
                        item_total: {
                            currency_code: 'MXN',
                            value: '100.00'
                        }
                    }
                },
                items: [{
                    name: 'Enterprise Subscription',
                    quantity: '1',
                    category: 'DIGITAL_GOODS',
                    unit_amount: {
                        currency_code: 'MXN',
                        value: '100.00',
                    },
                }]
            }]
        },
        advanced: {
            commit: 'true'
        },
        style: {
            label: 'paypal',
            layout: 'vertical'
        },
        onApprove: (data, actions) => {
            console.log('onApprove - transaction was approved, but not authorized', data, actions);
            actions.order.get().then(details => {
                console.log('onApprove - you can get full order details inside onApprove: ', details);
            });
        },
        onClientAuthorization: (data) => {
            console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        },
        onCancel: (data, actions) => {
            console.log('OnCancel', data, actions);
        },
        onError: err => {
            console.log('OnError', err);
        },
        onClick: (data, actions) => {
            console.log('onClick', data, actions);
        }
    };
  }

  pay() {
    this.showPaypalButtons = true;
  }

  back(){
    this.showPaypalButtons = false;
  }




  

  op(datos) {
    this.numbeer.op(datos).subscribe(s => {
      this.mirame = s;
    });
  }
  igual() {
    this.numbeer.getIgual();
  }
}

