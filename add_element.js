jQuery(function($){

    let elementsBox = $('#elements_box');
    let add_row = $('#add_row');
    
    let elements = Array(
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
        // 'checkbox',
        // 'dropdown',
        'loop open',
        'loop close',
        'css',
    );
    
    let obj = create_obj(elements);

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
        // Remove the last element
        
    });

    $('select#type').change(function(){
        if( $(this).val() === "dropdown" || $(this).val() === "checkbox" ){

            var father = $(this).parent();
            var opt = create_option();
            
            // Append the new option
            $(father).append(opt);
            
        }
    });

    // $('#add_option').on('click', function(){

    //     console,log('aaaaaaaaaa');

    //     var father = $(this).closest('.element');
    //     var opt = create_option();
        
    //     // Append the new option
    //     $(father).append(opt);

    // });

    // $('#remove_option').on('click', () => { console,log('aaaaaaaaaa'); $(this).closest('.new_option').remove(); });


    //create obj
    function create_obj(elements){

        var obj = "";
        obj += '<div class="element">';
        obj += '<select name="type" id="type">';

        for (let index = 0; index < elements.length; index++) {
            obj += `<option value="${slugify(elements[index])}">${elements[index]}</option>`;
        }
        
        obj += '</select>';
        obj += '<input type="text" name="new_field_name" id="new_field_name" placeholder="Field Name">';
        obj += '</div>';

        return obj;
    }

    function create_option(){
        var obj_2 = "";
        obj_2 =  '<div class="new_option">';
        obj_2 += '<input type="text" name="option" id="option">'
        obj_2 += '<div id="btns">';
        obj_2 += '<span id="add_option">+</span><span id="remove_option">-</span>';
        obj_2 += '</div>';
        obj_2 += '</div>';

        return obj_2;
    }
    
});