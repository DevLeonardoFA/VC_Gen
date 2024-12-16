import { Slugfy, GenerateElements, Populate_Variables } from "./../controller/support_functions.js";

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
import exploded_textarea from '../elements/exploded_textarea.js';

let obj_attach_image    = new attach_image();
let obj_attach_images   = new attach_images();
let obj_loop            = new loop();
let obj_param_group     = new param_group();
let obj_vc_link         = new vc_link();
let obj_default_field   = new default_field();
let obj_textarea_html   = new textarea_html();
let obj_exploded_textarea = new exploded_textarea();

export default class main_functions{
    
    constructor(code_generated, name, base, image, elements){
        this.code_generated = code_generated;
        this.name = name;
        this.base = base;
        this.image = image;
        this.elements = elements;
    }

    copy_to_clipboard(){
        CopyToClipboard(this.code_generated);
    }

    gen_settings(){
        Gen_Settings(this.name, this.base, this.image, this.elements);
    }

    gen_render(){
        Gen_Render(this.name, this.elements);
    }

    gen_shortcode(){
        Gen_Shortcode(this.name);
    }

    gen_action(){
        Gen_Action(this.name);
    }
    

}

export function Start(ID){

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
}

// others Functions
export async function CopyToClipboard(code_generated) {

    try {

        await navigator.clipboard.writeText(code_generated);

    } catch (error) {

        console.error('Failed to copy text to clipboard:', error);
        
    }

}




// main Functions
export function Gen_Settings(name, base, image, elements, ID){
    //TO DO: fix path for images
    return `
    /**
    * Element Gen 0${ID}
	* Register fields for ${name}
	*
    * @return array
	*/
    public static function ${Slugfy(name)}_element_settings() {

        vc_map(
            [
                "name"     => __( "${name}", ${base.toUpperCase()}_THEME_SLUG ),
                "base"     => self::$vc_prefix . "${Slugfy(name)}",
                "class"    => "",
                "icon" => get_template_directory_uri() . "/inc/assets/images/vc_components_images/${image}",
                "category" => ${base.toUpperCase()}_THEME_NAME,
                "params"   => [
                    ${GenerateElements(elements, base)}
                ]
            ]
        );
        
    }
    `;

}

export function Gen_Render(name, elements, ID){

    
    
    return `

    /**
     * Element Gen 0${ID} Render Function
     * 
     * 
     * @param array  $atts
     * @param string $content
     *
     * @return false|string
     * 
     */
    public static function render_${Slugfy(name)}_section($atts, $content){
    
        global $post;

        ob_start();
    ?>
        <section class="${Slugfy(name)}-section" data-aos-duration="2000" data-aos="fade-up">
            <div class="container">

                ${elements.map(element => {

                    var type = element.type;
                    var slug = element.field_slug;

                    switch (element.type) {

                        case "param_group_open":
                            return obj_param_group.gen_render(type, slug, "open");;

                        case "param_group_close":
                            return obj_param_group.gen_render(type, slug, "close");

                        case "exploded_textarea":
                            return obj_exploded_textarea.gen_render(type, slug,);

                        case "vc_link":
                            return obj_vc_link.gen_render(type, slug,);

                        case "attach_image":
                            return obj_attach_image.gen_render(type, slug,);

                        case "attach_images":
                            return obj_attach_images.gen_render(type, slug,);

                        case "loop":
                            return obj_loop.gen_render(type, slug,);

                        case "textarea_html":
                            return obj_textarea_html.gen_render(type, slug,);
                        
                        default:
                            return obj_default_field.gen_render(type, slug,);

                    }
                }).join("")}

            </div>
        </section>
    <?php

    return ob_get_clean();

    }
    `;


}

export function Gen_Shortcode(name){
    
    return `add_shortcode(self::$vc_prefix . '${Slugfy(name)}', __CLASS__ . '::render_${Slugfy(name)}_section');`;

}

export function Gen_Action(name){

    return `add_action( 'vc_before_init', __CLASS__ . '::${Slugfy(name)}_element_settings' );`;

}