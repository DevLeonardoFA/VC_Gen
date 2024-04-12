import { Slugfy, GenerateElements } from "./../controller/support_functions.js";


export default class main_functions{
    
    constructor(code_generated, name, base, elements){
        this.code_generated = code_generated;
        this.name = name;
        this.base = base;
        this.elements = elements;
    }

    copy_to_clipboard(){
        CopyToClipboard(this.code_generated);
    }

    gen_settings(type, name, base){
        Gen_Settings(this.name, this.base, this.elements);
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


// others Functions
export async function CopyToClipboard(code_generated) {

    try {

        await navigator.clipboard.writeText(code_generated);

    } catch (error) {

        console.error('Failed to copy text to clipboard:', error);
        
    }

}


// main Functions
export function Gen_Settings(name, base, elements, ID){

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
                "category" => ${base.toUpperCase()}_THEME_NAME,
                "params"   => [
                    ${GenerateElements(elements, base)}
                ]
            ]
        );
        
    }
    `;

}

export function Gen_Render(name, elements){
    
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
                case "textarea_html":
                    return `
                    $${element.type + "_" + element.field_slug} = $content;
                    `;
                default:
                    return `
                    $${element.type + "_" + element.field_slug} = isset($atts['${element.type + "_" + element.field_slug}']) ? $atts['${element.type + "_" + element.field_slug}'] : '';
                    `;
            }
        }).join("")}

        ob_start();
    ?>
        <section class="${Slugfy(name)}-section" data-aos-duration="2000" data-aos="fade-up">
            <div class="container">

                ${elements.map(element => {

                    switch (element.type) {

                        case "param_group_open":
                            return `
                                <div class="${element.type + "_" + element.field_slug}">
                                <?php foreach($${element.type + "_" + element.field_slug} as $loop_item){ ?>
                            `;

                        case "param_group_close":
                            return `
                                <?php } ?>
                            </div>
                            `;

                        case "exploded_textarea":
                            return `
                            <?php if(isset($atts[${element.type + "_" + element.field_slug}])){ ?>
                                <div class="exploded_textarea">

                                    <?php 
                                        foreach($${element.type + "_" + element.field_slug} as $word){
                                            echo '<p>' . $word . '</p>';
                                        }
                                    ?>
                                    
                                </div>
                            <?php } ?>
                            `;

                        case "vc_link":
                            return `
                            <?php if( isset($atts['${type}_${slug}']) ){ ?>
                                <a data-aos-duration="2000" data-aos="fade-up" href="<?= $${element.type + "_" + element.field_slug}['url']; ?>" target="<?= $${element.type + "_" + element.field_slug}['target']; ?>" class="purple-button">
                                    <?= $${element.type + "_" + element.field_slug}['title']; ?>
                                </a>
                            <?php } ?>
                            `;

                        case "attach_image":

                            return `
                            <?php if( isset($atts['${element.type + "_" + element.field_slug}']) ){ 
                                $alt = get_post_meta($atts['${element.type + "_" + element.field_slug}'], '_wp_attachment_image_alt', TRUE); ?>
                                <img src="<?= $${element.type + "_" + element.field_slug} ?>" alt="<?= $alt; ?>" title="<?= $alt; ?>"></img>
                            <?php } ?>
                            `;

                        case "attach_images":
                            return `
                            
                            <?php 
                            
                                if( isset($atts['${type}_${slug}']) ){
                                    $imgs = explode(',', $atts['${element.type + "_" + element.field_slug}']);
                                        
                                    foreach($imgs as $img){ 

                                        $alt = get_post_meta($atts['${type}_${slug}'], '_wp_attachment_image_alt', TRUE);
                                        $url = wp_get_attachment_image_url( $img, 'full' ); ?>
                                        
                                        <img src="<?= $url; ?>" alt="<?= $alt; ?>" title="<?= $alt; ?>" />

                                    <?php
                                    }

                                }
                                
                            ?>
                            
                            `;

                        case "loop":
                            return `

                            <?php if(isset($atts[${element.type + "_" + element.field_slug}])){ ?>

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

                            <?php } ?>

                            `;

                        case "textarea_html":
                            return `
                            <?php if($content){ ?>
                                <span class="${element.type + "_" + element.field_slug}">
                                    <?= $content; ?>
                                </span>
                            <?php } ?>
                            `;
                        
                        default:
                            return `
                            <?php if(isset($atts[${element.type + "_" + element.field_slug}])){ ?>
                                <span class="${element.type + "_" + element.field_slug}">
                                    <?= $atts['${element.type + "_" + element.field_slug}']; ?>
                                </span>
                            <?php } ?>
                            `;

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