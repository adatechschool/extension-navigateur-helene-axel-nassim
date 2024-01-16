async function getWebsiteList() {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get("websiteList", (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result.websiteList);
      }
    });
  });
}

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


// async function setSwitchFlag(value) {
//   return new Promise((resolve, reject) => {
//     chrome.storage.local.set({ "switchFlag": value }, () => {
//       if (chrome.runtime.lastError) {
//         reject(chrome.runtime.lastError);
//       } else {
//         resolve();
//       }
//     });
//   });
// }

async function MySwitch() {
  try {
    const checkSwitch = document.getElementById("switch");
    let switchFlag = await getSwitchFlag();
    if (switchFlag === true){
      checkSwitch.checked = true;
    }
    else{
      checkSwitch.checked = false;

    }
    checkSwitch.addEventListener("change", function () {
      // Code à exécuter lorsque l'état du switch change
      if (checkSwitch.checked) {
        console.log("Switch activé");
        switchFlag = true;
        // Mettre à jour la liste dans le stockage local
       chrome.storage.local.set({ switchFlag : true }, function () {
        // Envoyer un message pour indiquer que la liste a été mise à jour
        chrome.runtime.sendMessage({
          action: "popupListUpdate",
          updateFlag: true,
        });
      });
      } else {
        console.log("Switch désactivé");
        switchFlag = false;
        // Mettre à jour la liste dans le stockage local
      chrome.storage.local.set({ switchFlag : false }, function () {
        // Envoyer un message pour indiquer que la liste a été mise à jour
        chrome.runtime.sendMessage({
          action: "popupListUpdate",
          updateFlag: false,
        });
      });
      }

    });
    // await setSwitchFlag(switchFlag);
  } catch (error) {
    console.error("Erreur lors de la récupération de l'état du switch:", error);
  }
}

async function main() {
  try {
    // Récupérer la liste des sites web
    let websiteList = await getWebsiteList();
    console.log(websiteList);
    //  afficher la liste
    if (Array.isArray(websiteList)) {
      for (let i = websiteList.length - 1; i >= 0; i--) {
        document.getElementById(
          "arrayWebsite"
        ).innerHTML += `<div class="site">${websiteList[i]}<button id="erase${[
          i,
        ]}" class="button"> rm -rf </button></div>`;
      }
    } else {
      websiteList = [];
    }

    // écouteur d'événement pour le bouton d'ajouter
    document.getElementById("buttonAdd").addEventListener("click", function () {
      sumbitWebsite();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        sumbitWebsite();
      }
    });

    //Fonction enregistrer un nouveau site dans le storage
    function sumbitWebsite() {
      let valeurInput = document.getElementById("inputAdd").value;
      if (valeurInput.length > 0 && valeurInput.startsWith("https://www.")) {
        websiteList.push(valeurInput);

        let oldHTML = document.getElementById("arrayWebsite").innerHTML;
        document.getElementById("arrayWebsite").innerHTML =
          `<div class="site">${
            websiteList[websiteList.length - 1]
          }<button id="erase${websiteList.length - 1}"> rm -rf </div>` +
          oldHTML;
        console.log(websiteList);
        document.getElementById("inputAdd").value = "";

        // Mettre à jour la liste dans le stockage local
        chrome.storage.local.set({ websiteList: websiteList }, function () {
          // Envoyer un message pour indiquer que la liste a été mise à jour
          chrome.runtime.sendMessage({
            action: "popupListUpdate",
            nouvelleListe: websiteList,
          });
        });
      } else {
        alert(`Votre site doit commencer par "https://www."`);
      }

      // Afficher la liste mise à jour dans la console
      console.log(websiteList);
      location.reload();
    }

    //EFFACER ELEMENT DE LA LISTE
    for (let i = 0; i < websiteList.length; i++) {
      let eraseButton = document.getElementById(`erase${i}`);
      eraseButton.addEventListener("click", function () {
        websiteList.splice(i, 1);
        // Mettre à jour la liste dans le stockage local
        chrome.storage.local.set({ websiteList: websiteList }, function () {
          // Envoyer un message pour indiquer que la liste a été mise à jour
          chrome.runtime.sendMessage({
            action: "popupListUpdate",
            nouvelleListe: websiteList,
          });
        });
        console.log("check tab", websiteList);
        document.getElementById("arrayWebsite").innerHTML = "";
        for (let i = websiteList.length - 1; i >= 0; i--) {
          document.getElementById(
            "arrayWebsite"
          ).innerHTML += `<div class="site">${
            websiteList[i]
          }<button id="erase${[i]}"> rm -rf </button></div>`;
        }
        console.log(`Bouton ${eraseButton.id} cliqué.`);
        location.reload();
      });
    }
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la liste des sites web:",
      error
    );
  }
}

// Appel des fonctions asynchrone
main();
MySwitch()