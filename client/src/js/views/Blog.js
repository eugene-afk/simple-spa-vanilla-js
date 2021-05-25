import AbstractView from "./AbstractView.js";
import Cookie from "../Cookie.js";

export default class extends AbstractView {
    constructor(params){
        super(params);
        this.setTitle("", "nav_title_blog");
    }

    async getHTML(){

        var container = await (await fetch('assets/templates/posts.html', {})).text();
        var posts = await (await fetch('assets/data/posts.json', {})).json();
        var template = await (await fetch('assets/templates/blog-card.html', {})).text();
        var tempWrapper = document.createElement('div');

        tempWrapper.innerHTML = container;
        var row = tempWrapper.querySelector("#posts");

        posts.map(item => {
            if(item.category == "blog"){
                var card = document.createRange().createContextualFragment(template);
                var root = card.querySelector(".card");
                root.setAttribute("id", "post_" + item.id);
                var title = card.querySelector(".card-title");
                var desc = card.querySelector(".card-text-primary");
                var link = card.querySelector("a");
                var mutedText = card.querySelector(".text-muted");
                var img = card.querySelector("img");
                img.src = "/img/" + item.img;
                img.classList.add("blog-img");
                mutedText.innerHTML = "Last updated " + Math.round(Math.random() * (59 - 1) + 1) + " mins ago";
                link.href = "/blog/" + item.id;
                desc.innerHTML = item[Cookie.currentLanguage].SHORT_DESC;
                title.innerHTML = item[Cookie.currentLanguage].TITLE;                
                row.appendChild(card);
            }
        });

        return tempWrapper.innerHTML;
    }
}