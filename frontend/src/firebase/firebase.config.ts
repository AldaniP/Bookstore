import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env?.["VITE_API_KEY"] || "dummy-api-key",
  authDomain: import.meta.env?.["VITE_Auth_Domain"] || "dummy-auth-domain",
  projectId: import.meta.env?.["VITE_PROJECT_ID"] || "dummy-project-id",
  storageBucket: import.meta.env?.["VITE_STORAGE_BUCKET"] || "dummy-storage-bucket",
  messagingSenderId: import.meta.env?.["VITE_MESSAGING_SENDERID"] || "dummy-sender-id",
  appId: import.meta.env?.["VITE_APPID"] || "dummy-app-id",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const storage = getStorage(app);
