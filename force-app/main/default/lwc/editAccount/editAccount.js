import { LightningElement, api, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { getRecord } from 'lightning/uiRecordApi';

import STREET_FIELD from '@salesforce/schema/Account.BillingStreet';
import CITY_FIELD from '@salesforce/schema/Account.BillingCity';
import STATE_FIELD from '@salesforce/schema/Account.BillingState';
import POSTALCODE_FIELD from '@salesforce/schema/Account.BillingPostalCode';

//import getAccount from '@salesforce/apex/CepController.getAccount';
import buscarCep from '@salesforce/apex/CepController.buscarCep';

export default class EditAccount extends LightningElement {

    @api recordId;
    @api objectApiName;

    @track data = {
        cep: '',
        logradouro: null,
        complemento: '',
        bairro: '',
        localidade: '',
        uf: '',
        country: ''
    };

    isRender = false;

    // Métodos WIRE que serão chamados ao iniciar o componente
    @wire(getRecord, { recordId: '$recordId', fields: [STREET_FIELD, CITY_FIELD, POSTALCODE_FIELD, STATE_FIELD] })
    wiredRecord({ error, data }) {
        if (error) {
            let message = 'Unknown error';
            if (Array.isArray(error.body)) {
                message = error.body.map(e => e.message).join(', ');
            } else if (typeof error.body.message === 'string') {
                message = error.body.message;
            }
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error get account data',
                    message,
                    variant: 'error',
                }),
            );
        } else if (data) {

            this.data.cep = data.fields.BillingPostalCode.value;
            this.data.logradouro = data.fields.BillingStreet.value;
            this.data.localidade = data.fields.BillingCity.value;
            this.data.uf = data.fields.BillingState.value;

        }
    }

    // renderedCallback(){
        
    //     if(!this.isRender){
    //         this.isRender = true;

    //         getAccount({
    //             accId: this.recordId
    //         })
    //             .then(ret => {
    //                 console.log(JSON.stringify(ret));

    //                 this.data.cep = ret?.BillingPostalCode;
    //                 this.data.logradouro = ret?.BillingStreet;
    //                 this.data.localidade = ret?.BillingCity;
    //                 this.data.uf = ret?.BillingState;
    //                 this.data.logradouro = ret?.BillingStreet;
    //                 this.data.country = ret?.BillingCountry;

    //             })
    //             .catch(err => {
    //                 console.error(err);
    //             });
    //     }

    // }

    handleSuccess(){
        
        const event = new ShowToastEvent({
            title: 'Tudo certo',
            message:'Atualizado com sucesso',
            variant: 'success'
        });
        this.dispatchEvent(event);

    }

    handleError(evt){

        const event = new ShowToastEvent({
            title: evt.detail.message,
            message: evt.detail.detail,
            variant: 'error'
        });
        this.dispatchEvent(event);
    }

    handleChange(event) {

        this.data.cep = event.detail.value;

    }

    getCep = async (event) => {

        try {
            const ret = await buscarCep({cep: this.data.cep});
        
            this.data = ret;

        } catch (error) {
            
            const event = new ShowToastEvent({
                title: 'Erro ao buscar CEP',
                message: error.body.message,
                variant: 'error'
            });
            this.dispatchEvent(event);

        }
        

        //this.updateValues(ret);

    }

    updateValues(data){

        let fields = ['bairro','complemento','logradouro','cidade','uf','numero'];

        const inputFields = this.template.querySelectorAll(
            'lightning-input-field'
        );

        if (inputFields) {
            inputFields.forEach(field => {
                if(fields.includes(field.dataset.name)){
                    field.value = data[field.dataset.name];
                }
            });
        }
    }

}