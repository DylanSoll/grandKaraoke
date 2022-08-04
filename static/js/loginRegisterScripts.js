import { ajax_handler, create_form_data } from './ajaxhandler'
const usernameAllowedChars = /[^0-9A-Za-z_-]/gmi; //regex for various criteria
const numberRegEx = /[0-9]/gmi;  // the / / indicates regex
const lowerCaseRegEx = /[a-z]/gm; // the [] means any character in between
const upperCaseRegEx = /[A-Z]/gm; //A-Z means match anything between A and Z
const notStandardRegEx = /[^0-9A-Za-z]/gmi; //[^ means 'not including'
//g = global (multiple matches)
//m = multiline (can appear anywhere)
//i = case insensitive

function validateEmail(email){
  if (!email.includes('@')) return false //if no @ symbol, cant be an email

  const emailParts = email.split('@');
  
  if (emailParts.length > 2) return false //if there is more than 1 one @ symbol, cant be an email

  if ((emailParts[0].length == 0) || (emailParts[1].length == 0)) return false 
  //ensures email has content on both sides of the @
  return true
}
  
function validatePassword(password){
   if (password.length < 8) return false //passwords must be longer than 8 characters

   return true
  }

export function checkEmailForColourChange(email){
  if (email === "") return '#353535' //if no email, set background as grey

  if (validateEmail(email) === false) return '#ff0033' // if the email is invalid, red
  return '#129c00' //otherwise green
  }

export function checkPasswordForColourChange(password){
  if (password === "") return '#353535' //repeat for passcode

  if (validatePassword(password) === false) return '#ff0033'
  return '#129c00'
}

export function validateLoginDetails(email, password){
  if (validateEmail(email) === false) return false;

  if (validatePassword(password) === false) return false;

  return true
}

function validateUsername(username){
  if (typeof username !== 'string') return false //ensures that the username is a string

  if (username.includes(' ') === true) return false 
  //username cannot have spaces

  if (username.length < 3) return false;
  //must be 3 chars or longer

  const matchedLetters = username.match(usernameAllowedChars)
  if (matchedLetters !== null) return false
  //invalid characters cannot be present 
  return true
}

function validatePasswordRegister(password){
  //guard statements to ensure it meets certain conditions for security
  if (password.length < 8) return false; //must be 8+ characters 

  const numbers = password.match(numberRegEx);
  if (numbers === null) return false; //if there are no numbers, not valid

  const lowerCases = password.match(lowerCaseRegEx); //repeat process to ensure lowercases characters
  if (lowerCases === null) return false; 

  const upperCases = password.match(upperCaseRegEx);  //repeat process to ensure uppercase characters
  if (upperCases === null) return false;
  
  const notStandard = password.match(notStandardRegEx) //ensure special characters
  if (notStandard === null) return false;

  return true; //if it remains here, it must be a valid password
}
function matchStrings(firstItem, secondItem){
  if (firstItem !== secondItem) return false; 
  //if they dont match return false
  return true; //else return true
}

function validateEmailRegister(email){
  if (email.includes('@') === false) return false; //ensure email is valid, runs through same steps as login
  if (email.includes(' ') === true) return false;
  const emailParts = email.split('@');
  if (emailParts.length !== 2) return false;
  if ( (emailParts[0].length === 0) || (emailParts[1].length === 0) ) return false;
  return true
}
export function checkRegEmailForColourChange(email){
  if (email === "") return '#353535'; //if no email, set background as grey
  if (validateEmailRegister(email) === false) return '#ff0033'; //red if invalid, green is valid
  return '#129c00';
}

export function checkRegPasswordForColourChange(password){
  if (password === "") return '#353535'; //grey if no password
  if (validatePasswordRegister(password) === false) return '#ff0033'; //red if invalid, green is valid
  return '#129c00';
}

export function checkUsernameForColourChange(username){
  if (username === "") return '#353535';
  if (validateUsername(username) === false) return '#ff0033'; //same as email and password
  return '#129c00';
}
export function matchEmailForColourChange(email, confirmEmail){
  if (confirmEmail === "") return '#353535';
  if (matchStrings(email, confirmEmail) === false) return '#ff0033'; //same as email and password
  return '#129c00';
}
export function matchPasswordForColourChange(password, confirmPassword){
  if (confirmPassword === "") return '#353535'; //same as email and password
  if (matchStrings(password, confirmPassword) === false) return '#ff0033';
  return '#129c00';
}

export function validateRegisterDetails(username, email, confirmEmail, password, confirmPassword){
  if (validateUsername(username) === false) return false;
  if (matchStrings(email, confirmEmail) === false) return false;
  if (matchStrings(password, confirmPassword) === false) return false;
  if (validateEmailRegister(email) === false) return false;
  if (validatePasswordRegister(password) === false) return false;
  //if everything is validated, return true, otherwise return false
  return true
}

export function tryLogin(email, password, onSuccess){
  if (validateEmail(email) === false) return false; 
  if (validatePassword(password) === false) return false;
  //if both password and email is valid, allow login attempt
  const loginForm = create_form_data({ 
    'email': email, //create a form with the login details
    'password': password,
  }); // creates a form with the login data
  ajax_handler('http://dylansoll.pythonanywhere.com/login', onSuccess, loginForm); //send an AJAX request to login
  return true
}

export function tryRegister(username, email, confirmEmail, password, confirmPassword, onSuccess){
  if (validateUsername(username) === false) return [false, 'username']; 
  if (matchStrings(email, confirmEmail) === false) return [false, 'emails dont match'];
  if (matchStrings(password, confirmPassword) === false) return [false, 'passwords dont match'];
  if (validateEmailRegister(email) === false) return [false, 'email'];
  if (validatePasswordRegister(password) === false) return [false, 'password'];
  //ensures everything is valid, and if it fails, it returns why
  const registerForm = create_form_data({
    'username':username,
    'email': email,
    'password': password //creates form with the important details (email, username, password)
  }); 
  ajax_handler('http://dylansoll.pythonanywhere.com/register', onSuccess, registerForm); //send register request
  return true
}