import { Slugfy } from "./../controller/support_functions.js";


export default class textarea_html {
    constructor(type, name, base, slug, admin) {
        this.type = type;
        this.name = name;
        this.base = base;
        this.admin = admin;
        this.slug = slug;
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
            "param_name" => "content",
        ],
    `;
}

export function gen_render(type, slug) {
    return `
        <?php 
        
        
       if (isset($content) && !empty($content)) { ?>
        
            <div class="">
                <?= $content; ?>
            </div>
 
        <?php } ?>
    `;
}