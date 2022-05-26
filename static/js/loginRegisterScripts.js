import {BANNED_WORDS} from './bannedWords'
import { ajax_handler, create_form_data } from './ajaxhandler'
const usernameAllowedChars = /[^0-9A-Za-z_-]/gmi

const numberRegEx = /[0-9]/gmi
const lowerCaseRegEx = /[a-z]/gm
const upperCaseRegEx = /[A-Z]/gm
const notStandard = /[^0-9A-Za-z]/gmi

export function validateEmail(email){
    if (!email.includes('@')) return false //if no @ symbol, cant be an email
  
    let emailParts = email.split('@');
    
    if (emailParts.length > 2) return false
  
    if ((emailParts[0].length == 0) || (emailParts[1].length == 0)) return false
  
    return true
  }
  
export function validatePassword(password){
   const BANNED_CHARS = /[ ]/gmi //REGEX for banned characters (currently space)
   if (password.length < 8) return false
  
   /*const bannedCharsFound = password.match(BANNED_CHARS)
   console.log(bannedCharsFound)
   bannedCharsFound = []
   if (bannedCharsFound.length !== 0) return false
   */
   return true
  }
  
export function handleLogin(response){
    const username = response?.username;
    const name = response?.name;
    const permissions = response?.permissions;
    const userid = response?.userid;
    alert(response);
}

export function tryLogin(email, password){
    const validEmail = validateEmail(email);
    const validPassword = validatePassword(password);
    
    if (validEmail && validPassword){
        const loginInfo = {'email':email, 'password':password
        }
        ajax_handler('http://dylansoll.pythonanywhere.com/login', console.log, create_form_data(loginInfo));
    }
  }

function validateUsername(username){
  if (! username instanceof String) return false; 
  //ensure username is string 
  if (username.length < 3) return false;
  //must be 3 chars or longer

  const matchedLetters = username.match(usernameAllowedChars)
  if (matchedLetters.length !== 0) return false
  //if valid chars

  //profane filter
  BANNED_WORDS.forEach((word)=>{
    if (username.includes(word)) return false
  })

  return true
}

function validatePasswordRegister(password){
  if (! password instanceof String) return false; 
  //ensure password is string

  if (password.length < 8) return false;

  const numbers = password.match(numberRegEx);

  if (numbers.length === 0) return false;

  const lowerCases = password.match(lowerCaseRegEx);

  if (lowerCases.length === 0) return false;

  const upperCases = password.match(upperCaseRegEx);

  if (upperCases.length === 0) return false;
  
  return true;
}
