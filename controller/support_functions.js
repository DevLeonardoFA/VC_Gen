// all elements
import attach_image  from '../elements/attach_image.js';
import attach_images from '../elements/attach_images.js';
import checkbox      from '../elements/checkbox.js';
import dropdown      from '../elements/dropdown.js';
import loop          from '../elements/loop.js';
import param_group   from '../elements/param_group.js';
import vc_link       from '../elements/vc_link.js';
import default_field from '../elements/default.js';
import textarea_html from '../elements/textarea_html.js';

let obj_attach_image    = new attach_image();
let obj_attach_images   = new attach_images();
let obj_checkbox        = new checkbox();
let obj_dropdown        = new dropdown();
let obj_loop            = new loop();
let obj_param_group     = new param_group();
let obj_vc_link         = new vc_link();
let obj_default_field   = new default_field();
let obj_textarea_html   = new textarea_html();

import { Gen_Settings, Gen_Render, Gen_Shortcode, Gen_Action } from './main_functions.js';


export default class supp_functions{

    constructor(elements, base, str){
        this.elements = elements;
        this.base = base;
        this.str = str;
    }

    generateElements(){
        return GenerateElements(this.elements, this.base);
    }

    slugfy(){
        return Slugfy(this.str);
    }

    populate_variables(){
        Populate_Variables(this.elements, this.base);
    }

}

export function GenerateElements(elements, base) {

    let returnElements = '';
    let wysiwyg = 0;

    for (let position = 0; position < elements.length; position++) {
        
        let { 
            type, 
            field_name: name, 
            field_slug: slug, 
            field_options: options 
        } = elements[position];

        switch (type) {
            case 'param_group_open':
                returnElements += obj_param_group.gen_settings(type, name, base, "open");
                break;

            case 'param_group_close':
                returnElements += obj_param_group.gen_settings(type, name, base, "close");
                break;

            case 'textarea_html':
                returnElements += obj_textarea_html.gen_settings(type, name, base);
                break;

            case 'attach_images':
                returnElements += obj_attach_images.gen_settings(type, name, base);
                break;

            case 'dropdown':
                returnElements += obj_dropdown.gen_settings(type, name, base, options);
                break;

            case 'checkbox':
                returnElements += obj_checkbox.gen_settings(type, name, base, options);
                break;

            default:
                returnElements += obj_default_field.gen_settings(type, name, base);
                break;
        }
    }

    return returnElements;
}

export function Slugfy(str) {
    return String(str)
      .normalize('NFKD') // split accented characters into their base characters and diacritical marks
      .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
      .trim() // trim leading or trailing whitespace
      .toLowerCase() // convert to lowercase
      .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
      .replace(/\s+/g, '_') // replace spaces with hyphens
      .replace(/-+/g, '_'); // remove consecutive hyphens
}

export function Populate_Variables(ID){

    var name = $('#name').val();
    var base = Slugfy($('#base').val());
    var elements = [];

    if (!name || !elements || !base){

        $('body').addClass('popup_on error');
            setTimeout(() => { $('body').removeClass('popup_on error'); }, 1000);
            return

    }
    
    var elements_length = $('.element');

    for (let i = 0; i < elements_length.length; i++) {

        let type =          $(elements_length[i]).find('select').val();
        let field_name =    $(elements_length[i]).find('#new_field_name').val();
        let field_slug =    Slugfy(field_name);
        let field_options = [];
        
        if(type === 'attach_images' || type === 'checkbox' || type === 'dropdown'){

            let options = $(elements_length[i]).find('.new_option > input');
            for (let j = 0; j < options.length; j++) {

                field_options.push($(options[j]).val());

            }

        }
        
        elements.push({type: type, field_name: field_name, field_slug: field_slug, field_options: field_options});

    }

    ID++;

    let settings = Gen_Settings(name, base, elements, ID);
    let render = Gen_Render(name, elements, ID);
    let shortcode = Gen_Shortcode(name);
    let action_map = Gen_Action(name);

    return {
        settings: settings,
        render: render,
        shortcode: shortcode,
        action_map: action_map
    }

}

export function DragAndDrop(){

    $("#elements_box").sortable();

}