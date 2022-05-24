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
        ajax_handler('http://dylansoll.pythonanywhere.com/login', alert, create_form_data(loginInfo));
    }
  }

export default tryLogin