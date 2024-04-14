    let elementsBox = $('#elements_box');
    let add_row = $('#add_row');
    let selects = $('.element select');
    
    let elements_types = Array(
        'textarea_html',
        'textfield',
        'textarea',
        'attach_image',
        'attach_images',
        'posttypes',
        'colorpicker',
        'exploded_textarea',
        'widgetised_sidebars',
        'textarea_raw_html',
        'vc_link',
        'checkbox',
        'dropdown',
        'loop',
        'param_group_open',
        'param_group_close',
    );
    
    let obj = create_obj(elements_types);


    // done and working very well

    $('#add_row').on('click', function(e) {

        e.preventDefault();
    
        // Append the new div to the elements box
        $('#elements_box').append(obj);

    });

    $('#remove').on('click', function(e) {

        e.preventDefault();

        var element = $('#elements_box > .element');
        
        if(element.length > 1){
            $(element).last().remove();
        }
        
    });

    $('body').on('change', '.select_type', function() {

        if( $(this).val() === "dropdown" || $(this).val() === "checkbox" ){
    
            var father = $(this).parent();
            var opt = create_option(true, "Option");

            if($(father).find('.new_option')){
                $(father).find('.new_option').remove();
            }
            
            // Append the new option
            $(father).append(opt);
            
        }

        else{
            
            $(this).parent().find('.new_option').remove();

        }

    });

    $('body').on('click', '#add_option', (e) => {

        var father = $(e.target).closest('.element');
        var opt = create_option(true, 'Option');
        
        // Append the new option
        $(father).append(opt);

    });

    $('body').on('click', '#remove_option', (e) => {

        var target = $(e.target).closest('.element').find('.new_option');
        if( target.length === 1 ){
            return;
        }
        $(e.target).closest('.new_option').remove();

    });



    //create obj
    function create_obj(elements){

        let optionsHTML = '';

        for (let index = 0; index < elements.length; index++) {
            optionsHTML += `<option value="${elements[index]}">${elements[index]}</option>`;
        }

        return `<div class="element">
        
            <div class="sortbox">
                <span class="move">
                    move
                </span>
            </div>
            <select name="type" class="select_type" id="type" >
                ${optionsHTML}
            </select>
            <input type="text" name="new_field_name" id="new_field_name" placeholder="Field Name">
        </div>`;

    }

    function create_option(buttons, placeholder){

        var buttons_html = '';

        if(buttons){

            buttons_html = `<div id="btns">
                <span id="add_option">+</span>
                <span id="remove_option">-</span>
            </div>`;

        }

        return `<div class="new_option buttons_${JSON.stringify(buttons)}">
            <input type="text" name="option" id="option" placeholder="${placeholder}"/>
            ${buttons_html}
        </div>`;

    }