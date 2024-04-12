import { Slugfy, Populate_Variables } from './controller/support_functions.js';
import main_functions from './controller/main_functions.js';


let form_gen = $('#form_gen'); // Select the Form
let ID = 0; // Give to each code a unique ID


$(form_gen).submit(function(e){e.preventDefault();});


$(".gen_btn_group > button").on('click', function(){

    Populate_Variables(ID);

    // var btn_generate = $(this).attr('id');
    // var Code_Generated = ""


    // if (!name || !elements || !base){

    //     $('body').toggleClass('popup_on error');
    //     setTimeout(() => { $('body').toggleClass('popup_on error'); }, 1000);
    //     return

    // }


    // switch (btn_generate) {

    //     case 'gen_settings':
    //         Code_Generated = main_functions.gen_settings(name, base, elements);
    //         break;

    //     case 'gen_renders':
    //         Code_Generated = main_functions.gen_renders(name, base, elements);
    //         break;

    //     case 'gen_shortcode':
    //         Code_Generated = main_functions.gen_shortcode(name);
    //         break;

    //     default:
    //         Code_Generated = main_functions.gen_action(name);
    //         break;

    // }


    // //pass to clipboard
    // supp_functions.copyToClipboard(Code_Generated);

    // $('body').toggleClass('popup_on ok');
    // setTimeout(() => { $('body').toggleClass('popup_on ok'); }, 1000);


});
