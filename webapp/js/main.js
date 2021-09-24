// importerer router til vores main
import "./router.js";
console.log("main.js is running!");

let _pods = [];

async function fetchPods() {
    const url = "http://cmedia-design.dk/wordpress/wp-json/wp/v2/posts?_embed";

    const response = await fetch(url);
    const data = await response.json();
    _pods = data;
    appendPods(_pods);

}

fetchPods();

function appendPods(pods) {
    let html = "";

    for (const pod of pods) {
        html += /*html*/ `
        <article class="index-cards" onclick ="showDetailView(${pod.id})">
        
        <div class="hexagon hexagon2">
            <div class="hexagon-in1">
                <div class="hexagon-in2">
                <img class="index-img" src="${pod.acf.img}">
                </div>
            </div>
        </div>
        <div class="index-card-text">
        <h2>${pod.title.rendered}</h2>
        <h3>${pod.acf.undertitel}</h3>
        <p class="genre" >${pod.acf.genre}</p>
        <img class="stars" src="${getStars(pod)}">
        </div>
        </article>
        `;
    }
    document.querySelector("#suggested").innerHTML = html;
}

// Fortæller hvilket billede der skal bruges alt efter rating

function getStars(pod) {
    let star = "";
    if (pod.acf.rating === "2") {
        star = "img/2star.png";
    } else if (pod.acf.rating === "3") {
        star = "img/3star.png";
    } else if (pod.acf.rating === "4") {
        star = "img/4star.png";
    } else if (pod.acf.rating === "5") {
        star = "img/5star.png";
    } else {
        star = "img/1star.png";
    }
    return star;
}

