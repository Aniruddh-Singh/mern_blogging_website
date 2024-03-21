
import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth"

const firebaseConfig = {
    apiKey: "AIzaSyAJrPqVa7BzpH_AqIUVdqCQ-qHOPDpiDKU",
    authDomain: "likho7571.firebaseapp.com",
    projectId: "likho7571",
    storageBucket: "likho7571.appspot.com",
    messagingSenderId: "509991453397",
    appId: "1:509991453397:web:b67feb72b3923c8ebc985c",
    measurementId: "G-Y52CNBKK93"
};

const app = initializeApp(firebaseConfig);

// Google auth
const provider = new GoogleAuthProvider();

const auth = getAuth();

export const authWithGoogle = async () => {
    let user = null;

    await signInWithPopup(auth, provider)
        .then((result) => {
            user = result.user;
        })
        .catch((err) => {
            console.log(err)
        })

    return user;
}