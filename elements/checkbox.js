import { Slugfy } from "./../controller/support_functions.js";


export default class checkbox{
    constructor(type, name, base, admin, slug, options) {
        this.type = type;
        this.name = name;
        this.base = base;
        this.admin = admin;
        this.slug = slug;
        this.options = options;
    }

    gen_settings(type, name, base, admin, options){
        return gen_settings(type, name, base, admin, options);
    }

    gen_render(type, slug){
        return gen_render(type, slug);
    }

}

export function gen_settings(type, name, base, admin, options){
    const adminLabel = admin ? `"admin_label" => "true",` : ``;
    return `
        [
            "type" => "${type}"",
                ${adminLabel}
                "heading" => __( "${name}", ${base.toUpperCase()}_THEME_SLUG ),
            "param_name" => "${Slugfy(name)}",
            "value" => [${options.map(option => ` \ '${Slugfy(option)}' => '${option}'`).join(',')}]
        ],
    `;
}

export function gen_render(type, slug){
    return `
        <?php 
            $${type}_${slug} = isset($atts['${type}_${slug}']) ? $atts['${type}_${slug}'] : '';
        ?>
    `;
}