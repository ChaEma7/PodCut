console.log("main.js is running!");

// JsonBin
const _baseUrl = "https://api.jsonbin.io/v3/b/614e36c89548541c29b7e601";
const _headers = {
  "X-Master-Key": "$2b$10$dRxVlihycZfRirMB6dkUju/ffo6QESpspttm8Xyzu454ddqm1hVfu",
  "Content-Type": "application/json"
};

let _pods = [];
let _users = [];

// Login kode
window.login = () => {
    const mail = document.querySelector("#login-mail").value;
    const password =document.querySelector("#login-password").value;
    console.log(mail, password);

    if(mail === "podcut@mail.com" && password === "podcut"){
        console.log("Approved");
        localStorage.setItem("userIsApproved", true);
        navigateTo("#/");
    }
    else {
        console.log("Not approved");
        document.querySelector("#notApproved").innerHTML ="Forkert e-mail eller kode. <br> Prøv igen eller opret en bruger";
    }
    window.logout = () => {
        localStorage.setItem("userIsApproved", false);
        navigateTo("#/login");
    }
}

// ========== OPRET PROFIL ==========

//Fetchs person data from jsonbin
async function loadUsers() {
 const url = _baseUrl + "/latest"; // make sure to get the latest version
 const response = await fetch(url, { headers: _headers });
 const data = await response.json();
 console.log(data);
 _users = data.record;
 console.log(_users);
 appendUsers(_users);
 
}
loadUsers();

function appendUsers() {
    let htmlTemplate = "";
    for (let user of _users){
      htmlTemplate += /*html*/`
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
    inputPassword.value ="";
    
  
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


// fetch podcasts
async function fetchPods() {
    const url = "http://cmedia-design.dk/wordpress/wp-json/wp/v2/posts?_embed&per_page=4";

    const response = await fetch(url);
    const data = await response.json();
    _pods = data;
    appendPods(_pods);

}

fetchPods();

// show podcast details
function appendPods(pods) {
    let html = "";

    for (const pod of pods) {
        html += /*html*/ `
        <article class="index-cards" onclick ="showDetailView(${pod.id})">
        
        <div class="hexagon hexagon2">
            <div class="hexagon-in1">
                <div class="hexagon-in2" style="background-image: url(${pod.acf.img})">
                
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

