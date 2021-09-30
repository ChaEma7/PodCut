console.log("main.js is running!");

// JsonBin
const _baseUrl = "https://api.jsonbin.io/v3/b/614e36c89548541c29b7e601";
const _headers = {
  "X-Master-Key": "$2b$10$dRxVlihycZfRirMB6dkUju/ffo6QESpspttm8Xyzu454ddqm1hVfu",
  "Content-Type": "application/json"
};


let _pods = [];
let _users = [];
let _categories = [];

/* Vores global variabler giver os mulighed for at tilgå variablen globalt i koden,
og er derfor tilgængelige i alle funtioner  */

// =============== Login kode ==================
// Skrevet af Chalotte og Line
window.login = () => {
  const mail = document.querySelector("#login-mail").value;
  const password = document.querySelector("#login-password").value;
  console.log(mail, password);

  if (mail === "podcut@mail.com" && password === "podcut") {
    console.log("Approved");
    localStorage.setItem("userIsApproved", true);
    navigateTo("#/");
  } else {
    console.log("Not approved");
    document.querySelector("#notApproved").innerHTML = "Forkert e-mail eller kode. <br> Prøv igen eller opret en bruger";
  }
  window.logout = () => {
    localStorage.setItem("userIsApproved", false);
    navigateTo("#/login");
  }
}

/* Hvis mail og kode stemmer overens med vores agument i if-funktionen, 
logger brugeren ind og bliver navigeret til vores forside: #/ = #/home (se router.js).
Hvis ikke mail eller kode er rigtigt, får brugeren besked om dette. */

// ========== OPRET PROFIL ==========
// Skrevet af Chalotte og Line

//Fetchs person data fra jsonbin
async function loadUsers() {
  const url = _baseUrl + "/latest"; // + "/latest" giver os den seneste version af vores jsonbin
  const response = await fetch(url, {
    headers: _headers
  });
  const data = await response.json();
  console.log(data);
  _users = data.record;
  console.log(_users);
  appendUsers(_users);

}
loadUsers();

function appendUsers() {
  let htmlTemplate = "";
  for (let user of _users) {
    htmlTemplate += /*html*/ `
      <article>
      <h2>${user.name} ${user.surname}</h2>
      <p>${user.mail}</p>
      
      </article>`
  }
  document.querySelector("#profile").innerHTML = htmlTemplate;
}

async function add() {
  console.log("Add button clicked");

  let inputName = document.getElementById('inputName');
  let inputSurName = document.getElementById('inputSurName');
  let inputMail = document.getElementById('inputMail');
  let inputPassword = document.getElementById('inputPassword');

  let newUser = {
    name: inputName.value,
    surname: inputSurName.value,
    mail: inputMail.value,
    password: inputPassword.value

  };
  _users.push(newUser);
  await updateJSONBIN(_users);

  //reset af felter
  inputName.value = "";
  inputSurName.value = "";
  inputMail.value = "";
  inputPassword.value = "";


  appendUsers(_users);
  navigateTo("#/choose-interests");
}

/**
 * Updates the data source on jsonbin with a given users arrays
 * @param {Array} users 
 */
async function updateJSONBIN(users) {
  // put users array to jsonbin
  const response = await fetch(_baseUrl, {
    method: "PUT",
    headers: _headers,
    body: JSON.stringify(users)
  });

  const result = await response.json();
  console.log(result);

  appendUsers(result.record);
}

// ======================= Search =====================================
// Skrevet af Chalotte og Line

function search(value) {
  if (value) {
    document.querySelector("#search-container").classList.remove("hide");
    document.querySelector("#hide-when-search-container").classList.add("hide");
  } else {
    document.querySelector("#search-container").classList.add("hide");
    document.querySelector("#hide-when-search-container").classList.remove("hide");
  }

  let searchQuery = value.toLowerCase();
  let filteredPods = [];
  for (let pod of _pods) {
    let title = pod.title.rendered.toLowerCase();
    let genre = pod.acf.genre.toLowerCase();
    if (title.includes(searchQuery) || genre.includes(searchQuery)) {
      filteredPods.push(pod);
    }


  }
  appendPods(filteredPods, "#pods-search-container");
}

/* Den første del af koden bestemmer at, hvis der er noget skrevet i input feltet (værdi),
skal indholdet af ID'et #search-container fremvises. Det gør den ved at fjerne klassen .hide 
som er stylet i css til ikke at blive vist. Herefter tilføjer den .hide klassen til ID'et 
#hide-when-search-container og skjuler denne. 
Hvis ikke der er nogen værdi i feltet skal #search-container skjules og #hide-when-search-container vises.

- Variablen searchQuery bestemmer at value skal oversættes til LowerCase, så uanset om værdien bliver skrevet med stort eller småt, 
kan vores kode genkende værdien.
Vi giver koden mulighed for at vide, hvor den skal kigge efter værdien i vores json. Der kan pt. søges på genre og title. Hvis værdien genkendes
skubbes den og vises i #pods-search-container */

function search2(value) {

  if (value) {
    document.querySelector("#search-container2").classList.remove("hide");
    document.querySelector("#hide-when-search-container2").classList.add("hide");
  } else {
    document.querySelector("#search-container2").classList.add("hide");
    document.querySelector("#hide-when-search-container2").classList.remove("hide");
  }


  let searchQuery = value.toLowerCase();
  let filteredPods = [];
  for (let pod of _pods) {
    let title = pod.title.rendered.toLowerCase();
    let genre = pod.acf.genre.toLowerCase();
    if (title.includes(searchQuery) || genre.includes(searchQuery)) {
      filteredPods.push(pod);
    }


  }
  appendPods(filteredPods, "#pods-search-container2");
}

/* Se overstående kommentar. Denne gør det samme, men bliver vist på en anden side.*/

// ======================= fetch podcasts =============================
// Skrevet af Chalotte og Line

async function fetchPods() {
  const url = "http://cmedia-design.dk/wordpress/wp-json/wp/v2/posts?_embed";

  const response = await fetch(url);
  const data = await response.json();
  _pods = data;

}

fetchPods();

/* Henter alle posts (eller objekter i arrayet) ned fra vores json url. async og await er en syntaks der fortæller, 
at JS engine skal vente med at læse videre i koden til den har modtaget data fra json. På den måde sikre vi, 
at alt indhold vi ønsker fremvist bliver fremvist. 
Denne data samles i vores global variabel _pods, og vi kan derfor tilgå denne data i alle funktioner*/


async function fetchSuggested() {
  const url = "http://cmedia-design.dk/wordpress/wp-json/wp/v2/posts?_embed&categories=21";

  const response = await fetch(url);
  const data = await response.json();

  let pods = data.slice(0, 4);
  appendPods(pods, "#suggested");

}

fetchSuggested()

/* Her henter vi kun de posts som tilhøre en bestemt kategori. I dette tilfælde har denne kategori ID'et 21 og er vores
"foreslået til dig" kategori. Vi vil kun have vist de første 4 posts, derfor deler vi arrayet over med data.slice og giver det
et agument der hedder (0, 4). Herefter append'er (tilføjer) vi disse til sektionen med ID'et #suggested.
Denne metode er benyette flere steder nedenfor. */

async function fetchAllSuggested() {
  const url = "http://cmedia-design.dk/wordpress/wp-json/wp/v2/posts?_embed&categories=21";

  const response = await fetch(url);
  const data = await response.json();

  let pods = data;
  appendAllSuggested(pods, "#recommended-container");

}

fetchAllSuggested();

/* i dette tilfælde ønsker vi alle posts (eller objekter i arrayet) vist. Derfor fjerner vi .slice.
Vi er dog nød til at lave en ny function her. Havde vi kaldt fetchSuggested() ville vi kun få de 4 første posts. */


async function fetchNew() {
  const url = "http://cmedia-design.dk/wordpress/wp-json/wp/v2/posts?_embed&categories=22";

  const response = await fetch(url);
  const data = await response.json();

  let pods = data.slice(0, 4);
  appendPods(pods, "#newPods");

}

fetchNew();


async function fetchOther() {
  const url = "http://cmedia-design.dk/wordpress/wp-json/wp/v2/posts?_embed&categories=24";

  const response = await fetch(url);
  const data = await response.json();

  let pods = data.slice(0, 4);
  appendPods(pods, "#OtherSuggests");

}

fetchOther();

async function fetchAllCategories() {
  const url = "http://cmedia-design.dk/wordpress/wp-json/wp/v2/posts?_embed&categories=34";

  const response = await fetch(url);
  const data = await response.json();
  _categories = data;
  console.log(_categories)
  appendCategory(_categories, ".allCategories")
}

fetchAllCategories();

/* Her skaber vi en ny global variabel som henter alle vores kategorier ned. */



async function fetchCategory() {
  const url = "http://cmedia-design.dk/wordpress/wp-json/wp/v2/posts?_embed&categories=34";

  const response = await fetch(url);
  const data = await response.json();

  let pods = data.slice(0, 4);
  appendCategory(pods, "#category");

}

fetchCategory();



//=============================== Append =======================================
// Skrevet af Chalotte og Line

// viser podcast details
function appendPods(pods, element) {
  let html = "";

  for (const pod of pods) {
    html += /*html*/ `
        <article class="index-cards" onclick ="showDetailView(${pod.id})">
        
        <div class="hexagon hexagon2">
            <div class="hexagon-in1">
                <div class="hexagon-in2" style="background-image: url(${pod.acf.img})"></div>
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
  document.querySelector(element).innerHTML = html;
}

/* Her definerer vi, hvordan vores inhentet data fra json skal fremvises. Ved at benyttet et loop (for) 
 fortæller vi JS engine, at den skal gentage denne funktion for alle objekter i arrayet og, hvor i arrayet den
 skal finde den ønskede data.
 I dette tilfælde vil vi gerne fremvise et billede, titlen, undertitlen, genre og rating. Alt dette samles i en article,
 som ved onclick sender brugeren videre til en datalje side udfra objektets ID.
 Gennem "document.querySelector(element).innerHTML = html" bliver det sendt DOM'en.
 Det samme gælder for nedestående append funktioner.*/


function appendCategory(categories, element) {
  let html = "";

  for (const category of categories) {
    html += /*html*/ `
      <article class="kategori-kasse" onclick="navigateTo('#/recommended')">
      
      <div class="hexagon hexagonKategori">
          <div class="hexagon-in1">
              <div class="hexagon-in2" style="background-image: url(${category.acf.img})"></div>
          </div>
      </div>
      <div class="index-card-text">
      <h4>${category.title.rendered}</h4>
      <h5>${getCount(category)} emner</h5>
      </div>
      </article>
      `;
  }
  document.querySelector(element).innerHTML = html;
}

function getCount(category) {
  let count = "";
  if (`http://cmedia-design.dk/wordpress/wp-json/wp/v2/posts?_embed&categories=${category.name}` == `http://cmedia-design.dk/wordpress/wp-json/wp/v2/posts?_embed=${category.title.rendered}`) {
    count = category.count;
  } else {
    count = "X"
  }
  return count;
}

function appendAllSuggested(pods, element) {
  let html = "";

  for (const pod of pods) {
    html += /*html*/ `
        <article class="show-card" onclick ="showDetailView(${pod.id})">
        
        <div class="hexagon hexagon-show-card">
            <div class="hexagon-in1">
                <div class="hexagon-in2" style="background-image: url(${pod.acf.img})"></div>
            </div>
        </div>
        <div class="show-card-text">
        <div class="showCard-flex-top">
        <h2>${pod.acf.langtitel}</h2>
        <button href="#" class="lyt-nu-knap">Lyt nu</button>
        </div>
        <h3>${pod.acf.teaser}</h3>
        <div class="showCard-flex">
        <img class="stars" src="${getStars(pod)}">
        <p class="genre" >${pod.acf.tid} min</p>
        <p class="genre" >${pod.acf.genre}</p>
        </div>
        </div>
        </article>
        `;
  }
  document.querySelector(element).innerHTML = html;
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

/* Vi vil gerne have at objektes rating bliver vist med stjerner. For at automaticerer dette,
har vi lavet en if funktion, som vi kalder i append. Denne fungerer således, at hvis objektets rating 
er 2, skal den hente det billede med 2 stjerne osv. Hvis ikke nogle af vores if'er gør sig gældende,
må vi gå udfra, at objektet har den mindste rating, og skal derfor hente billedet med 1 stjerne. */

//=============================== Detail View =======================================
// Skrevet af Chalotte og Line

function showDetailView(id) {
  const pod = _pods.find(pod => pod.id == id);
  document.querySelector("#detailViewContainer").innerHTML = /*html*/ `

        <div class="hexagon hexagonDetail">
            <div class="hexagon-in1">
                <div class="hexagon-in2" style="background-image: url(${pod.acf.img})"></div>
            </div>
        </div>    

     
      <div class="titel-kasse">
          <h1>${pod.acf.langtitel}</h1>
      </div>
      <div class="detail-ikoner">
      <img  src="../img/play.png" alt="play icon">
      <img  src="../img/like.png" alt="favorit icon">
      <img  src="../img/anmeld.png" alt="anmeld icon">
      </div>
      <article>
      <h1 class="left">Beskrivelse</h1>
      <p class="lilleleft">${pod.acf.beskrivelse}</p>
      <br>
      <p class="detail-stats">
      Værter: ${pod.acf.host} <br>
      Afsnit: ${pod.acf.afsnit} <br>
      Sprog: ${pod.acf.sprog} <br>
      Udgivelses år: ${pod.acf.udgivelse}</p>

      <h1 class="left">Kan lyttes på</h1>
      <div class="streaming-icons">
      <img  src="../img/podimo.png" alt="podimo icon"> 
      <img  src="../img/audible.png" alt="audible icon">
      <img  src="../img/applePod.png" alt="apple podcast icon">
      </div>

      <h1 class="left">Andre siger</h1>
      <h1 class="left">Mere som dette</h1>

      </article>
          
     
  `;
  navigateTo("#/detail");
}



// =============================== Til top function =============================
// Skrevet af Chalotte og Line
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}