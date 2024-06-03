document.addEventListener("DOMContentLoaded", function () {
  // Afficher la modal
  const containerModal = document.querySelector(".containerModal");
  const croix = document.querySelector(".containerModal .fa-xmark");
  const projetModal = document.querySelector(".projetModal");
  const admin = document.querySelector("p.admin");

  // Sélectionner les éléments de la deuxième modal
  const secondModal = document.getElementById("secondModal");
  const closeSecondModal = document.getElementById("closeSecondModal");
  const openSecondModalBtn = document.getElementById("openSecondModalBtn");
  const arrowLeft = document.querySelector(".fa-arrow-left");
  const token = window.localStorage.getItem("authToken");
  console.log("Token récupéré :", token);

  // Ouverture de la première modal
  admin.addEventListener("click", () => {
    containerModal.style.display = "flex";
    displayProjetModal();
    displayCategories();
  });

  // Fermer la première modal avec la croix
  croix.addEventListener("click", () => {
    containerModal.style.display = "none";
  });

  // Fermer la première modal en cliquant en dehors de la modal
  containerModal.addEventListener("click", (e) => {
    if (e.target.classList.contains("containerModal")) {
      containerModal.style.display = "none";
    }
  });  

  // Affichage des images dans la galerie
  async function displayProjetModal() {
    projetModal.innerHTML = "";
    const projet = await displayWorks();
    projet.forEach((element) => {
      // Création des éléments HTML pour chaque projet
      const figure = document.createElement("figure");
      const img = document.createElement("img");
      const span = document.createElement("span");
      const trash = document.createElement("i");
      // Ajout des classes et de l'id de la poubelle
      trash.classList.add("fa-solid", "fa-trash-can");
      trash.id = element.id;
      img.src = element.imageUrl;
      span.appendChild(trash);
      figure.appendChild(span);
      figure.appendChild(img);
      projetModal.appendChild(figure);
    });
    deleteImage();
  }

  // Suppression d'une image dans la modal
  function deleteImage() {
    const trashAll = document.querySelectorAll(".fa-trash-can");
    trashAll.forEach((trash) => {
      trash.addEventListener("click", (e) => {
        const id = trash.id;
        const init = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${window.localStorage.getItem(
              "authToken"
            )}`,
          },
        };
        fetch("http://localhost:5678/api/works/" + id, init)
          .then((response) => {
            if (!response.ok) {
              console.log("Le delete n'a pas marché");
            } else {
              console.log(
                "Le delete a réussi, projet supprimé avec l'ID :",
                id
              );
              displayProjetModal();
              displayWorks();
            }
          })
          .catch((error) => {
            console.error(
              "Une erreur est survenue lors de la suppression :",
              error
            );
          });
      });
    });
  }

  // Fonction pour réinitialiser la prévisualisation de l'image
  function resetImagePreview() {
    const preview = document.getElementById("previewImage");
    const icon = document.querySelector(".containerFile .fa-image");
    const label = document.querySelector(".containerFile label");
    const paragraph = document.querySelector(".containerFile p");

    preview.src = "";
    preview.style.display = "none";
    icon.classList.remove("hidden");
    label.style.display = "flex";
    paragraph.classList.remove("hidden");
  }

  // Ouverture de la deuxième modal
  openSecondModalBtn.addEventListener("click", () => {
    containerModal.style.display = "none";
    secondModal.style.display = "flex";
  });

  // Fermeture de la deuxième modal avec la croix
  closeSecondModal.addEventListener("click", () => {
    secondModal.style.display = "none";
    resetImagePreview();
  });

  // Fermeture de la deuxième modal en cliquant en dehors de la modal
  secondModal.addEventListener("click", (e) => {
    if (e.target.classList.contains("containerModal")) {
      secondModal.style.display = "none";
      resetImagePreview();
    }
  });

  // Retour avec la flèche sur la première modal
  arrowLeft.addEventListener("click", () => {
    containerModal.style.display = "flex";
    secondModal.style.display = "none";
    resetImagePreview();
  });

  // Gérer la soumission du formulaire de la deuxième modal
document.getElementById("photoForm").onsubmit = async function (event) {
  event.preventDefault();
  const fileInput = document.getElementById("photoInput");
  const file = fileInput.files[0];
  if (file) {
    const formData = new FormData();
    formData.append("title", title.value);
    formData.append("category", category.value);
    formData.append("photo", file);

    // Afficher les données du formulaire avant l'envoi
    console.log("Données du formulaire avant envoi :", formData);

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      console.log("Réponse du serveur :", response);
    } catch (error) {
      console.error("Erreur:", error);
    }
  } else {
    alert("Veuillez choisir une photo.");
  }
};


  // Gérer la prévisualisation de l'image
  document
    .getElementById("photoInput")
    .addEventListener("change", function (event) {
      const preview = document.getElementById("previewImage");
      const file = event.target.files[0];
      const reader = new FileReader();
      const icon = document.querySelector(".containerFile .fa-image");
      const label = document.querySelector(".containerFile label");
      const paragraph = document.querySelector(".containerFile p");
      if (file) {
        reader.onload = function () {
          preview.src = reader.result;
          preview.style.display = "flex";
          icon.classList.add("hidden");
          label.style.display = "none";
          paragraph.classList.add("hidden");
        };
        reader.readAsDataURL(file);
      }
    });

  // Liste de catégories dans l'input select
  async function displayCategories() {
    const select = document.querySelector(".modalAddphoto select");
    select.innerHTML = "";
    const categories = await getCategorys();
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      select.appendChild(option);
    });
  }

  // Ajouter une photo

  const formModal = document.querySelector(".modalAddphoto form");
  const title = document.querySelector(".modalAddphoto #title");
  const category = document.querySelector(".modalAddphoto #category");
  
  
  formModal.addEventListener("submit", async (e) => {
    e.preventDefault();
  
    const fileInput = document.getElementById("photoInput");
    const file = fileInput.files[0];
    const titleValue = title.value.trim();
    const categoryValue = category.value.trim();
  
    // Vérifier si les champs obligatoires sont remplis
    if (!titleValue || !categoryValue) {
      console.error("Veuillez remplir tous les champs obligatoires.");
      return;
    }
  
    const formData = new FormData();
    formData.append("title", titleValue);
    formData.append("category", categoryValue);
    
    // Ajouter le fichier uniquement s'il est sélectionné
    if (file) {
      formData.append("photo", file);
    }
  
    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log(data);
        console.log("Photo ajoutée avec succès");
        displayProjetModal();
        displayWorks();
      } else {
        console.error("Erreur lors de l'ajout de la photo:", response.status);
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  });
  
  
});

