// Fonction pour retourner le tableau des works
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}

// Fonction pour afficher les works et retourner le tableau des travaux
async function displayWorks() {
  const arrayWorks = await getWorks();
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  arrayWorks.forEach((element) => {
    createImage(element);
  });

  return arrayWorks; // Retourne le tableau des travaux dans la modal
}

// Fonction pour créer une image
function createImage(element) {
  const gallery = document.querySelector(".gallery");
  const figure = document.createElement("figure");
  const img = document.createElement("img");
  const figcaption = document.createElement("figcaption");
  img.src = element.imageUrl;
  figcaption.textContent = element.title;
  figure.appendChild(img);
  figure.appendChild(figcaption);
  gallery.appendChild(figure);
}

// Fonction pour retourner les catégories
async function getCategorys() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}

// Fonction pour afficher les boutons des catégories
async function displayCategoriesButtons() {
  const categorys = await getCategorys();
  const filters = document.getElementById("filters");
  
  // Ajoute un bouton pour "Tous"
  const allButton = document.createElement("button");
  allButton.textContent = "Tous";
  allButton.id = "0";
  filters.appendChild(allButton);
  
  categorys.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.id = category.id;
    filters.appendChild(btn);
  });
  displayclicButtons();
}

// Fonction pour afficher les travaux filtrés par le clic sur les boutons de catégorie
async function displayclicButtons() {
  const projet = await getWorks();
  const gallery = document.querySelector(".gallery");
  const buttons = document.querySelectorAll("#filters button");
  
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      const btnId = e.target.id;
      gallery.innerHTML = "";
      if (btnId !== "0") {
        const tridesProjets = projet.filter((element) => {
          return element.categoryId == btnId;
        });
        tridesProjets.forEach((element) => {
          createImage(element);
        });
      } else {
        displayWorks();
      }
    });
  });
}


// Initialisation de l'affichage
async function init() {
  await displayWorks();
  await displayCategoriesButtons();
}

init();




