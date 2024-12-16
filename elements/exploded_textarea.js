import { Slugfy } from "./../controller/support_functions.js";

export default class exploded_textarea{
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
            "param_name" => "${Slugfy(name)}",
        ],
    `;
}

export function gen_render(type, slug){
    return `
    <?php 
    
        $${type}_${slug} = isset($atts['${type}_${slug}']) ? explode( " ", $atts['${type}_${slug}']) : [];
                        
        if(isset($atts[${type}_${slug}]) && !empty($atts[${type}_${slug}])){ ?>

            <div class="exploded_textarea">
                <?php foreach($${type}_${slug} as $word){ ?>

                    <p> <?= $word ?></p>

                <?php } ?>
            </div>

        <?php } ?>
        
    `;
}