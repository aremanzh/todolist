var home = document.querySelectorAll(".nav-link")[0];
var work = document.querySelectorAll(".nav-link")[1];
var about = document.querySelectorAll(".nav-link")[2];

if (window.location.pathname === "/") {
    home.classList.add("active");  
    work.classList.remove("active");
    about.classList.remove("active");
} if (window.location.pathname === "/work") {
    work.classList.add("active");
    home.classList.remove("active"); 
    about.classList.remove("active");
} if (window.location.pathname === "/about") {
    about.classList.add("active");
    work.classList.remove("active");
    home.classList.remove("active"); 
}