import { Slugfy } from "./../controller/support_functions.js";


export default class attach_images{
    constructor(type, name, base, slug) {
        this.type = type;
        this.name = name;
        this.base = base;
        this.slug = slug;
    }

    gen_settings(type, name, base){
        return gen_settings(type, name, base);
    }

    gen_render(){
        return gen_render(this.type, this.slug);
    }

}

export function gen_settings(type, name, base){
    return `
        [
            "type" => "${type}",
            "heading" => __( "${name}", ${base.toUpperCase()}_THEME_SLUG ),
            "param_name" => "${type + '_' + Slugfy(name)}",
        ],
    `;
}

export function gen_render(type, slug){
    return `
        <?php if( isset($atts['${type}_${slug}']) ){
            $imgs = explode(',', $atts['${type}_${slug}']); ?>
                    
            <?php foreach($imgs as $img){ 
                $alt = get_post_meta($atts['${type}_${slug}'], '_wp_attachment_image_alt', TRUE);
                $url = wp_get_attachment_image_url( $img, 'full' ); ?>
                    
                    <img src="<?= $url; ?>" alt="<?= $alt; ?>" title="<?= $alt; ?>" />

            <?php } ?>

        <?php } ?>
    `;
}