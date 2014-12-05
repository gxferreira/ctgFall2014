<?php
	ini_set('display_errors',1);
	error_reporting(E_ALL);
	$q = $_GET["q"];

	$json = "http://api.data.gov/usda/ndb/search/?format=json&q=".$q."&max=25&offset=0&api_key=vkPhid8P7v73RKGZHuMoE3exRVM2lnkPPY8tqTqL";
	$jsonfile = file_get_contents($json);

	print_r($jsonfile);
?>