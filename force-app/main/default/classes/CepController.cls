public with sharing class CepController {
    
    // @AuraEnabled
    // public static Account getAccount(Id accId){
    //     try {
    //         return [SELECT Id, Name, BillingStreet, BillingCity, BillingState, BillingPostalCode, BillingCountry, BillingLatitude, BillingLongitude, BillingGeocodeAccuracy FROM Account WHERE Id = :accId];
    //     } catch (Exception e) {
    //         throw new AuraHandledException(e.getMessage());
    //     }
    // }

    @AuraEnabled
    public static Endereco buscarCep(String cep){
        try {

            Http http = new Http();
            HttpRequest req = new HttpRequest();
    
            req.setEndpoint('https://viacep.com.br/ws/'+ cep +'/json/');
            req.setMethod('GET');
    
            HttpResponse res = http.send(req);
    
            if(res.getStatusCode() == 200){
    
                System.debug(res.getBody());
                System.debug(res.getBody());

                Endereco add = (Endereco) JSON.deserialize(res.getBody(), Endereco.class);
                return add;
    
            }

            throw new AuraHandledException('Ocorreu erro na integração '+ res.getStatusCode());

        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    public class Endereco {
        
        @AuraEnabled
        public String cep {get;set;}
        @AuraEnabled
        public String logradouro {get;set;}
        @AuraEnabled
        public String complemento {get;set;}
        @AuraEnabled
        public String bairro {get;set;}
        @AuraEnabled
        public String localidade {get;set;}
        @AuraEnabled
        public String uf {get;set;}
        @AuraEnabled
        public String ibge {get;set;}
        @AuraEnabled
        public String gia {get;set;}
        @AuraEnabled
        public String ddd {get;set;}
        @AuraEnabled
        public String siafi {get;set;}
    }
}
