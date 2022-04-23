export class Movies {
    static create (movie){
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
    }
}

//================================FIREBASE CONFIG=====================
 
import { initializeApp } from "firebase/app";
import { getDatabase, ref, child, get, set } from "firebase/database";
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
const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.login");
const loginBtn = document.querySelector("label.login");
const signupBtn = document.querySelector("label.signup");
const signupLink = document.querySelector("form .signup-link a");

const LoginInputPass = document.getElementById('LoginInputPass');
const LoginInputEmail = document.getElementById('LoginInputEmail');
const modal = document.querySelector("[data-modal]");

const data={};
const loginFormHendler=(e)=>{
  e.preventDefault();
  data["password"] = LoginInputPass.value;
  data["email"] = LoginInputEmail.value;
 console.log(data)
 clouseModalWindow(modal)
 return data;

}

loginForm.addEventListener('submit', loginFormHendler)

export const loginData=( )=>data;

  const name=0,
        email=0,
        username=0,
        password=0,
        submitBtn=0
  let currentUser=null;


//=================================VALIDATION========================
const isEmptyOrSpaces=(str)=>{
    return str ===null || str.match(/^ *$/) !==null;
}

const inputValidation =()=>{
    const nameregex =/^[a-zA-Z]+$/;
    const emailregex =/^[a-zA-Z0-9]+(gmail|outlook)\.com$/;
    const usernameregex =/^[a-zA-Z]{5,}}$/;

    if(isEmptyOrSpaces(name.value)||
       isEmptyOrSpaces(email.value)||
       isEmptyOrSpaces(username.value)||
       isEmptyOrSpaces(password.value)){
        Notify.failure('You can not left any field ampty');
        return false;
    }
    
    if(!nameregex.test(name)){
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
    const pass12 =CryptoJS.AES.decrypt(dbpassword.value, password.value);
    return pass12.toString(CryptoJS.enc.UTF8);
}
//=================================DECRIPTION====================================

//====================================LOGIN======================================

const login=(user)=>{
    const keepLoggedIn=document.getElementById('userSwitch').checked;
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

//=================================REGISTER USER FIREBASE========================

const registerUser=()=>{
    if(!inputValidation()){
        return;
    }

    const dbRef=ref(db);

    get(child(dbRef, "UserList/" + username.value))
        .then(snapshot=>{
            if(snapshot.axists()){
                Notify.success(`User allready axists`);
            }
            else{
                set(ref(db, "UserList/" + username.value),
                {
                    fullname : name.value,
                    email : email.value,
                    username : username.value,
                    password : encPass(),
                    movies: [],
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

    get(child(dbref, "UserList/" + username.value))
    .then(snapshot=>{
        if(snapshot.axists()){
            const dbpassword = decPass(snapshot.value);

            if(dbpassword === password.value ) {
                login();
            }
            else{
                Notify.success(`User do not axists`);
            }
            
        }
        else{
            set(ref(db, "UserList/" + username.value),
            {
                fullname : name.value,
                email : email.value,
                username : username.value,
                password : encPass(),
                movies: [],
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
