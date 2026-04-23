import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";


const firebaseConfig = {
  apiKey: "AIzaSyDiuBAsoGDu2L-K2m1rI1-UIVmoXM5uJKc",
  authDomain: "my-portfolio-6f2b6.firebaseapp.com",
  projectId: "my-portfolio-6f2b6",
  storageBucket: "my-portfolio-6f2b6.firebasestorage.app",
  messagingSenderId: "795983404958",
  appId: "1:795983404958:web:d59e128e586770db9d008f",
  measurementId: "G-0VQ997N1V0"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);