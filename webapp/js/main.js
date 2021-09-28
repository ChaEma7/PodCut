console.log("main.js is running!");

// JsonBin
const _baseUrl = "https://api.jsonbin.io/v3/b/614e36c89548541c29b7e601";
const _headers = {
  "X-Master-Key": "$2b$10$dRxVlihycZfRirMB6dkUju/ffo6QESpspttm8Xyzu454ddqm1hVfu",
  "Content-Type": "application/json"
};

let _pods = [];
let _users = [];

// =============== Login kode ==================
// Skrevet af Line
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

// ========== OPRET PROFIL ==========
// Skrevet af Line

//Fetchs person data from jsonbin
async function loadUsers() {
  const url = _baseUrl + "/latest"; // make sure to get the latest version
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
// skrevet af Chalotte

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


// ======================= fetch podcasts =============================
// Skrevet af Chalotte

async function fetchPods() {
  const url = "http://cmedia-design.dk/wordpress/wp-json/wp/v2/posts?_embed";

  const response = await fetch(url);
  const data = await response.json();
  _pods = data;

}

fetchPods();




async function fetchSuggested() {
  const url = "http://cmedia-design.dk/wordpress/wp-json/wp/v2/posts?_embed&categories=21";

  const response = await fetch(url);
  const data = await response.json();

  let pods = data.slice(0, 4);
  appendPods(pods, "#suggested");

}

fetchSuggested();

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



async function fetcCategory() {
  const url = "http://cmedia-design.dk/wordpress/wp-json/wp/v2/posts?_embed&categories=34";

  const response = await fetch(url);
  const data = await response.json();

  let pods = data.slice(0, 4);
  appendCategory(pods, "#category");

}

fetcCategory();



// show podcast details
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


function appendCategory(categories, element) {
  let html = "";

  for (const category of categories) {
    html += /*html*/ `
      <article class="kategori-kasse" onclick="navigateTo('#/recommended')">
      
      <div class="hexagon hexagonKategori">
          <div class="hexagon-in1">
              <div class="hexagon-in2Kategori" style="background-image: url(${category.acf.img})"></div>
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


//=============================== Emner =======================================




// =============================== Til top function =============================0
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}