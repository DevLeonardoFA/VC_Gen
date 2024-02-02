    let elementsBox = $('#elements_box');
    let add_row = $('#add_row');
    
    let elements_types = Array(
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
    
    let obj = create_obj(elements_types);

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

        var obj = `<div class="element"><select name="type" id="type">`;

        for (let index = 0; index < elements.length; index++) {
            obj += `<option value="${slugify(elements[index])}">${elements[index]}</option>`;
        }
        
        obj += `</select><input type="text" name="new_field_name" id="new_field_name" placeholder="Field Name"></div>`;

        return obj;
    }


    function create_option(){
        var obj_2 = `

        <div class="new_option">
            <input type="text" name="option" id="option">
            <div id="btns">
                <span id="add_option">+</span>
                <span id="remove_option">-</span>
            </div>
        </div>`;

        return obj_2;
    }