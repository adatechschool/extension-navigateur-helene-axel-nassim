
// Fonction de récupération de liste des sites web
async function getWebsiteList() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('websiteList', (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.websiteList);
      }
    });
  });
}

// Fonction de récupération de la valeur du switch
async function getSwitchFlag() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("switchFlag", (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.switchFlag);
      }
    });
  });
}


// Fonction principale asynchrone pour exécuter le reste du js
async function mainContentScript() {
  try {
    // Récupérer la liste des sites web depuis le stockage local
    let websiteList = await getWebsiteList();
    //Récup de la valeur du flag et du time pour savoir quand rebloquer le site.
    let flagRescue = localStorage.getItem("flag");
    let timeRescue = localStorage.getItem("time");
    let timeNew = new Date().getTime();
    //Recup valeur du switch de fonctionnement du script
    let switchFlag = await getSwitchFlag();

    //attente de 16 minutes avant que le site soit a nouveau bloqué 10 seconde pour les tests(1000000)
    if (timeNew - parseInt(timeRescue) > 10000) {
      console.log("le flag redevient null");
      flagRescue = null;
    }

    for (let i = 0; i < websiteList.length; i++) {
      if (window.location.href.startsWith(websiteList[i]) && flagRescue === null && switchFlag === true) {
        // Le reste de votre code ici...
        document.querySelector("body").innerHTML = `<!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Décompte de 30 secondes</title>
            <link href="https://fonts.googleapis.com/css2?family=Oswald&family=Roboto:wght@100;300&family=VT323&family=Young+Serif&display=swap" rel="stylesheet">

            <style>

            body {
              all: unset;
          }
            body {
              color: #00FF00;
              font-family: "VT323"!important;
              text-align: center;
              padding: 50px;
              background-color: rgb(39, 37, 37);

          }
          .global {
            font-family: "VT323"!important ;
            color : #00FF00;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }

          .countdown {

              font-family: "VT323" !important;
              font-size: 24px;
              font-weight: bold;
              color: #00FF00;
              border: 2px solid #353434;
              border-radius: 20px;
              background-color: #000;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              padding: 20px;
          }

          #countdown {
            font-size: 150px;
            font-family: "VT323" !important;

          }

          #facebook ._-kb div {
            font-family: "VT323" !important;
        }

          img {
              margin-bottom: 15px;
              border-radius: 20px;
              display: block;
              margin-left: auto;
              margin-right: auto;
          }</style>
        </head>
        <body>
          <div class="global">
        <div class="countdown">
        <div>Vous devez attendre 30 secondes</div>
        <div id="countdown">00:00:30</div>
        <img src="https://media1.tenor.com/m/0yli7fSvvL0AAAAC/raccoon-yes.gif">
        </div>
        </div>


        </body>
        </html>`;

        // compteur :
        let seconds = 30;
        let timer = setInterval(updateCountdown, 1000);
        let hours = "00:"
        let minutes = "00:"


        function updateCountdown() {
          let secondsRestantes = "";

          if (seconds < 10) {
            secondsRestantes = "0" + seconds;
          } else {
            secondsRestantes = String(seconds);
          }

          document.getElementById("countdown").textContent = hours + minutes + secondsRestantes;

          if (seconds === 0) {
            clearInterval(timer);

            flag = 1;
            let time = new Date().getTime();
            localStorage.setItem("flag", 1);
            localStorage.setItem("time", time.toString());
            window.location.reload();
          } else {
            seconds--;
          }
        }
      }
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la liste des sites web dans le content script:", error);
  }
}

// Appel de la fonction principale asynchrone pour le content script
mainContentScript();
