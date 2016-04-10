 
function view_data_initialize( data )
{
	
	build_table(data);	

}

function build_table( data )
{
	console.log(data);
	
	//new table for each form
	for( var i = 0; i < data.length; i++ ){

		var table_string = "<table id='" + data[i].id + "' class='table table-striped table-bordered table-hover'><thead><tr><td>Project</td><td>Site</td><td>Form</td>";
	
		var fields = data[i].fields;
		
		for( var j = 0; j < fields.length; j++ )
		{
			table_string = table_string + "<td>" + fields[j].label  + "</td>";
			if( j == ( fields.length - 1 ) )
			{
				console.log('table header end');
				table_string = table_string + "<td>Submission Date</td></tr></thead>";
			}
		}

		for( var k = 0; k < data[i].data.length; k++ )
		{
			console.log('adding a col');
			table_string = table_string + "<tr>";
			var cols = data[i].data[k];
			table_string = table_string + "<td>" + cols[0].project_name + "</td><td>" + cols[0].site_name + "</td><td>" + cols[0].form_name + "</td>";	
			for( var m = 0; m < cols.length; m++ )
			{
				table_string = table_string + "<td>" + cols[m].value + "</td>";
			}
			table_string = table_string + "<td>" + cols[0].created_at + "<td></tr>";
		}

		table_string = table_string + "</table>";	
		$('#table_container').append(table_string);
	}

}



