
document.addEventListener("DOMContentLoaded", function () {
  // Variables
  const form = document.querySelector("form");
  const messageError = document.querySelector("section#login p");
  const buttonModifier = document.querySelector(".buttonModifier");
  const loginButton = document.querySelector("button");
  const email = document.querySelector("#emailLogin");
  const password = document.querySelector("#passwordLogin");
  const editModeBar = document.getElementById("edit-mode-bar");

  // Vérifiez l'état de connexion de l'utilisateur
  const suprModifier = window.sessionStorage.getItem("loged") === "true";
  if (!suprModifier && buttonModifier) {
    buttonModifier.style.display = "none";
  } else {
    if (editModeBar) {
      editModeBar.classList.remove("hidden");
    }
  }

  // Récupération des données de connexion
  
  async function loginUser(event) {
    event.preventDefault();
    console.log(email);
    console.log(password);

    const login = {
      email: email.value,
      password: password.value,
    };
    const chargeUtile = JSON.stringify(login);
    const response = await fetch("http://localhost:5678/api/users/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: chargeUtile,
    });

    // Gestion des résultats
    if (response.ok) {
      const responseData = await response.json();
      const token = responseData.token;
      window.sessionStorage.setItem("authToken", token);
      window.sessionStorage.setItem("loged", true);
      window.location.href = "index.html";
    } else {
      if (messageError) {
        messageError.textContent = "Votre mot de passe ou votre email est incorrect.";
      } else {
        console.error("Élément pour le message d'erreur n'existe pas dans le DOM");
      }
    }
  }

  // Gestion du bouton de connexion
  if (loginButton && form) {
    loginButton.addEventListener("click", function (event) {
      event.preventDefault();
      form.dispatchEvent(new Event("submit"));
    });

    form.addEventListener("submit", loginUser);
  } else {
    console.error("Formulaire ou bouton de connexion introuvable dans le DOM");
  }

  // Utilisateur connecté
  const loged = window.sessionStorage.getItem("loged");
  const logout = document.querySelector("header nav ul .logout");
  
  if (loged === "true") {
    const filters = document.getElementById("filters");
    if (filters) {
      filters.style.display = "none";
    }
    if (logout) {
      logout.textContent = "logout";
      logout.addEventListener("click", () => {
        window.sessionStorage.setItem("loged", false);
        window.location.reload();
      });
    } else {
      console.error("Élément de déconnexion introuvable dans le DOM");
    }

    if (editModeBar) {
      editModeBar.classList.remove("hidden");
    }
  } else {
    if (editModeBar) {
      editModeBar.classList.add("hidden");
    }
  }
});


