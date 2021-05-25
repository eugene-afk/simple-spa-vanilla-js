import Cookie from "../Cookie.js";
import AbstractView from "./AbstractView.js";

export default class extends AbstractView {
    constructor(params){
        super(params);
        this.setTitle("", "nav_title_projects");
    }

    async getHTML(){
        var container = await (await fetch('assets/templates/posts.html', {})).text();
        var posts = await (await fetch('assets/data/posts.json', {})).json();
        var template = await (await fetch('assets/templates/project-card.html', {})).text();
        var tempWrapper = document.createElement('div');

        tempWrapper.innerHTML = container;
        var row = tempWrapper.querySelector("#posts");

        posts.map(item => {
            if(item.category == "projects"){
                var card = document.createRange().createContextualFragment(template);
                var root = card.querySelector(".card");
                root.setAttribute("id", "post_" + item.id);
                var title = card.querySelector(".card-title");
                var desc = card.querySelector(".card-text");
                var link = card.querySelector("a");
                var img = card.querySelector("img");
                var proj_info = card.querySelector(".project-info");
                img.src = "/img/" + item.img;
                link.href = "/projects/" + item.id;
                desc.innerHTML = item[Cookie.currentLanguage].SHORT_DESC;
                title.innerHTML = item[Cookie.currentLanguage].TITLE;
                item.extra.progLangs.map(item => {
                    proj_info.innerHTML += item["pl"] + ", ";
                    //console.log(item);
                });
                proj_info.innerHTML = proj_info.innerHTML.slice(0, -2);
                row.appendChild(card);
            }
        });

        return tempWrapper.innerHTML;
    }
}