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

        let type =          $(elements_len[i]).find('select').val();
        let field_name =    $(elements_len[i]).find('#new_field_name').val();
        let field_slug =    slugify(field_name);
        let field_options = [];
        if(type === 'attach_images' || type === 'checkbox' || type === 'dropdown'){

            let options = $('.new_option > input');
            for (let j = 0; j < options.length; j++) {
                field_options.push($(options[j]).val());
            }

        }
        

        elements.push({type: type, field_name: field_name, field_slug: field_slug, field_options: field_options});

    }

    ID++;

    let settings = gen_settings(name, base, elements);
    let render = gen_render(name, elements);
    let shortcode = gen_shortcode(name);
    let lean_map = gen_lean_map(name);

}



// main Functions
function gen_settings(name, base, elements){

    return `<?php 
    /**
    * Element Gen 0${ID}
	* Register fields for ${name}
	*
    * @return array
	*/
    public static function ${slugify(name)}_element_settings() {

        return [
            "name"     => __( "${name}", ${base} ),
            "base"     => self::$vc_prefix . "${slugify(name)}",
            "class"    => "",
            "params"   => [
                ${generateElements(elements, base)}
            ]
        ];
        
    }`;

}

function gen_render(name, elements){
    
    return `<?php
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
    public static function render_${slugify(name)}_section($atts, $content){
    
        global $post;

        ${elements.map(element => {
            switch (element.type) {
                case "loop-open":
                    return `\$${element.field_slug} = isset($atts['${element.field_slug}']) ? vc_param_group_parse_atts($atts['${element.field_slug}']);`;
                case "exploded_textarea":
                    return `\$${element.field_slug} = isset($atts['${element.field_slug}']) ? explode( PHP_EOL, $atts['${element.field_slug}']) : [];`;
                case "vc_link":
                    return `\$${element.field_slug} = isset($atts['${element.field_slug}']) ? vc_build_link($atts['${element.field_slug}']) : '';`;
                case "attach_image":
                    return `\$${element.field_slug} = isset($atts['${element.field_slug}']) ? get_post_meta($atts['image'], '_wp_attachment_image_alt', TRUE) : '';`;
                case "attach_images":
                    return `\$${element.field_slug} = isset($atts['${element.field_slug}']) ? wp_get_attachment_image( $atts['${element.field_slug}'], 'full' ) : '';`;
                default:
                    return `\$${element.field_slug} = isset($atts['${element.field_slug}']) ? $atts['${element.field_slug}'] : '';`;
            }
        }).join("")}

        ob_start();
    ?>
        <section class="${slugify(name)}-section container">

            ${elements.map(element => {

                `\n`

                switch (element.type) {

                    case "loop-open":
                        return `<div class="${element.field_slug}" data-aos-duration="2000" data-aos="fade-up">
                            <?php foreach($${element.field_slug} as $loop_item){ ?>`;

                    case "loop-close":
                        return `<?php } ?> </div>`;

                    case "exploded_textarea":
                        return `<div class="my-custom-shortcode"> <?= esc_html($${element.field_slug}['exploded_textarea']); ?> </div>`;

                    case "vc_link":
                        return `<a data-aos-duration="2000" data-aos="fade-up" href="<?= $${element.field_slug}['url']; ?>" target="<?= $${element.field_slug}['target']; ?>" class="purple-button">
                            <?= $${element.field_slug}['title']; ?>
                        </a>`;

                    case "attach_image":
                        return `<img src="<?= wp_get_attachment_image_url( $${element.field_slug}, 'full', '', '' ); ?>" alt="<?= $${element.field_slug} ?>"></img>`;

                    default:
                        return `<span class="${element.field_slug}"> <?= $atts['${element.field_slug}']; ?> or <?= $${element.field_slug} ?> </span>`;

                }
            }).join("")}

        </section>
    <?php
        return ob_get_clean();
    }
    ?>`;


}

function gen_shortcode(name){
    
    return `add_shortcode(self::\$vc_prefix . '${slugify(name)}', __CLASS__ . '::render_${slugify(name)}_section');`;

}

function gen_lean_map(name){

    return `vc_lean_map( self::\$vc_prefix . '${slugify(name)}', __CLASS__ . '::${slugify(name)}_element_settings' );`;


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
        let options = elements[position].field_options;

        console.log(options[0]);

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

            case 'attach_images':
                return_elements += `
                    [
                        "type" => "`+type+`",
                        "heading" => __( "`+name+`", "`+base+`" ),
                        "param_name" => "content",
                    ],`;
                break;

            case 'dropdown' || 'checkbox':
                return_elements += `
                        [
                            "type" => "`+type+`",
                            "heading" => __( "`+name+`", "`+base+`" ),
                            "param_name" => "content",
                            "value" => array(
                                ${
                                    options.forEach(option => {
                                        `'${options}' => '${option}'`;
                                    })
                                }
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

function generateElements(elements, base) {
    let returnElements = '';

    for (let position = 0; position < elements.length; position++) {
        let wysiwyg = 0;

        let { type, field_name: name, field_slug: slug, field_options: options } = elements[position];

        switch (type) {
            case 'loop-open':
                returnElements += `
                [
                    "type" => "loop",
                    "heading" => __( "${name}", "${base}" ),
                    "param_name" => "${slug}",
                    "params" => [`;
                break;

            case 'loop-close':
                returnElements += `
                    ]
                ],`;
                break;

            case 'textarea_html':
                if (wysiwyg === 0) {
                    wysiwyg = 1;
                    returnElements += `
                        [
                            "type" => "${type}",
                            "heading" => __( "${name}", "${base}" ),
                            "param_name" => "content",
                        ],`;
                }
                break;

            case 'attach_images':
                returnElements += `
                    [
                        "type" => "${type}",
                        "heading" => __( "${name}", "${base}" ),
                        "param_name" => "content",
                        
                    ],`;
                break;

            case 'dropdown':
            case 'checkbox':
                returnElements += `
                        [
                            "type" => "${type}",
                            "heading" => __( "${name}", "${base}" ),
                            "param_name" => "content",
                            "value" => [${options.map(option => ` \ '${slugify(option)}' => '${option}'`).join(',')}]
                        ],`;
                break;

            default:
                returnElements += `
                        [
                            "type" => "${type}",
                            "heading" => __( "${name}", "${base}" ),
                            "param_name" => "${slug}",
                        ],`;
                break;
        }
    }

    return returnElements;
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