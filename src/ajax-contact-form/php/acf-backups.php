<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require 'config.php';
require_once 'backups/ajaxContactForm_backuplist.php';

if ($backup_system_active != TRUE) {
    echo "ERROR: Backup system non active";
    return;
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>AjaxContactForm Backup</title>

    <!-- Bootstrap -->
    <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
    
    <!-- {BANNER} -->
    
</head>

<body>
    <div class="container">
        <div class="row">
            <div class="col-md-12">
                <h1>AjaxContactForm Backup System</h1>
            </div>
        </div>
    </div>
    
    <?php if (!isset($_POST['access_token'])): ?>
    <div class="container">
        <div class="row">
            <div class="col-md-4">
                <form class="form" action="acf-backups.php" method="post">
                    <p>&nbsp;</p>
                    <p>&nbsp;</p>
                    <div class="form-group">
                        <label for="access_token">Please, enter your Backup Encrypt Key</label>
                        <input type="password" class="form-control" name="access_token" placeholder="Place here your Backup Encrypt Key">
                    </div>
                    <div class="form-group">
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    
    <?php else: ?>
        
        <div class="container">
            <div class="row">
                <div class="col-md-12">
                    <?php if ($_POST['access_token'] != $backup_encrypt_key): ?>
                        <div class="alert alert-danger">
                            <p><strong>Error!</strong><br>Invalid "Backup Encrypt Key" Code</p>
                        </div>
                    <?php else: ?>   
                         <?php 
                            $backup = new BackupList($_POST['access_token'],$backup_encrypt_iv); 
                            $messages = $backup->getMessages(); ?> 
                         <!--<pre>
                             <?php print_r($messages); ?>
                         </pre>-->
                         
                         <h2>Your messages</h2>
                         <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
                             <?php 
                             $i = 0;
                             foreach ($messages as $key => $message): ?>
                             <div class="panel panel-default">
                                 <div class="panel-heading" role="tab" id="heading<?php echo $key; ?>">
                                    <h4 class="panel-title">
                                        <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse_<?php echo $key; ?>" aria-expanded="true" aria-controls="collapseOne">
                                            <span class="glyphicon glyphicon-user"></span> <?php echo $message->from; ?> | <span class="glyphicon glyphicon-calendar"></span> <?php echo $message->date; ?> | <span class="glyphicon glyphicon-envelope"></span> <?php echo $message->subject; ?>
                                        </a>
                                    </h4>
                                </div>
                                <div id="collapse_<?php echo $key; ?>" class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingOne">
                                    <div class="panel-body">
                                        <?php echo $message->body; ?> 
                                        <?php if ($message->attachments != FALSE): ?> 
                                        <ul>
                                            <?php foreach ($message->attachments as $attachment): ?>
                                            <li>
                                                <!--<img src="" alt="Attachment Image">-->
                                            </li>
                                            <?php endforeach; ?>
                                        </ul>
                                        <?php endif; ?>
                                    </div>
                                </div>
                             </div>
                             <?php endforeach; ?>
                         </div>
                         
                         
                    <?php endif; ?>
                </div>
            </div>
        </div>
 
    <?php endif; ?>

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
</body>

</html>
