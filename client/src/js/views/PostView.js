import Cookie from "../Cookie.js";
import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params){
        super(params);
    }

    async getHTML(){    
        var content = await (await fetch('assets/templates/single.html', {})).text();
        var contentElement = document.createRange().createContextualFragment(content);
        var tempContentWrapper = document.createElement("div");
        var posts = await (await fetch('assets/data/posts.json', {})).json();
        var post = posts.find(item => item.id == this.params.id);

        var root = contentElement.querySelector(".card");
        root.setAttribute("id", "post_" + this.params.id);

        var title = contentElement.querySelector(".card-title");
        title.innerHTML = post[Cookie.currentLanguage].TITLE;
        var text = contentElement.querySelector(".card-text");
        text.innerHTML = post[Cookie.currentLanguage].TEXT;

        this.setTitle(post[Cookie.currentLanguage].TITLE);

        var img = contentElement.querySelector("img");
        img.src = "/img/" + post.img;

        tempContentWrapper.appendChild(contentElement);
        return tempContentWrapper.innerHTML;
    }
}