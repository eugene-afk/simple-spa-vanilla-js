export default class {
    constructor(params){
        this.params = params;
        //console.log(this.params);
    }

    setTitle(title, attr_title){
        var el = document.querySelector("title");
        //if we don't have title parameter - creating or updating title with correct language, in otherway setting title as was sended
        if(title == ""){
            if(el.hasAttribute("data-lkey")){
                el.setAttribute("data-lkey", attr_title)
            }
            else{
                var attr = document.createAttribute("data-lkey");
                attr.value = attr_title;
                el.setAttributeNode(attr);
            }
        }
        else{
            el.removeAttribute("data-lkey");
            document.title = title;
        }

    }

    async getHTML(){
        return "";
    }
    
}
