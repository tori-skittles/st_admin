var users_indexed = [];

function users_initialize()
{
	$('.page_content_wrapper').html('<div id="" class="col-lg-12" style="padding-right: 0px; padding-bottom: 20px;"><div class="col-lg-10"></div><div class="col-lg-2" style="padding-right: 0px;"><button id="addNewUser" class="btn btn-primary col-lg-12">Add New User</button></div></div><div id="users_container"></div>');
	
	$.ajax({
                type: 'GET',
                url: 'http://sciencetap.us/ionic/getUsers.php',
                data: {
                },
                dataType: 'json',
                success: function(response){	
			console.log(response.data);	
			users_indexed = [];
			for( var i = 0; i < response.data.length; i++ )
			{
				users_indexed[response.data[i].id] = response.data[i];

			}
			displayUsers(response.data);
		}

	});
}


function displayUsers( users )
{

	var table_string = "<table id='users_table' class='table table-striped table-bordered table-hover'>";
	table_string = table_string + "<thead><tr><td>First Name</td><td>Last Name</td><td>Email</td><td>isAdmin?</td><td>Edit</td></tr></thead><tbody>";

	for( var i = 0; i < users.length; i++ )
	{
		var admin = users[i].super_admin == 1;
		table_string = table_string + "<tr id='" + users[i].id + "'><td>" + users[i].first_name + "</td><td>" + users[i].last_name + "</td><td>" + users[i].email + "</td><td>" + admin + "</td><td><span class='edit_user' style='text-align: center;'><i class='glyphicon glyphicon-pencil edit_user'></i></span></td></tr>";

	}

	table_string = table_string + "</tbody></table>";
	$('#users_container').html(table_string);

	$('#addNewUser').click( function(){
		$('#addUserModal').modal();
			
		$('#saveAddUser').click( function(){
			var user = {
                                first_name: $('#add_user_first').val(),
                                last_name: $('#add_user_last').val(),
                                email: $('#add_user_email').val(),
                                password: $('#add_user_email').val(),
				admin: $('#add_user_admin').prop('checked')
                        }

                        $.ajax({
                                type: 'POST',
                                url: 'http://sciencetap.us/ionic/editAddUser.php',
                                data: {
                                	user: user
				},
                                dataType: 'json',
                                success: function(response){    
                                        $('#addUserModal').modal('hide');      
                 			users_initialize();
		                }

                        });
		});
	});

	$('.edit_user').click( function( e ){
		
		var tr = $(e.target).parents('tr');
		var user_uid = $(tr).attr('id');
		console.log(user_uid);
		console.log(users_indexed);
		var user = users_indexed[user_uid];
		console.log(user);

		$('#edit_user_first').val('');
		$('#edit_user_last').val('');
		$('#edit_user_email').val('');
		$('#edit_user_password').val('');
		

		$('#edit_user_first').val(user.first_name);
                $('#edit_user_last').val(user.last_name);
                $('#edit_user_email').val(user.email);
                $('#edit_user_password').val(user.password);
		if( user.super_admin )
		{
			$('#edit_user_admin').prop('checked', true);
		}else{
			$('#edit_user_admin').prop('checked', false);
		}
		$('#editUserModal').modal();

		$('#saveEditUser').off().click( function(){

			var user = {
				id: user_uid,
				first_name: $('#edit_user_first').val(),
				last_name: $('#edit_user_last').val(),
				email: $('#edit_user_email').val(),
				password: $('#edit_user_password').val(),
				admin: $('#edit_user_admin').prop('checked')
			}

			$.ajax({
				type: 'POST',
				url: 'http://sciencetap.us/ionic/editAddUser.php',
				data: {
					user: user
				},
				dataType: 'json',
				success: function(response){    
					$('#editUserModal').modal('hide');		
					users_initialize();
				}
        
			});
		});	

	});
}

