import Cookie from "./Cookie";
import { Popover } from 'bootstrap';

//refreshing ui and data translation
const refreshLangData = (lang) => {

    //ui part
    var html = document.querySelector("html");
    fetch('./assets/language/' + lang + '.json', {
        // headers : { 
        //     'Content-Type': 'application/json',
        //     'Accept': 'application/json'
        //    }
    })
    .then(response => response.json())
    .then(data => {
        data.map(item => {
            var el = html.querySelectorAll('[data-lkey="' + item.KEY + '"]');
            if(el != null){
                if(el.length >= 1){
                    for(var i = 0; i < el.length; ++i){
                        if(el[i].innerHTML != item.VALUE){
                            el[i].innerHTML = item.VALUE;
                        }
                    }
                }
            }
        });
    });

    //data part
    var homePost = document.querySelector("#home_post");
    var posts = document.querySelector("#posts");
    var single = document.querySelector("#single");
    if(posts != null || homePost != null || single != null){
        if(single != null){
            var singleID = single.querySelector(".card").id.replace("post_", "");
        }
        fetch('./assets/data/posts.json', {
            // headers : { 
            //     'Content-Type': 'application/json',
            //     'Accept': 'application/json'
            //    }
        })
        .then(response => response.json())
        .then(data => {
            data.map(item => {
                if(item["category"] == "git"){
                    var gitEl = document.querySelector(".giticon");
                    if(gitEl.getAttribute("data-bs-content") != item[Cookie.currentLanguage].TEXT){
                        var popover = Popover.getInstance(gitEl)
                        popover.hide();
                        gitEl.setAttribute("data-bs-content", item[Cookie.currentLanguage].TEXT);
                        gitEl.setAttribute("title", item[Cookie.currentLanguage].TITLE);
                    }
                }
                if(item["category"] == "home"){
                    if(homePost != null){
                        homePost.innerHTML = item[Cookie.currentLanguage].TEXT;
                        return;
                    }
                }
                var card = document.querySelector("#post_" + item.id);
                if(card != null){
                    var title = card.querySelector(".card-title");
                    var desc = card.querySelector(".card-text");
                    if(item.id == singleID){
                        desc.innerHTML = item[Cookie.currentLanguage].TEXT;
                    }
                    else{
                        desc.innerHTML = item[Cookie.currentLanguage].SHORT_DESC;
                    }
                    title.innerHTML = item[Cookie.currentLanguage].TITLE;
                }
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {

    //Check stored cookie
    Cookie.currentLanguage = Cookie.getCookie("lang");

    //if not found - set default value
    if(Cookie.currentLanguage === ""){
        Cookie.currentLanguage = "en";
    }

    //set language view
    var langElement = document.querySelector("#" + Cookie.currentLanguage);
    langElement.classList.add("opacity-65");

    //observe app section changes to set translation if needed
    var target = document.querySelector('#app');
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            refreshLangData(Cookie.currentLanguage);
        });
    });
    var config = { childList: true }
    observer.observe(target, config);

    //lang selection
    var ru = document.querySelector("#ru");
    var en = document.querySelector("#en");
    ru.addEventListener("click", () => {
        if(Cookie.currentLanguage != "ru"){
            setActiveLanguage("ru");
        }
    });
    en.addEventListener("click", () => {
        if(Cookie.currentLanguage != "en"){
            setActiveLanguage("en");
        }
    });

});

function setActiveLanguage(lang){
    Cookie.setCookie("lang", lang)
    Cookie.currentLanguage = lang
    refreshLangData(Cookie.currentLanguage);
    document.querySelector("#" + Cookie.currentLanguage).classList.add("opacity-65");
    var langs = document.querySelectorAll(".lang");
    for(var i = 0; i < langs.length; ++i){
        if(langs[i] != "undefined" && langs[i].id != lang ){
            langs[i].classList.remove("opacity-65");
        }
    }
}