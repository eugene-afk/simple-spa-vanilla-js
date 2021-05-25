import Home from "./views/Home.js";
import Projects from "./views/Projects.js";
import Blog from "./views/Blog.js";
import Parallax from "../../node_modules/parallax-js";
import PostView from "./views/PostView.js";
import { Popover } from 'bootstrap';
import Cookie from "./Cookie.js";

const pathToRegex = path => new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");

const getParams = match => {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(keys.map((key, i) => {
        return [key, values[i]];
    }));
};

const navigateTo = url => {
    history.pushState(null, null, url);
    router();
};

const router = () => {
    //console.log(pathToRegex("/projects/:id"))
    const routes = [
        { path: "/", view: Home },
        { path: "/projects", view: Projects },
        { path: "/projects/:id", view: PostView },
        { path: "/blog/:id", view: PostView },
        { path: "/blog", view: Blog },
    ];

    const matches = routes.map(route => {
        return {
            route: route,
            result : location.pathname.match(pathToRegex(route.path))
        };
    });

    var match = matches.find(pMatch => pMatch.result !== null);

    if(!match){
        match = {
            route: routes[0],
            result: [location.pathname]
        };
    }
    const view = new match.route.view(getParams(match));

    view.getHTML().then(function(value){
        document.querySelector("#app").innerHTML = value;
    });
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {

    //show cookie-bar if cookies disabled
    
    // if(!Cookie.isCookieEnabled){
    //     document.querySelector("#cookie").classList.remove("is-hidden");
    // }

    //toggle navbar transparency
    var myNav = document.querySelector(".navbar");
    window.onscroll = function () { 
        if (document.body.scrollTop > 5 || document.documentElement.scrollTop > 5) {
            myNav.classList.add("nav-colored");
            myNav.classList.remove("nav-transparent");
        } 
        else {
            myNav.classList.toggle("nav-colored");
            myNav.classList.add("nav-transparent");
            myNav.classList.remove("nav-colored");
        }
    };

    //init parallax
    var scene = document.getElementById('scene');
    var parallaxInstance = new Parallax(scene);

    //init popover
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
      return new Popover(popoverTriggerEl)
    })

    document.addEventListener("click", e => {

        //handle path location changed
        if(e.target.matches("[data-link]")){
            e.preventDefault();
            
            if(document.querySelector("nav").classList.contains("drawer-collapsed")){
                var elem = document.querySelector(".navbar-toggler");
                var evt = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                !elem.dispatchEvent(evt);
            }
            navigateTo(e.target.href);
        }

        //phone input helper
        if(e.target.id == "phoneInput"){
            if(e.target.value.length == 0){
                e.target.value = '+380';
            }     
        }

        //send contact form email
        if(e.target.id == "contact_send_mail"){
            var note = document.querySelector("#noteInputModal").value;
            if(note != ""){
                document.querySelector("#noteInput").value = note;
            }
            fetch('./assets/scripts/contactmailer.php',{
                method: 'post',
                body: new FormData(document.querySelector('#contact-form'))
            }).then(response => response.text()).then(data =>{
                var alert = document.querySelector(".alert");
                alert.classList.remove("is-hidden");

                if(data == "1"){
                    alert.classList.add("alert-success");
                    alert.innerHTML = "Successfully sended.";
                    var formFields = document.querySelectorAll("input[type=text]");
                    for(var i = 0; i < formFields.length; ++i){
                        formFields[i].value = "";
                    }
                    document.querySelector("#noteInputModal").value = "";
                    document.querySelector("#connectSelect").selectedIndex = 0;
                }
                else{
                    alert.classList.add("alert-danger");
                    alert.innerHTML = "Error: " + data;
                }
            });
        }
    });

    //handle for enabling cookies button, by default always enabled

    // var cookieButton = document.querySelector("#cookies_enable_btn");
    // cookieButton.addEventListener("click", () => {
    //     Cookie.isCookieEnabled = true;
    //     Cookie.setCookie("isCookieEnabled", "yes");
    //     document.querySelector("#cookie").classList.add("is-hidden");
    // });

    //remove contact form note listeners
    var cancelNoteElements = document.querySelectorAll(".note-cancel");
    for(var i = 0; i < cancelNoteElements.length; ++i){
        cancelNoteElements[i].addEventListener("click", ()=>{
            document.querySelector("#noteInputModal").value = '';
            document.querySelector("#noteInput").value = '';
        });        
    }

    //drawer button event
    var drawerIcon = document.querySelector(".second-button");
    drawerIcon.addEventListener("click", ()=>{
        document.querySelector(".animated-icon2").classList.toggle("open"); 
        document.querySelector("#nav-actions").classList.toggle("w-100"); 
        document.querySelector("#nav-actions").classList.toggle("my-2");
        document.querySelector(".navbar").classList.toggle("drawer-collapsed");
    });

    //formating phone number helper
    document.addEventListener('input', e => {
        if(e.target.id == "phoneInput"){
            var x = e.target.value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,2})(\d{0,3})(\d{0,2})(\d{0,2})/);
            e.target.value = !x[2] ? x[1] : '(+' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '') + (x[4] ? '-' + x[4] : '') + (x[5] ? '-' + x[5] : '');
        }
    });

    router();
});