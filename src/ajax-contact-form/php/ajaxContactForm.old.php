<?php

//{BANNER}

include 'config.php';

$attachmentsFilesDir = "attachments/files";

/* ************************************** */
/* Get Input Values */
/* ************************************** */

$name = trim(stripslashes ($_REQUEST['acf_name']));
//$surname = trim(stripslashes ($_REQUEST['acf_surname']));
$name = $name." ".$surname;
$email = trim(stripslashes ($_REQUEST['acf_email']));
//$subject .= trim(stripslashes ($_REQUEST['acf_subject']));
$msg = trim(stripslashes ($_REQUEST['acf_message']));

if($_REQUEST['acf_attachments']) {
	$attachments = true;
	$attachmentsFiles = $_REQUEST['acf_attachments'];
	$attachmentsFiles = explode(',', $attachmentsFiles);
}

/* ************************************** */
/* Mail Separator */
/* ************************************** */
$semi_rand = md5(time());
$mime_boundary = "==Multipart_Boundary_x{$semi_rand}x";

/* ************************************** */
/* Define Global Headers */
/* ************************************** */
$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= "From: " . $email . "\r\n"; // Sender's E-mail
$headers .= "Content-Type: multipart/mixed;\n";
$headers .= " boundary=\"{$mime_boundary}\"";

/* ************************************** */
/* Define Message */
/* ************************************** */
$message = "This is a multi-part message in MIME format.\n\n";
$message .= "--{$mime_boundary}\n";


/* Text Message */
/* ====================== */
$message .= "Content-Type: text/plain; charset=\"iso-8859-1\"\n";
$message .= "Content-Transfer-Encoding: 7bit\n\n";

$message .= "<div style=\"font-family: ".$text_font_family."; font-size:".$text_size."; color:".$text_color.";\">";
if ($messageImage != "") {
    $message .= "<img src=\"".$messageImage."\" alt=\"contact form image\"";
}

$message .= "<h1 style=\"font-size:".$title_size."; color:".$title_color."; margin:10px 0 0 0;\">".$messageTitle."</h1>";
$message .= "<h2 style=\"font-size:".$subtitle_size."; color:".$subtitle_color."; margin:10px 0 0 0;\">".$messageSubTitle."</h2>";
$message .= "<p>Messaggio inviato da: " .$name. "<br>";
$message .= "E-mail per la risposta: " .$email."</p>";
$message .= "<p>".$msg."</p>";
$message .= "<p style=\"font-size:14px; color:#ccc;\"><em>Message sended by BRAINLEAF contactForm&trade;</em></p>";
$message .= "</div>";


/* Attachments */
/* ====================== */
if ($attachments == true) {
	
	//$attachmentsFilesDir
	//$attachmentsFiles
	for ($i=0; $i < count($attachmentsFiles); $i++) {
		
		$filePath = $attachmentsFilesDir.'/'.$attachmentsFiles[$i];
		$file = fopen($filePath,'rb');	
		$data = fread($file, filesize($filePath));
		fclose($file);
		$data = chunk_split(base64_encode($data));
			 
		$message .= "--{$mime_boundary}\n";
		$message .= "Content-Disposition: attachment; filename=\"{$attachmentsFiles[$i]}\"\n";
		$message .= "Content-Transfer-Encoding: base64\n\n";
		$message .= $data . "\n\n";
		if($i == count($attachmentsFiles) -1) {
			$message .= "--{$mime_boundary}--\n";
		}else{
			$message .= "--{$mime_boundary}\n";
		}
	}
}


$ok = mail($to,$subject,$message,$headers);
$resultmsg['result'] = $ok?"success":"fail";
$json = json_encode($resultmsg);
echo $json;

?>