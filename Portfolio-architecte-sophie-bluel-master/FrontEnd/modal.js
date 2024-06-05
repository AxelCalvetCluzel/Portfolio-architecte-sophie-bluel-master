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
  //Sélection de toutes les icônes de poubelle
    const trashAll = document.querySelectorAll(".fa-trash-can");
    trashAll.forEach((trash) => {
      trash.addEventListener("click", (e) => {
        const id = trash.id;
        const init = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${window.localStorage.getItem("authToken")}`,
          },
        };
  //Envoi de la requête de suppression
        fetch("http://localhost:5678/api/works/" + id, init)
          .then((response) => {
            if (!response.ok) {
              
            } else {
             
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

  // Fonction pour réinitialiser la prévisualisation de l'image et le champ de titre
  function resetImagePreview() {
    const preview = document.getElementById("previewImage");
    const icon = document.querySelector(".containerFile .fa-image");
    const label = document.querySelector(".containerFile label");
    const paragraph = document.querySelector(".containerFile p");
    const titleInput = document.getElementById("title");
    const fileInput = document.getElementById("photoInput"); 
  //Réinitialise la prévisualisation de l'image
    preview.src = "";
    preview.style.display = "none";
    icon.classList.remove("hidden");
    label.style.display = "flex";
    paragraph.classList.remove("hidden");

    // Réinitialiser le champ de titre
    titleInput.value = "";

    // Réinitialiser le champ de fichier
    fileInput.value = "";
  }

  // Fonction pour afficher les messages d'erreur
  function displayErrorMessage(message) {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = message;
    errorMessage.style.display = "block";
  }

  // Fonction pour masquer les messages d'erreur
  function hideErrorMessage() {
    const errorMessage = document.getElementById("errorMessage");
    errorMessage.textContent = "";
    errorMessage.style.display = "none";
  }

  // Ouverture de la deuxième modal
  openSecondModalBtn.addEventListener("click", () => {
    containerModal.style.display = "none";
    secondModal.style.display = "flex";
    resetAndUpdateSecondModal();
  });

  // Fonction pour réinitialiser et mettre à jour la deuxième modal
  function resetAndUpdateSecondModal() {
    resetImagePreview();
    hideErrorMessage();
    displayCategories();
  }

  // Fermeture de la deuxième modal avec la croix
  closeSecondModal.addEventListener("click", () => {
    secondModal.style.display = "none";
    resetImagePreview();
    hideErrorMessage();
  });

  // Fermeture de la deuxième modal en cliquant en dehors de la modal
  secondModal.addEventListener("click", (e) => {
    if (e.target.classList.contains("containerModal")) {
      secondModal.style.display = "none";
      resetImagePreview();
      hideErrorMessage();
    }
  });

  // Retour avec la flèche sur la première modal
  arrowLeft.addEventListener("click", () => {
    containerModal.style.display = "flex";
    secondModal.style.display = "none";
    resetImagePreview();
    hideErrorMessage();
  });

  // Gérer la prévisualisation de l'image
  document.getElementById("photoInput").addEventListener("change", function (event) {
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

  // Gérer l'ajout de photo
  const addPhotoForm = document.getElementById("photoForm");

  addPhotoForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const fileInput = document.getElementById("photoInput");
    const titleInput = document.getElementById("title");

    // Vérifier si l'image et le titre sont présents
    if (!fileInput.files[0]) {
      displayErrorMessage("Veuillez ajouter une photo.");
      return;
    }

    if (titleInput.value.trim() === "") {
      displayErrorMessage("Veuillez entrer un titre.");
      return;
    }

    const formData = new FormData();
    const categorySelect = document.getElementById("category");

    formData.append("image", fileInput.files[0]);
    formData.append("title", titleInput.value);
    formData.append("category", categorySelect.value);

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${window.localStorage.getItem("authToken")}`,
        },
        body: formData,
      });

      if (!response.ok) {
      } else {
        document.getElementById("secondModal").style.display = "none";
        resetImagePreview();
        hideErrorMessage();
        displayProjetModal();
      }
    } catch (error) {
      console.error("Une erreur est survenue lors de l'ajout de la photo :", error);
    }
  });
});
