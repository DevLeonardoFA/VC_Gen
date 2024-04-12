import { Slugfy } from "./../controller/support_functions.js";


export default class textarea{
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

        <?php if(isset($atts[${type}_${slug}])){ ?>

            <div class="${type}_${slug}">
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
}