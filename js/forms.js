var forms_indexed = [];

function forms_initialize()
{

	$('.page_content_wrapper').html('<div id="" class="col-lg-12" style="padding-right: 0px; padding-bottom: 20px;"><div class="col-lg-10"></div><div class="col-lg-2" style="padding-right: 0px;"><button id="addNewForm" class="btn btn-primary col-lg-12">Add New Form</button></div></div><div id="forms_container"></div>');
	
	$.ajax({
                type: 'GET',
                url: 'http://sciencetap.us/ionic/getForms.php',
                data: {
                	admin: true,
		},
                dataType: 'json',
                success: function(response){	
			console.log(response.data);	
			forms_indexed = [];
			for( var i = 0; i < response.data.length; i++ )
			{
				forms_indexed[response.data[i].id] = response.data[i];

			}
			displayForms(response.data);
		}

	});
}


function displayForms( forms )
{

	var table_string = "<table id='users_table' class='table table-striped table-bordered table-hover'>";
	table_string = table_string + "<thead><tr><td>Form Name</td><td>Description</td><td>Created At</td><td>Edit</td></tr></thead><tbody>";

	for( var i = 0; i < forms.length; i++ )
	{
		table_string = table_string + "<tr id='" + forms[i].id + "'><td>" + forms[i].name + "</td><td style='width: 300px;'>" + forms[i].description + "</td><td>"+ forms[i].created_at;
		
		table_string = table_string + "</td><td><span class='edit_form' style='text-align: center;'><i class='glyphicon glyphicon-pencil edit_form'></i></span></td></tr>";

	}

	table_string = table_string + "</tbody></table>";
	$('#forms_container').html(table_string);

	$('#addNewForm').click( function(){
		$('#addFormModal').modal();
			
		$('#saveAddForm').click( function(){
			var user = {
                                first_name: $('#add_user_first').val(),
                                last_name: $('#add_user_last').val(),
                                email: $('#add_user_email').val(),
                                password: $('#add_user_email').val(),
				admin: $('#add_user_admin').prop('checked')
                        }

                        $.ajax({
                                type: 'POST',
                                url: 'http://sciencetap.us/ionic/editAddForm.php',
                                data: {
                                	user: user
				},
                                dataType: 'json',
                                success: function(response){    
                                        $('#addFormModal').modal('hide');      
                                }

                        });
		});
	});

	$('#addNewForm').off().click( function( e ){
		
		$('#form_name').val('');



	});


	$('.edit_form').off().click( function( e ){
		
		var tr = $(e.target).parents('tr');
		var form_uid = $(tr).attr('id');
		var form = forms_indexed[form_uid];
		$('#form_name').val(form.name);
		$('#form_description').val(form.description);

		var types = [
				{
					'name': 'Dropdown',
					'val': 'select'
				},{       
                                        'name': 'Number',
                                        'val': 'number'
                                },{       
                                        'name': 'Text',
                                        'val': 'text'
                                },{       
                                        'name': 'Checklist',
                                        'val': 'radio'
                                },{       
                                        'name': 'Range',
                                        'val': 'range'
                                }
			];

			var fields_to_rm = [];
			var fields_to_add = [];


		 	$.ajax({
                                type: 'GET',
                                url: 'http://sciencetap.us/ionic/getFormById.php',
                                data: {
                                        form_uid: form_uid
                                },
                                dataType: 'json',
                                success: function(response){    

					var forms = '';
                                	form = response.data;
					for( var i = 0; i < form.fields.length; i++ )
					{
						var field = form.fields[i];
						forms = forms + "<div class='col-lg-12 field_container' data-field_uid="+field.id+" style='padding-bottom: 5px;'>";
						forms = forms + "<div class='col-lg-5'><input type='text' class='col-lg-12' value='" + field.value + "'></div>";
						forms = forms + "<div class='col-lg-5'>";
						forms = forms + "<select id=" + field.id + " class='form-control col-lg-12' >";
						for( var j = 0; j < types.length; j++ )
						{
							forms = forms + "<option value=" + types[j].val;
							if( field.type == types[j].val )
							{
								forms = forms + " selected ";
							}
							forms = forms + ">" + types[j].name  + "</option>";
									
						}
						forms = forms + "</select>";
						forms = forms + "</div>";
						forms = forms + "<div class='col-lg-1'><button id=" + field.id + " class='btn btn-danger removefield'><span class='glyphicon glyphicon-trash'></span></div>";
						if( field.type == 'select' || field.type == 'list' || field.type == 'radio' )
                                                {
                                                        forms = forms + "<div class='col-lg-1'><button class='btn btn-success addOption'><span class='glyphicon glyphicon-plus'></span></button></div>";
                                                } else {
                                                        forms = forms + "<div class='col-lg-1'></div>";
                                                }
						forms = forms + "</div>";
						console.log(form.fields[i]);
						forms = forms + "<div class='col-lg-12 field_options' style='padding-right: 0px; padding-left: 0px; padding-bottom: 5px;'>";
						for( var j = 0; j < form.fields[i].options.length; j++ )
						{
							forms = forms + "<div class='col-lg-12 "+ field.id +"_field_option' style='padding-bottom: 5px;'>";
							forms = forms + "<div class='col-lg-5'></div>";
							forms = forms + "<div class='col-lg-5'><input type='text' class='form-control options_" + field.id  + "' value='" + form.fields[i].options[j].value  + "' /></div>";	
							forms = forms + "<div class='col-lg-1'><button id=" + field.id + " class='btn btn-danger rmOption'><span class='glyphicon glyphicon-trash'></span></div>";
							forms = forms + "<div class='col-lg-1'></div>";
							forms = forms + "</div>";
						}
						forms = forms + "</div></div>";
					}
					$('#form_content').html(forms);
					

					$('#addField').off().click( function(e){
					
						console.log(e);	
						var field = {
							name: $('#add_field_name').val(),
							type: $('#add_field_type').val()
						}			
						var id = 'random_' + Math.random(); 				
						var forms = "<div class='col-lg-12 field_container' data-field_uid="+id+" style='padding-bottom: 5px; padding-left: 0px;'><div class='col-lg-5'><input type='text' class='col-lg-12' value='";
						forms = forms + field.name + "'></div><div class='col-lg-5'><select class='form-control col-lg-12'>";
						for( var j = 0; j < types.length; j++ )
                                                {
                                                        forms = forms + "<option value=" + types[j].val;
                                                        if( field.type == types[j].val ) 
                                                        {
                                                                forms = forms + " selected ";
                                                        }       
                                                        forms = forms + ">" + types[j].name  + "</option>";
                                                                        
                                                }
						forms = forms + "</select>";
                                                forms = forms + "</div>";
                                                forms = forms + "<div class='col-lg-1'><button id=" + field.id + " class='btn btn-danger removefield'><span class='glyphicon glyphicon-trash removefield'></span></button></div>";
						if( field.type == 'select' || field.type == 'list' || field.type == 'radio' )
						{
							forms = forms + "<div class='col-lg-1'><button class='btn btn-success addOption'><span class='glyphicon glyphicon-plus'></span></button></div>";
						} else {
							forms = forms + "<div class='col-lg-1'></div>";
						}
                                                forms = forms + "<div class='col-lg-12 field_options' style='padding-bottom: 5px; padding-left: 0px;'></div></div>";

						$('#form_content').append(forms);  
					
						$('#add_field_name').val('');
						$('#add_field_type').val('');
						
						keyUpRmField(field);
						keyUpAddOption(field);
						keyUpRmOption(field);
					});

					keyUpRmField(field);
					keyUpAddOption(field);
					keyUpRmOption(field);
				}
        
                });

		$('#editFormModal').modal();
		$('#saveAsNew').off().click( function(){
	
			var form = {
				form_uid: null,
				name: $('#form_name').val(),
				description: $('#form_description').val(),
				fields: []
			};

			var fields = $('.field_container');
			for( var i = 0; i < fields.length; i++ )
			{
				var field = {
					id: $(fields[i]).data('field_uid'),
					name: $(fields[i]).find('input').val(),
					type: $(fields[i]).find('select').val(),
					options: []	
				}
				
				var options = $('.options_' + field.id);
				for( var j = 0; j < options.length; j++ )
				{
					field.options.push( $(options[j]).val() );
				}
				var id = String( field.id );
				if( id.indexOf('random') != -1 )
				{
					field.id = null;
				} 
				form.fields.push(field);
			
			}
			
			$.ajax({
                                type: 'POST',
                                url: 'http://sciencetap.us/ionic/editAddForm.php',
                                data: {
                                        form: form
                                },
                                dataType: 'json',
                                success: function(response){
                                        $('#editFormModal').modal('hide');
                                	displayForms();
				}

                        });		
	
		});

		$('#saveAsUpdate').off().click( function(){

                        var form = {
                                form_uid: form_uid,
                                name: $('#form_name').val(),
                                description: $('#form_description').val(),
                                fields: []
                        };

                        var fields = $('.field_container');
                        for( var i = 0; i < fields.length; i++ )
                        {
                                var field = {
                                        id: $(fields[i]).data('field_uid'),
                                        name: $(fields[i]).find('input').val(),
                                        type: $(fields[i]).find('select').val(),
                                        options: []
                                }

                                var options = $('.options_' + field.id);
                                for( var j = 0; j < options.length; j++ )
                                {
                                        field.options.push( $(options[j]).val() );
                                }
                                var id = String( field.id );
                                if( id.indexOf('random') != -1 )
                                {
                                        field.id = null;
                                }
                                form.fields.push(field);

                        }

                        $.ajax({
                                type: 'POST',
                                url: 'http://sciencetap.us/ionic/editAddForm.php',
                                data: {
                                        form: form
                                },
                                dataType: 'json',
                                success: function(response){
                                        $('#editFormModal').modal('hide');
					displayForms();
                                }

                        });

                });	

	});
}
function keyUpAddOption(field)
{
	$('.addOption').off().click( function(e){
		var field_cont;
		if( $(e.target).is('span') )
		{
			field_cont = $(e.target).parent().parent().parent();
		}else{
			field_cont = $(e.target).parent().parent();
		}

		console.log(field_cont);
		var id = $(field_cont).data('field_uid');
		var forms = '';
		forms = forms + "<div class='col-lg-12 "+id+"_field_option' style='padding-bottom: 5px;'>";
		forms = forms + "<div class='col-lg-5'></div>";
		forms = forms + "<div class='col-lg-5'><input type='text' class='form-control options_" + id  + "' placeholder='Option Name' /></div>";
		forms = forms + "<div class='col-lg-1'><button id=" + field.id + " class='btn btn-danger rmOption'><span class='glyphicon glyphicon-trash rmOption'></span></div>";
		forms = forms + "<div class='col-lg-1'></div>";
		forms = forms + "</div>";

		$(field_cont).after(forms);

		keyUpRmOption(field);
	});



}
function keyUpRmOption(field)
{
	$('.rmOption').off().click( function(e){
		
		if( $(e.target).is('span') )
		{
			$(e.target).parent().parent().parent().remove();
		}else{
			$(e.target).parent().parent().remove();
		}
	
	});


}

function keyUpRmField(field)
{
	$('.removefield').off().click( function(e){
	
		if( $(e.target).is('span') )
                {
                        $(e.target).parent().parent().parent();
                }else{
                        $(e.target).parent().parent();
                }
	});
}

