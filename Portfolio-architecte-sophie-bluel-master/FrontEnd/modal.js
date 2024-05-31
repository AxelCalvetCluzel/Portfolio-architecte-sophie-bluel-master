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
            Authorization: `Bearer ${window.sessionStorage.getItem(
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
  document.getElementById("photoForm").onsubmit = function (event) {
    event.preventDefault();
    var fileInput = document.getElementById("photoInput");
    var file = fileInput.files[0];
    if (file) {
      alert("Photo ajoutée : " + file.name);
      secondModal.style.display = "none";
      resetImagePreview();
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
    const categories = await getCategorys();
    categories.forEach((category) => {
      const option = document.createElement("option");
      option.value = category.id;
      option.textContent = category.name;
      select.appendChild(option);
    });
  }

  // Ajouter une photo

  const form = document.querySelector(".modalAddphoto form");
  const title = document.querySelector(".modalAddphoto #title");
  const category = document.querySelector(".modalAddphoto #category");
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY1MTg3NDkzOSwiZXhwIjoxNjUxOTYxMzM5fQ.JGN1p8YIfR-M-5eQ-Ypy6Ima5cKA4VbfL2xMr2MgHm4"; 

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title.value);
    formData.append("category", category.value);
    formData.append("photo", document.querySelector("#photoInput").files[0]);

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        console.log("Photo ajoutée avec succès");
        displayProjetModal();
        displayWorks();
      } else {
        console.error("Erreur lors de l'ajout de la photo");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  });
});

