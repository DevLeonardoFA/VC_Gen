let form_gen = $('#form_gen');
let ID = 0;

let name = NaN;
let base = NaN;
let elements = NaN;


$(form_gen).submit(function(e){e.preventDefault();});

$(".gen_btn_group > button").on('click', function(){

    populate_variables();

    var gen_what = $(this).attr('id');
    var result = ""

    if (!name || !elements || !base) return alert("You must set a Name, Base and Elements first");

    switch (gen_what) {

        case 'gen_settings':
            result = gen_settings(name, base, elements);
            break;

        case 'gen_renders':
            result = gen_render(name, elements);
            break;

        case 'gen_shortcode':
            result = gen_shortcode(name);
            break;

        default:
            result = gen_lean_map(name);
            break;

    }

    //pass to clipboard
    copyToClipboard(result);

});

function populate_variables(){

    name = $('#name').val();
    base = slugify($('#base').val());
    
    var elements_len = $('.element');
    elements = [];

    for (let i = 0; i < elements_len.length; i++) {

        let type = $(elements_len[i]).find('select').val();
        let field_name = $(elements_len[i]).find('#new_field_name').val();
        let field_slug = slugify(field_name);
        
        elements.push({type: type, field_name: field_name, field_slug: field_slug});

    }

    ID++;

    let settings = gen_settings(name, base, elements);
    let render = gen_render(name, elements);
    let shortcode = gen_shortcode(name);
    let lean_map = gen_lean_map(name);

}







// main Functions
function gen_settings(name, base, elements){

    let gen_settings = `
   
    /**
    * Element Gen 0`+ID+`
	* Register fields for `+name+`
	*
    * @return array
	*/

	public static function `+slugify(name)+`_element_settings() {

        return [
            "name"     => __( "`+ name +`", `+ base +` ),
            "base"     => self::$vc_prefix . "`+ slugify(name) +`",
            "class"    => "",
            "params"   => [`
                + elements_func(elements, base)+
            `
            ]
        ];

 	}

   `;

   return gen_settings;

}

function gen_render(name, elements){
    
    var loop = 0;
    let gen_render = `
    
    /**
    * Element Gen 0`+ID+` Render Function
    * 
    * 
    * @param array  $atts
    * @param string $content
    *
    * @return false|string
    * 
    */
    public static function render_`+slugify(name)+`_section($atts, $content){
        
        global $post;

        `;


        elements.forEach(element => {

                if(element.type === 'loop-open'){
                    $loop = 1;
                    $loop = element.type === "loop-close" ? 0 : 1;
                }

                switch (element.type) {
                    case "loop-open":
                        gen_render += `$`+ element.field_slug +` = isset($atts['`+ element.field_slug +`']) ? vc_param_group_parse_atts($atts['`+ element.field_slug +`']);`;
                        break;

                    case "exploded_textarea":
                        gen_render += `$`+ element.field_slug +` = isset($atts['`+element.field_slug+`'])   ? explode( PHP_EOL, $atts['`+element.field_slug+`']) : []; `;
                        break;

                    case "vc_link":
                        gen_render += `$`+ element.field_slug +` = isset($atts['`+element.field_slug+`'])   ? vc_build_link($atts['`+element.field_slug+`']) : '';`;
                        break;

                    case "attach_image":
                        gen_render += `$`+ element.field_slug +` = isset($atts['`+element.field_slug+`'])   ? vc_build_link($atts['`+element.field_slug+`']) : '';`;
                        break;
                
                    default:
                        gen_render += `$`+ element.field_slug +` = isset($atts['`+element.field_slug+`'])   ? $atts['`+element.field_slug+`'] : '';`;
                        break;
                }

        });
        
        
        gen_render += `
        ob_start();

    ?>
        <section class="`+slugify(name)+`-section container">
    `;

    elements.forEach(element => {

        if(element.type === 'textfield' || element.type === 'textarea' || element.type === 'colorpicker' || element.type === 'textarea_raw_html'){
            gen_render += `<span class="`+element.field_slug+`"> <?= $atts['`+element.field_slug+`']; ?> </span>`;
        }

        if(element.type === 'loop-open'){
            gen_render += `<div class="`+element.field_slug+`">`;
        }else if(element.type === 'loop-close'){
            gen_render += `</div>`;
        }

    });

    gen_render += `
        </section>
    <?php

        return ob_get_clean();

    }`;

    return gen_render;


}

function gen_shortcode(name){
    
    let gen_shortcode = `add_shortcode(self::$vc_prefix . '`+slugify(name)+`', __CLASS__ . '::render_`+slugify(name)+`_section');`;
    return gen_shortcode;
}

function gen_lean_map(name){

    let get_lm = `vc_lean_map( self::$vc_prefix . '`+ slugify(name) +`', __CLASS__ . '::`+ slugify(name) +`_element_settings' );`;
    return get_lm;

}










// others Functions
async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Text copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy text to clipboard:', error);
    }
}

function elements_func(elements, base){

    let return_elements = '';
    
    for (let position = 0; position < elements.length; position++) {

        let WYSIWYG = 0;
        
        let type = elements[position].type;
        let name = elements[position].field_name;
        let slug = elements[position].field_slug;

        switch (type) {
            case 'loop-open':
                return_elements += `
                [
                    "type" => "loop",
                    "heading" => __( "`+name+`", "`+base+`" ),
                    "param_name" => "`+slug+`",
                    "params" => [`;
                break;

            case 'loop-close':
                return_elements += `
                    ]
                ],`
                break;

            case 'textarea_html':
                if(WYSIWYG === 0){
                    WYSIWYG = 1;
                    return_elements += `
                        [
                            "type" => "`+type+`",
                            "heading" => __( "`+name+`", "`+base+`" ),
                            "param_name" => "content",
                        ],`;
                }
                break;

            case 'dropdown':
                return_elements += `
                        [
                            "type" => "`+type+`",
                            "heading" => __( "`+name+`", "`+base+`" ),
                            "param_name" => "content",
                            "value" => array(
                                'Option 1' => 'value1',
                                'Option 2' => 'value2',
                                'Option 3' => 'value3',
                            ),
                        ],`;
                break;
        
            default:
                return_elements += `
                        [
                            "type" => "`+type+`",
                            "heading" => __( "`+name+`", "`+base+`" ),
                            "param_name" => "`+slug+`",
                        ],`;
                break;
        }

        
        
    }

    return return_elements;
    
}

function slugify(str) {
    return String(str)
      .normalize('NFKD') // split accented characters into their base characters and diacritical marks
      .replace(/[\u0300-\u036f]/g, '') // remove all the accents, which happen to be all in the \u03xx UNICODE block.
      .trim() // trim leading or trailing whitespace
      .toLowerCase() // convert to lowercase
      .replace(/[^a-z0-9 -]/g, '') // remove non-alphanumeric characters
      .replace(/\s+/g, '-') // replace spaces with hyphens
      .replace(/-+/g, '-'); // remove consecutive hyphens
}

$('#darkmode').click(function(){
    $("body").toggleClass('dark');
});