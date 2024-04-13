import { Slugfy } from "./../controller/support_functions.js";


export default class textarea_html{
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

    console.log(base);
    console.log(base.toUpperCase());

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
        
        $${type}_${slug} = $content;
        
        if( isset($content) ){  ?>
        
            <div class="main_text">
                <?= $content; ?>
            </div>
 
        <?php } ?>
    `;
}