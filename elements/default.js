import { Slugfy } from "./../controller/support_functions.js";


export default class textarea {
    constructor(type, name, base, admin, slug) {
        this.type = type;
        this.name = name;
        this.base = base;
        this.slug = slug;
        this.admin = admin;
    }

    gen_settings(type, name, base, admin) {
        return gen_settings(type, name, base, admin);
    }

    gen_render(type, slug) {
        return gen_render(type, slug);
    }

}

export function gen_settings(type, name, base, admin) {
    const adminLabel = admin ? `"admin_label" => "true",` : ``;
    return `
        [
            "type" => "${type}",
            ${adminLabel}
            "heading" => __( "${name}", ${base.toUpperCase()}_THEME_SLUG ),
            "param_name" => "${Slugfy(name)}",
        ],
    `;
}

export function gen_render(type, slug) {
    return `
        <?php 
        
        if(isset($atts[${type}_${slug}]) && !empty($atts[${type}_${slug}])){ ?>

            <span class="${type}_${slug}">
                <?= $atts['${type}_${slug}']; ?>
            </span>

        <?php } ?>
    `;
}