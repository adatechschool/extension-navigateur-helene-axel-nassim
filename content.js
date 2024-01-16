
// Fonction de récup liste des sites web
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

// Fonction de récup valeur du switch
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
    console.log(websiteList)
    // Reste de votre code ici
    let flagRescue = localStorage.getItem("flag");
    let timeRescue = localStorage.getItem("time");

    let timeNew = new Date().getTime();
    let switchFlag = await getSwitchFlag();
    console.log("Le switchFalg =", switchFlag)

      //attente de 2 minutes avant que le site soit a nouveau bloqué
    if (timeNew - parseInt(timeRescue) > 120000) {
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
            <style>

            body {
              all: unset;
          }
            body {
              color: red;
              font-family: Verdana, Geneva, Tahoma, sans-serif;
              text-align: center;
              padding: 50px;
              background-color: rgb(39, 37, 37);

          }
          .global {
            color : red;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }

          .countdown {

              font-size: 24px;
              font-weight: bold;
              color: #f91818;
              border: 2px solid #353434;
              border-radius: 20px;
              background-color: #000;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
          }

          img {
              margin-bottom: 15px;
              border-radius: 20px;
          }</style>
        </head>
        <body>
          <div class="global">
        <div class="countdown">
        <div class="global">Vous devez attendre 30 secondes 😈</div>
        <p id="countdown">30</p>
        <img src="https://media1.tenor.com/m/0yli7fSvvL0AAAAC/raccoon-yes.gif">
        </div>
        </div>


        </body>
        </html>`;

        // compteur :
        let seconds = 30;
        let timer = setInterval(updateCountdown, 1000);

        function updateCountdown() {
          document.getElementById("countdown").textContent = seconds;
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
