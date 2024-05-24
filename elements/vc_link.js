


export default class vc_link{
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
        
        $${type}_${slug} = isset($atts['${type}_${slug}']) ? vc_build_link($atts['${type}_${slug}']) : '';
                 
        if( isset($atts['${type}_${slug}']) ){ ?>

            <a data-aos-duration="2000" data-aos="fade-up" href="<?= $${type}_${slug}['url']; ?>" target="<?= $${type}_${slug}['target']; ?>" class="button">
                <?= $${type}_${slug}['title']; ?>
            </a>

        <?php } ?>
    `;
}