import {BANNED_WORDS} from './bannedWords'
import { ajax_handler, create_form_data } from './ajaxhandler'
const usernameAllowedChars = /[^0-9A-Za-z_-]/gmi;

const numberRegEx = /[0-9]/gmi;
const lowerCaseRegEx = /[a-z]/gmi;
const upperCaseRegEx = /[A-Z]/gmi;
const notStandardRegEx = /[^0-9A-Za-z]/gmi;

function validateEmail(email){
    if (!email.includes('@')) return false //if no @ symbol, cant be an email
  
    const emailParts = email.split('@');
    
    if (emailParts.length > 2) return false
  
    if ((emailParts[0].length == 0) || (emailParts[1].length == 0)) return false
  
    return true
  }
  
function validatePassword(password){
   const BANNED_CHARS = /[ ]/gmi //REGEX for banned characters (currently space)
   if (password.length < 8) return false
  
   /*const bannedCharsFound = password.match(BANNED_CHARS)
   console.log(bannedCharsFound)
   bannedCharsFound = []
   if (bannedCharsFound.length !== 0) return false
   */
   return true
  }

export function checkEmailForColourChange(email){
  if (email === "") return '#353535'

  if (validateEmail(email) === false) return '#ff0033'
  return '#129c00'
  }

export function checkPasswordForColourChange(password){
  if (password === "") return '#353535'

  if (validatePassword(password) === false) return '#ff0033'
  return '#129c00'
}


export function validateLoginDetails(email, password){
  if (validateEmail(email) === false) return false;

  if (validatePassword(password) === false) return false;

  return true
}






function validateUsername(username){
  if (typeof username !== 'string') return false

  if (username.includes(' ') === true) return false
  //username cannot have spaces

  if (username.length < 3) return false;
  //must be 3 chars or longer

  const matchedLetters = username.match(usernameAllowedChars)
  if (matchedLetters !== null) return false
  //if valid chars

  //profane filter
  //BANNED_WORDS.forEach((word)=>{if (username.includes(word)) return false})

  return true
}

function validatePasswordRegister(password){

  if (password.includes(' ') === true) return false

  if (password.length < 8) return false;

  const numbers = password.match(numberRegEx);

  if (numbers === null) return false;

  const lowerCases = password.match(lowerCaseRegEx);

  if (lowerCases === null) return false;

  const upperCases = password.match(upperCaseRegEx);

  if (upperCases === null) return false;
  
  const notStandard = password.match(notStandardRegEx)

  if (notStandard === null) return false;

  return true;
}
function matchStrings(firstItem, secondItem){
  if (firstItem !== secondItem) return false; 
  
  return true;
}

function validateEmailRegister(email){

  if (email.includes('@') === false) return false

  if (email.includes(' ') === true) return false

  const emailParts = email.split('@')

  if (emailParts.length !== 2) return false

  if ( (emailParts[0].length === 0) || (emailParts[1].length === 0) ) return false

  
  return true
}
export function checkRegEmailForColourChange(email){
  if (email === "") return '#353535'

  if (validateEmailRegister(email) === false) return '#ff0033'
  return '#129c00'
}

export function checkRegPasswordForColourChange(password){
  if (password === "") return '#353535'

  if (validatePasswordRegister(password) === false) return '#ff0033'
  return '#129c00'
}

export function checkUsernameForColourChange(username){
  if (username === "") return '#353535'

  if (validateUsername(username) === false) return '#ff0033'

  return '#129c00'
}
export function matchEmailForColourChange(email, confirmEmail){
  if (confirmEmail === "") return '#353535'

  if (matchStrings(email, confirmEmail) === false) return '#ff0033'
  
  return '#129c00'
}
export function matchPasswordForColourChange(password, confirmPassword){
  if (confirmPassword === "") return '#353535'

  if (matchStrings(password, confirmPassword) === false) return '#ff0033'
  
  return '#129c00'
}



export function validateRegisterDetails(username, email, confirmEmail, password, confirmPassword){
  if (validateUsername(username) === false) return false

  if (matchStrings(email, confirmEmail) === false) return false

  if (matchStrings(password, confirmPassword) === false) return false

  if (validateEmailRegister(email) === false) return false

  if (validatePasswordRegister(password) === false) return false

  return true
}

export function tryLogin(email, password, onSuccess){
  if (validateEmail(email) === false) return false;

  if (validatePassword(password) === false) return false;

  const loginForm = create_form_data({ 
    'email': email,
    'password': password,
  }); // creates a form with the login data
  ajax_handler('http://dylansoll.pythonanywhere.com/login', onSuccess, loginForm);
  return true
}

export function tryRegister(username, email, confirmEmail, password, confirmPassword, onSuccess){

  if (validateUsername(username) === false) return [false, 'username'] 

  if (matchStrings(email, confirmEmail) === false) return [false, 'emails dont match']

  if (matchStrings(password, confirmPassword) === false) return [false, 'passwords dont match']

  if (validateEmailRegister(email) === false) return [false, 'email']
  
  if (validatePasswordRegister(password) === false) return [false, 'password']
  const registerForm = create_form_data({
    'username':username,
    'email': email,
    'password': password
  }) 
  ajax_handler('http://dylansoll.pythonanywhere.com/register', onSuccess, registerForm);
  return true
}