"use strict"

export function create_form_data(data){
    const form_data = new FormData(); //create a form object since one does not exist
    const key_array = Object.keys(data); //creates an object of all keys
    key_array.forEach(key => { //iterates through each key
        form_data.append(key, data[key]); //adds data to form data
    });
    return form_data //returns form data object
 }

export function ajax_handler(url, callback=console.log, form_object=null, request_method='POST', async_var = true){
    const XMLhr = new XMLHttpRequest(); //create a request object

    XMLhr.open(request_method, url, async_var); //opens a new XMLHttpRequest

    XMLhr.onreadystatechange = () =>{  //callback function
        if (XMLhr.readyState !== 4) return//4 if not ready, exit 
        
        if (XMLhr.status === 200){
            let response = JSON.parse(XMLhr.responseText); //change JSON into a Javascript object
            callback(response); //call the callback function
            return //if http code is 200 or 'OK', it doesn't need to be logged
        }
        console.log(`XMLHttpRequest returned status code of: ${XMLhr.status}`);
    }
    XMLhr.send(form_object); //send the form data
}

const API_KEY = 'badc7baeeamsh7de16dfafae2bf6p1b8019jsn3188359ba6cf';

export function communicateWithSpotify(slug, params, callback){
  const xhr = new XMLHttpRequest();
  xhr.withCredentials = true;

  xhr.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
      callback(JSON.parse(this.responseText));
    }
  });
	let stringParams = "";
  let prefix = '?';
  Object.keys(params).forEach(key => {
    stringParams += `${prefix}${key}=${params[key]}`;
    prefix = '&';
  })
  xhr.open("GET", `https://spotify23.p.rapidapi.com/${slug}/${stringParams}`);
  xhr.setRequestHeader("X-RapidAPI-Key", API_KEY);
  xhr.setRequestHeader("X-RapidAPI-Host", "spotify23.p.rapidapi.com");

  xhr.send(); 
	return
}
