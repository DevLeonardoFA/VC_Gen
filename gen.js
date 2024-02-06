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

    if (!name || !elements || !base){
        $('body').toggleClass('popup_on error');
        setTimeout(() => {
            $('body').toggleClass('popup_on error');
        }, 1000);
        return
    }

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
            result = gen_action(name);
            break;

    }

    //pass to clipboard
    copyToClipboard(result);

    $('body').toggleClass('popup_on ok');
    setTimeout(() => {
        $('body').toggleClass('popup_on ok');
    }, 1000);

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

            let options = $(elements_len[i]).find('.new_option > input');
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
    let action_map = gen_action(name);

}



// main Functions
function gen_settings(name, base, elements){

    return `
    /**
    * Element Gen 0${ID}
	* Register fields for ${name}
	*
    * @return array
	*/
    public static function ${slugify(name)}_element_settings() {

        vc_map(
            [
                "name"     => __( "${name}", ${base.toUpperCase()}_THEME_SLUG ),
                "base"     => self::$vc_prefix . "${slugify(name)}",
                "class"    => "",
                "category" => ${base.toUpperCase()}_THEME_NAME,
                "params"   => [
                    ${generateElements(elements, base)}
                ]
            ]
        );
        
    }
    `;

}

function gen_render(name, elements){
    
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
    public static function render_${slugify(name)}_section($atts, $content){
    
        global $post;

        ${elements.map(element => {
            switch (element.type) {
                case "param_group_open":
                    return `
                    $${element.type + "_" + element.field_slug} = isset($atts['${element.type + "_" + element.field_slug}']) ? vc_param_group_parse_atts($atts['${element.type + "_" + element.field_slug}']) : []; 
                    `;
                case "param_group_close":
                    return ``;
                case "exploded_textarea":
                    return `
                    $${element.type + "_" + element.field_slug} = isset($atts['${element.type + "_" + element.field_slug}']) ? explode( " ", $atts['${element.type + "_" + element.field_slug}']) : [];
                    `;
                case "vc_link":
                    return `
                    $${element.type + "_" + element.field_slug} = isset($atts['${element.type + "_" + element.field_slug}']) ? vc_build_link($atts['${element.type + "_" + element.field_slug}']) : '';
                    `;
                case "attach_image":
                    return `
                    $${element.type + "_" + element.field_slug} = isset($atts['${element.type + "_" + element.field_slug}']) ? wp_get_attachment_url( $atts['${element.type + "_" + element.field_slug}'], 'full' ) : '';
                    `;
                case "attach_images":
                    return `
                    $${element.type + "_" + element.field_slug} = isset($atts['${element.type + "_" + element.field_slug}']) ? wp_get_attachment_image( $atts['${element.type + "_" + element.field_slug}'], 'full' ) : '';
                    `;
                default:
                    return `
                    $${element.type + "_" + element.field_slug} = isset($atts['${element.type + "_" + element.field_slug}']) ? $atts['${element.type + "_" + element.field_slug}'] : '';
                    `;
            }
        }).join("")}

        ob_start();
    ?>
        <section class="${slugify(name)}-section container">

            ${elements.map(element => {

                switch (element.type) {

                    case "param_group_open":
                        return `
                        <div class="${element.type + "_" + element.field_slug}" data-aos-duration="2000" data-aos="fade-up">
                            <?php foreach($${element.type + "_" + element.field_slug} as $loop_item){ ?>
                        `;

                    case "param_group_close":
                        return `
                            <?php } ?>
                        </div>
                        `;

                    case "exploded_textarea":
                        return `
                        <div class="exploded_textarea">

                            <?php 
                                foreach($${element.type + "_" + element.field_slug} as $word){
                                    echo '<p>' . $word . '</p>';
                                }
                            ?>
                            
                        </div>
                        `;

                    case "vc_link":
                        return `
                        <a data-aos-duration="2000" data-aos="fade-up" href="<?= $${element.type + "_" + element.field_slug}['url']; ?>" target="<?= $${element.type + "_" + element.field_slug}['target']; ?>" class="purple-button">
                            <?= $${element.type + "_" + element.field_slug}['title']; ?>
                        </a>
                        `;

                    case "attach_image":
                        return `
                        <img src="<?= $${element.type + "_" + element.field_slug} ?>" alt="IMG"></img>
                        `;

                    case "attach_images":
                        return `
                        
                        <?php 

                            $imgs = explode(',', $atts['${element.type + "_" + element.field_slug}']);
                            foreach($imgs as $img){ 
                                echo wp_get_attachment_image( $img, 'full' );
                            }
                            
                        ?>
                        
                        `;

                    case "loop":
                        return `
                        <div class="${element.type + "_" + element.field_slug}">
                        
                            <?php
                            
                                $query = new WP_Query($loop);

                                if ($query->have_posts()) {
                                    while ($query->have_posts()) {
                                        $query->the_post();
                                    }
                                }

                                wp_reset_postdata();

                            ?>
                        
                        </div>
                        `;

                    case "textarea_html":
                        return `
                        <span class="${element.type + "_" + element.field_slug}">
                            <?= $content; ?>
                        </span>
                        `;
                    default:
                        return `
                        <span class="${element.type + "_" + element.field_slug}">
                            <?= $atts['${element.type + "_" + element.field_slug}']; ?> or <?= $${element.type + "_" + element.field_slug} ?>
                        </span>
                        `;

                }
            }).join("")}

        </section>
    <?php

    return ob_get_clean();

    }
    `;


}

function gen_shortcode(name){
    
    return `add_shortcode(self::$vc_prefix . '${slugify(name)}', __CLASS__ . '::render_${slugify(name)}_section');`;

}

function gen_action(name){

    return `add_action( 'vc_before_init', __CLASS__ . '::${slugify(name)}_element_settings' );`;

}










// others Functions
async function copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error('Failed to copy text to clipboard:', error);
    }
}


function generateElements(elements, base) {
    let returnElements = '';
    let wysiwyg = 0;

    for (let position = 0; position < elements.length; position++) {
        

        let { type, field_name: name, field_slug: slug, field_options: options } = elements[position];

        switch (type) {
            case 'param_group_open':
                returnElements += `
                [
                    "type" => "param_group",
                    "heading" => __( "${name}", ${base.toUpperCase()}_THEME_SLUG ),
                    "param_name" => "${slug}",
                    "params" => [`;
                break;

            case 'param_group_close':
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
                            "heading" => __( "${name}", ${base.toUpperCase()}_THEME_SLUG ),
                            "param_name" => "content",
                        ],`;
                }
                break;

            case 'attach_images':
                returnElements += `
                    [
                        "type" => "${type}",
                        "heading" => __( "${name}", ${base.toUpperCase()}_THEME_SLUG ),
                        "param_name" => "${type + '_' + slugify(name)}",
                    ],`;
                break;

            case 'dropdown':
            case 'checkbox':
                returnElements += `
                        [
                            "type" => "${type}",
                            "heading" => __( "${name}", ${base.toUpperCase()}_THEME_SLUG ),
                            "param_name" => "${type + '_' + slugify(name)}",
                            "value" => [${options.map(option => ` \ '${slugify(option)}' => '${option}'`).join(',')}]
                        ],`;
                break;

            default:
                returnElements += `
                        [
                            "type" => "${type}",
                            "heading" => __( "${name}", ${base.toUpperCase()}_THEME_SLUG ),
                            "param_name" => "${type + '_' + slugify(name)}",
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
      .replace(/\s+/g, '_') // replace spaces with hyphens
      .replace(/-+/g, '_'); // remove consecutive hyphens
}

$('#darkmode').click(function(){
    $("body").toggleClass('dark');
});