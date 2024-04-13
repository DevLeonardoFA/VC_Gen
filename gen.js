import { Populate_Variables } from './controller/support_functions.js';
import { CopyToClipboard } from './controller/main_functions.js';


let form_gen = $('#form_gen'); // Select the Form
let ID = 0; // Give to each code a unique ID


$(form_gen).submit(function(e){e.preventDefault();});


$(".gen_btn_group > button").on('click', function(){

    let codes = Populate_Variables(ID);

    var btn_generate = $(this).attr('id');
    var Code_Generated = ""


    switch (btn_generate) {

        case 'gen_settings':
            Code_Generated = codes.settings;
            break;

        case 'gen_renders':
            Code_Generated = codes.render;
            break;

        case 'gen_shortcode': 
            Code_Generated = codes.shortcode;
            break;

        default:
            Code_Generated = codes.action_map;
            break;

    }


    //pass to clipboard
    CopyToClipboard(Code_Generated);

    $('body').addClass('popup_on ok');
    setTimeout(() => { $('body').removeClass('popup_on ok'); }, 1000);


});
