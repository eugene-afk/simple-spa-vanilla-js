export default class {

    static currentLanguage = "en";
    static isCookieEnabled = true;

    static checkIsCookieEnabled(){
        var val = this.getCookie("isCookieEnabled");
        if(val == ""){
            //remove this if enabled cookies accept bar
            this.setCookie("isCookieEnabled", "yes");
            
            //this.isCookieEnabled = false; 
        }
    }

    static getCookie(key){
        if(!this.isCookieEnabled){
            return "";
        }
        else{
            try{
                var cookieValue = document.cookie
                .split('; ')
                .find(row => row.startsWith(key))
                .split('=')[1];
                return cookieValue;
            }
            catch(ex){
                return "";
            }
        }
    }

    static setCookie(key, value){

        if(this.isCookieEnabled){
            document.cookie = key + "=" + value;   
        }
    }

}