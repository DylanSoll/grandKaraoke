"use strict"

function create_form_data(data){
    const form_data = new FormData(); //create a form object since one does not exist
    const key_array = Object.keys(data); //creates an object of all keys
    key_array.forEach(key => { //iterates through each key
        form_data.append(key, data[key]); //adds data to form data
    });
    return form_data //returns form data object
 }

function ajax_handler(url, callback=console.log, form_object=null, request_method='POST', async_var = true){
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

