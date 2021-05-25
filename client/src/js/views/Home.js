import Cookie from "../Cookie.js";
import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params){
        super(params);
        this.setTitle("", "nav_title_home");
    }

    async getHTML(){ 

        var content = await(await (await fetch('assets/templates/home.html', {

        })).text());
        var homePost = await(await (await fetch('./assets/data/posts.json', {
            // headers : { 
            //     'Content-Type': 'application/json',
            //     'Accept': 'application/json'
            //    }
        })).json());
        var homePostText = homePost.map(item => {
            if(item.category == "home"){
                return item[Cookie.currentLanguage].TEXT;
            }
        });

        content = content.replace("__home_post__", homePostText);
        return content;
    }
}