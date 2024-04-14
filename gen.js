import { DragAndDrop } from './controller/support_functions.js';
import { Start } from './controller/main_functions.js';


let form_gen = $('#form_gen'); // Select the Form
let ID = 0; // Give to each code a unique ID


$(form_gen).submit(function(e){e.preventDefault();});

Start(ID);

DragAndDrop();
