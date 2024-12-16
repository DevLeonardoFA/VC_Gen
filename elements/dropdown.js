import { Slugfy } from "./../controller/support_functions.js";


export default class dropdown{
    constructor(type, name, base, slug, admin, options) {
        this.type = type;
        this.name = name;
        this.base = base;
        this.slug = slug;
        this.admin = admin;
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
            "type" => "${type}",
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