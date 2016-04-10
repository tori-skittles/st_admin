var projects_indexed = [];

function projects_initialize()
{
	console.log('hey');

	$('.page_content_wrapper').html('<div id="" class="col-lg-12" style="padding-right: 0px; padding-bottom: 20px;"><div class="col-lg-10"></div><div class="col-lg-2" style="padding-right: 0px;"><button id="addNewProject" class="btn btn-primary col-lg-12">Add New Project</button></div></div><div id="projects_container"></div>');
	
	$.ajax({
                type: 'GET',
                url: 'http://sciencetap.us/ionic/getUserProjects.php',
                data: {
                	admin: true,
		},
                dataType: 'json',
                success: function(response){	
			console.log(response.data);	
			projects_indexed = [];
			for( var i = 0; i < response.data.length; i++ )
			{
				projects_indexed[response.data[i].id] = response.data[i];

			}
			displayProjects(response.data);
		}

	});
}

function displayProjects( projects )
{

	var table_string = "<table id='users_table' class='table table-striped table-bordered table-hover'>";
	table_string = table_string + "<thead><tr><td>Project Name</td><td>Description</td><td>Forms</td><td>Sites</td><td>Edit</td></tr></thead><tbody>";

	for( var i = 0; i < projects.length; i++ )
	{
		table_string = table_string + "<tr id='" + projects[i].id + "'><td>" + projects[i].name + "</td><td style='width: 300px;'>" + projects[i].description + "</td><td>";
		
		for( var j = 0; j< projects[i].forms.length; j++ )
		{
			table_string = table_string + projects[i].forms[j].name;
			if( j < projects[i].forms.length )
			{
				table_string = table_string + "<br />";
			}
		}

		table_string = table_string + "</td><td>";

                for( var l = 0; l < projects[i].sites.length; l++ )
		{
			console.log(projects[i].sites[l]);
			table_string = table_string  + projects[i].sites[l].name;
			if( l < projects[i].sites.length )
			{
				table_string = table_string + "<br />";
			}
		}
		table_string = table_string + "</td><td><span class='edit_user' style='text-align: center;'><i class='glyphicon glyphicon-pencil edit_project'></i></span></td></tr>";

	}

	table_string = table_string + "</tbody></table>";
	$('#projects_container').html(table_string);

	$('#addNewProject').click( function(){

		$('#add_project_name').val('');
                $('#add_project_description').val('');

		$('#addProjectModal').modal();
			
		$('#saveAddProject').click( function(){
			var project = {
                                name: $('#add_project_name').val(),
                                description: $('#add_project_description').val(),
                                users: [],
                                forms: [],
				sites: [] 
                        }

                        $.ajax({
                                type: 'POST',
                                url: 'http://sciencetap.us/ionic/createProject.php',
                                data: {
                                	project: project
				},
                                dataType: 'json',
                                success: function(response){    
                                        $('#addProjectModal').modal('hide');      
                                	projects_initialize();
				}

                        });
		});
	});

	$('.edit_project').click( function( e ){
		
		var tr = $(e.target).parents('tr');
		var project_uid = $(tr).attr('id');
		var project = projects_indexed[project_uid];

		$('#add_project_name').val(project.name);
		$('#add_project_description').val(project.description);
		
		$('#addProjectModal').modal();

		$('#saveAddProject').off().click( function(){

			var project = {
				id: project_uid,
				name: $('#add_project_name').val(),
				description: $('#add_project_description').val()
			}

			$.ajax({
				type: 'POST',
				url: 'http://sciencetap.us/ionic/editProject.php',
				data: {
					project: project
				},
				dataType: 'json',
				success: function(response){    
					$('#addProjectModal').modal('hide');		
					projects_initialize();
				}
        
			});
		});	

	});
}

