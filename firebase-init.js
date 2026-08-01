// firebase-init.js
// Inicialización única de Firebase para todo el portal de Grupo Scout Pringles
// (Chino/Pañol, portal de dirigentes, portal de jóvenes, etc. — todos importan de acá)

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyDChfMLWjpHeHLhCcO8DtAfl_kn2ZvRvOM",
  authDomain: "stockpringles-76394.firebaseapp.com",
  projectId: "stockpringles-76394",
  storageBucket: "stockpringles-76394.firebasestorage.app",
  messagingSenderId: "395333679885",
  appId: "1:395333679885:web:7ae61dcbba36fb9dde0e44"
};

// Esta es la única instancia de la app: todos los demás módulos (auth-google.js,
// el módulo de stock, perfiles, etc.) importan "app" desde este archivo.
export const app = initializeApp(firebaseConfig);
