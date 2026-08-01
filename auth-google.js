// auth-google.js
// Módulo de acceso con Google para "Stock La Pringles" (y el resto del portal de dirigentes)
// Requiere: Firebase Auth + Firestore ya inicializados en tu proyecto.

import {
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore, doc, getDoc, setDoc, deleteDoc, collection, getDocs, updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { app } from "./firebase-init.js";

const auth = getAuth(app);
const db = getFirestore(app);

export const SUPER_ADMIN = "alan.d.fernandez23@gmail.com";

// --- Login / Logout ---
export function iniciarSesionConGoogle() {
  const provider = new GoogleAuthProvider();
  // Opcional: restringe el picker de cuentas a Gmail de tu dominio de scouts si tuvieran uno
  return signInWithPopup(auth, provider);
}
export function cerrarSesion() {
  return signOut(auth);
}

// --- Verificación de acceso (colección "usuarios_autorizados") ---
// Documento: usuarios_autorizados/{email} => { rol: "admin" | "dirigente", agregadoPor, fecha }
export async function verificarAcceso(email) {
  const e = email.toLowerCase();
  if (e === SUPER_ADMIN) return { autorizado: true, rol: "admin" };
  const ref = doc(db, "usuarios_autorizados", e);
  const snap = await getDoc(ref);
  if (!snap.exists()) return { autorizado: false, rol: null };
  return { autorizado: true, rol: snap.data().rol };
}

// --- Escucha de estado de sesión: llamalo una vez al cargar la app ---
// callback recibe (user, rol) o (null, null) si no hay sesión o no está autorizado
export function observarSesion(callback) {
  onAuthStateChanged(auth, async (user) => {
    if (!user || !user.email) { callback(null, null); return; }
    const { autorizado, rol } = await verificarAcceso(user.email);
    if (!autorizado) { await signOut(auth); callback(null, null); return; }
    callback(user, rol);
  });
}

// --- Administración de accesos (solo llamar si el usuario actual es admin) ---
export async function otorgarAcceso(email, rol, adminActual) {
  const e = email.toLowerCase();
  await setDoc(doc(db, "usuarios_autorizados", e), {
    rol, // "admin" | "dirigente"
    agregadoPor: adminActual,
    fecha: Date.now()
  });
}
export async function cambiarRolUsuario(email, nuevoRol) {
  await updateDoc(doc(db, "usuarios_autorizados", email.toLowerCase()), { rol: nuevoRol });
}
export async function quitarAcceso(email) {
  if (email.toLowerCase() === SUPER_ADMIN) throw new Error("No se puede quitar al administrador principal");
  await deleteDoc(doc(db, "usuarios_autorizados", email.toLowerCase()));
}
export async function listarUsuariosAutorizados() {
  const snap = await getDocs(collection(db, "usuarios_autorizados"));
  return snap.docs.map(d => ({ email: d.id, ...d.data() }));
}
