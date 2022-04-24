export class Movies {
/*     static create (movie){
        fetch('https://movie-search-service-default-rtdb.firebaseio.com/movies.json',{
            method: 'POST',
            body: JSON.stringify(movie),
            headers: {
                'Content-Type': 'aplicatiot/json',
            }
        })
        .then(response=>{
            return response.json();
        })
        .then(response=>{
            console.log(response)
        })
    } */
}

//================================FIREBASE CONFIG=====================
 
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get, set, update } from "firebase/database";

import { Notify } from 'notiflix/build/notiflix-notify-aio';
import {  clouseModalWindow} from "../togleForm";


const firebaseConfig = {
  apiKey: "AIzaSyAD1ITuWh-_shQWGhlLmKo9WXelPFgLQWY",
  authDomain: "movie-search-service.firebaseapp.com",
  databaseURL: "https://movie-search-service-default-rtdb.firebaseio.com",
  projectId: "movie-search-service",
  storageBucket: "movie-search-service.appspot.com",
  messagingSenderId: "245930341656",
  appId: "1:245930341656:web:d908b5266d3ef6cb589a6d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getDatabase();

//========================================REFS=====================

const signupInputEmail = document.getElementById('signupInputEmail');
const signupInputPass = document.getElementById('signupInputPass');


const modal = document.querySelector("[data-modal]");
const modalLogin = document.querySelector("[data-modal-login]");
const modalSignup = document.querySelector("[data-modal-signup]");

 
const dt={};

const signupFormHendler=(e)=>{
    e.preventDefault();
    registerUser();
    dt["password"] = signupInputPass.value;
    dt["email"] = signupInputEmail.value;
   console.log(dt)
   /* modalSignup.reset(); */
   clouseModalWindow(modal)  
  }

  const loginFormHendler=(e)=>{
    e.preventDefault();
    authenticationUser();
    dt["password"] = signupInputPass.value;
    dt["email"] = signupInputEmail.value;
    /* modalLogin.reset(); */
   clouseModalWindow(modal)  
  }

  

  const name = document.getElementById('signupInputName');
  const email = document.getElementById('signupInputEmail');
  const username = document.getElementById('signupInputUsername');
  const password = document.getElementById('signupInputPass');

  const logUsername = document.getElementById('LoginInputUsername');
  const logPassword = document.getElementById('LoginInputPass');
 
  const submitBtn = document.querySelector("label.signup");
  let currentUser=null;


//=================================VALIDATION========================
const isEmptyOrSpaces=(str)=>{
    return str ===null || str.match(/^ *$/) !==null;
}

const inputValidation =()=>{
    const nameregex =/^[a-zA-Z]+$/;
    const emailregex =/^[a-zA-Z0-9]+(gmail|outlook)\.com$/;
    const usernameregex =/^[a-zA-Z]{5,}}$/;

    if(isEmptyOrSpaces(name.value)||isEmptyOrSpaces(email.value)||isEmptyOrSpaces(username.value)||isEmptyOrSpaces(password.value)){
        Notify.failure('You can not left any field ampty');
        return false;
         
    }
    
    if( !nameregex.test(name)){
        Notify.failure('Sorry,  the name should to contain only Alphabet letter/ Try again');
        return false;
    }
    if(!emailregex.test(email)){
        Notify.failure('Sorry, incorrect email/ Try again');
        return false;
    }
    if(!usernameregex.test(username)){
        Notify.failure('Sorry, the User name should be not less at 5 simbols/ Try again');
        return false;
    }
    return true;
}
//=================================VALIDATION====================================

//=================================ENCRIPTION====================================
const encPass=()=>{
    const pass12 =CryptoJS.AES.encrypt(password.value, password.value);
    return pass12.toString();
}
//=================================ENCRIPTION====================================

//=================================DECRIPTION====================================
const decPass=(dbpassword)=>{
    const pass =CryptoJS.AES.decrypt(dbpassword , logPassword.value);
    return pass.toString(CryptoJS.enc.Utf8);
}
//=================================DECRIPTION====================================

//====================================LOGIN======================================

const login=(user)=>{
    const keepLoggedIn=document.getElementById('LoginInputCheck').checked;
    if(!keepLoggedIn){
        sessionStorage.setItem('user', JSON.stringify(user));
        window.location="home.html";
    }
    else{
        localStorage.setItem('keepLoggedIn', 'Yes');
        localStorage.setItem('user', JSON.stringify(user));
        window.location="home.html";
    }
}

//====================================LOGIN======================================

//====================================SIGN OUT======================================
const singOut=()=>{
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
    localStorage.removeItem('keepLoggedIn');
    window.location="home.html";
}
//====================================SIGN OUT======================================

//=================================CHECK-USER-IN-LOCALSTORAGE========================
const getUser=()=>{
    const keepLoggedIn=localStorage.getItem("keepLoggedIn");
    if(keepLoggedIn==="Yes"){
        currentUser=JSON.parse(localStorage.getItem('user'));
    }
    else{
        currentUser=JSON.parse(sessionStorage.getItem('user'));
    }
}

//=================================CHECK-USER-IN-LOCALSTORAGE========================

//=================================REGISTER USER FIREBASE========================

const registerUser=()=>{
/*     if( !inputValidation()){
        return;
    } */
 

    const dbRef=ref(db);

    get(child(dbRef, "UserList/" + username.value))
        .then(snapshot=>{
            if(snapshot.exists()){
                Notify.success(`User allready axists`);
            }
            else{
                set(ref(db, "UserList/" + username.value),
                {
                    fullname : name.value,
                    email : email.value,
                    username : username.value,
                    password : encPass(),   /* password.value */
                    movies:  [ ],
                })
                .then(()=>{
                    Notify.success(`User added successfully`);
                })
                .catch((error)=>{
                    Notify.failure('Ops, error' + error);
                })
            }
        });


}

//=================================REGISTER USER FIREBASE========================

//=================================AUTHENTICATION========================
const authenticationUser=()=>{
    
    const dbref=ref(db);

    get(child(dbref, "UserList/" + logUsername.value))
    .then(snapshot=>{
        if(snapshot.exists()){
            const dbpassword = decPass(snapshot.child("password").val());/* .val().password */

            if(dbpassword === logPassword.value ) {
                /* login(); */
                console.log("hi")
                set(child(dbref, "UserList/" + logUsername.value+"/movies"), ["noeh","matrix","nemo"])
                const oldObj=snapshot.val();
                const {movies}=oldObj;     
                console.log(movies);               
            }
            else{
                Notify.success(`User do not exists`);
            }
            
        }
        else{
            set(ref(db, "UserList/" + username.value),
            {
                fullname : name.value,
                email : email.value,
                username : username.value,
                password : encPass(),
                 
            })
            .then(()=>{
                Notify.success(`User added successfully`);
            })
            .catch((error)=>{
                Notify.failure('Ops, error' + error);
            })
        }
    });

}
//=================================AUTHENTICATION========================




//=========================EVENTS================
/* signupBtn.addEventListener('click',registerUser) */
modalSignup.addEventListener('submit', signupFormHendler)
modalLogin.addEventListener('submit', loginFormHendler)
