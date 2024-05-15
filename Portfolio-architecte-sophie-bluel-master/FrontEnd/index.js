// variables

// fonction pour retourner le tableau des works
async function getWorks() {
  const response = await fetch("http://localhost:5678/api/works");
  return await response.json();
}
getWorks();

// afficher les works
async function displayWorks() {
  const arrayWorks = await getWorks();
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  arrayWorks.forEach((element) => {
    createImage(element);
     });
}
displayWorks();

function createImage(element){
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
// affichage des boutons
async function getCategorys() {
  const response = await fetch("http://localhost:5678/api/categories");
  return await response.json();
}
getCategorys();

async function displayCategoriesButtons() {
  const categorys = await getCategorys();
  const filters = document.getElementById("filters");
  console.log(categorys);
  categorys.forEach((category) => {
    const btn = document.createElement("button");
    btn.textContent = category.name;
    btn.id = category.id;
    filters.appendChild(btn);
  });
}
displayCategoriesButtons();

//  affichage au clic

async function displayclicButtons() {
  const projet = await getWorks();
  const gallery = document.querySelector(".gallery");
  const buttons = document.querySelectorAll("#filters button");
  buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
      btnId = e.target.id;
      gallery.innerHTML = "";
      if (btnId !== "0") {
        const tridesProjets = projet.filter((element) => {
            return element.categoryId == btnId;
        });
        tridesProjets.forEach(element => {
            createImage(element);
        });
      }else{
        displayWorks();
      }
      console.log(btnId);
    });
  });
}
displayclicButtons();
