import { Slugfy } from "./../controller/support_functions.js";


export default class param_group{
    constructor(type, name, base, admin, slug, status) {
        this.type = type;
        this.name = name;
        this.base = base;
        this.slug = slug;
        this.admin = admin;
        this.status = status;
    }

    gen_settings(type, name, base, admin,  status){
        return gen_settings(type, name, base, admin, status);
    }

    gen_render(type, slug, status){
        return gen_render(type, slug, status);
    }

}

export function gen_settings(type, name, base, admin, status){

   
    var to_return = ``;

    if(status === "open"){
        const adminLabel = admin ? `"admin_label" => "true",` : ``;
        to_return = `
            [
                "type" => "${type}",
                ${adminLabel}
                "heading" => __( "${name}", ${base.toUpperCase()}_THEME_SLUG ),
                "param_name" => "${Slugfy(name)}",
                "params" => [
        `;
    }else{
        to_return = `
                ]
            ],
        `;
    }  

    return to_return;
}

export function gen_render(type, slug, status){

    var to_return = ``;

    if(status === "open"){
        to_return = `
            <?php
                $${type}_${slug} = isset($atts['${type}_${slug}']) ? vc_param_group_parse_atts($atts['${type}_${slug}']) : [];
            ?>
            <div class="${type}_${slug}">
                <?php foreach($${type}_${slug} as $loop_item){ ?>
        `;
    }else{
        to_return = `
                <?php } ?>
            </div>
        `;
    }   
}