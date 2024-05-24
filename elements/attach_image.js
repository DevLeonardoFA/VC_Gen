import { Slugfy } from "./../controller/support_functions.js";

export default class attach_image{
    constructor(type, name, base, slug) {
        this.type = type;
        this.name = name;
        this.base = base;
        this.slug = slug;
    }

    gen_settings(type, name, base){
        return gen_settings(type, name, base);
    }

    gen_render(type, slug){
        return gen_render(type, slug);
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
        <?php 
        
        if($content){
            
            $alt = get_post_meta($atts['${type}_${slug}'], '_wp_attachment_image_alt', TRUE);
            $url = wp_get_attachment_image_url( $atts['${type}_${slug}'], 'full' ); ?>
                
            <img src="<?= $url; ?>" alt="<?= $alt; ?>" title="<?= $alt; ?>" />

        <?php } ?>
        
    `;
}