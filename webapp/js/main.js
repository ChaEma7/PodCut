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

        <h2>${pod.title.rendered}</h2>
        <p class="genre" >${pod.acf.genre}</p>
        </article>
        `;
    }
    document.querySelector("#suggested").innerHTML = html;
}