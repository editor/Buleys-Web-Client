<?php
// Loop through each file
$contents = '';
foreach (glob("./../core/development/*.dev.js") as $filename) {
	$filename = str_replace("./../core/development/","",$filename);
	if($filename != "loader.js") {
		// Include file so we can grab hooks
		shell_exec("java -jar compiler.jar --js=./../core/development/" . $filename . " --js_output_file=./../core/" . str_replace(".dev","",$filename));
	}
}
?>