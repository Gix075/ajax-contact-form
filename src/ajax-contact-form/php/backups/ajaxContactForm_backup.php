<?php

    //{BANNER}
    
    /**
     * Messages Backup System Class
     * -----------------------------------
     * this class provides a json backup for each message sended using AjaxContactForm
     */
     
    class MessageBackup  {
        
        function __construct($backupDir,$senderName,$senderEmail,$privacy,$messageSubject,$messageBody,$attachmentsFilesDir,$attachmentsFiles) {
            
            $this->backupDir = $backupDir;
            $this->originAttachmentsDir = $attachmentsFilesDir;
            
            // Makes Json file data
            $this->json = new stdClass();
            $this->json->sender = new stdClass();
            $this->json->message = new stdClass();
            $this->json->sender->name = $senderName;
            $this->json->sender->email = $senderEmail;
            $this->json->message->subject = $messageSubject;
            $this->json->message->text = strip_tags($messageBody);
            $this->json->attachments = $attachmentsFiles;
            $this->json->privacy = $privacy;
            $this->json->time = time();
            $this->json->date = date("d/m/Y H:i:s",$this->json->time);
            // Filenames
            $filenames = $this->makeFileNames();
            $this->filename = $filenames->filename;
            $this->directory = $filenames->directory;
            $this->directory_attachments = $filenames->attachments;
            // Save Message
            $saveMessage = $this->saveMessage();
            if ($saveMessage == TRUE) {
                $this->writeLog("Backup Success");
            } else {
                $this->writeLog("Backup Error");
            }
        }

        public function writeLog($message) {
            $log_date = $this->json->date;
            $log_message = $log_date." : ".$this->filename." : ".$message.PHP_EOL;
            file_put_contents("backups/logs/backups_logs.txt", $log_message,FILE_APPEND);
        }
        
        private function saveMessage() {
            $mkDir = $this->makeBackupDirs();
            if($mkDir == TRUE) {
                $json = json_encode($this->json);
                if(!file_put_contents($this->directory."/".$this->filename, $json)) {
                    return FALSE;
                }
                if ($this->json->attachments != FALSE && is_array($this->json->attachments)) {
                    if ($this->saveAttachments() == FALSE) {
                        return FALSE;
                    }
                }
                return TRUE;
            }else{
                return FALSE;
            }
        }
        
        private function saveAttachments() {
            $attachments_number = count($this->json->attachments);
            $errors = 0;
            foreach ($this->json->attachments as $attachment) {
                $attachment_filename = basename($attachment);
                if(!copy($this->originAttachmentsDir."/".$attachment_filename, $this->directory_attachments."/".$attachment_filename)) {
                    $errors = $errors + 1;
                }
            }
            if ($errors > 0) {
                return FALSE;
            }else{
                return TRUE;
            }
        }
        
        private function makeFileNames() {
            $return = new stdClass();
            $date = date("Y-m-d_H-i-s",$this->json->time);
            $basename = "message__".$date."__".$this->json->sender->name;
            $basename = str_replace(" ", "-", $basename);
            $basename = strtolower($basename);
            $return->directory = $this->backupDir."/".$basename;
            $return->attachments = $return->directory."/attachments";
            $return->filename = $basename.".json.php";
            return $return;
        }
        
        private function makeBackupDirs() {
            if (mkdir($this->directory,0755)) {
                if (is_array($this->json->attachments)) {
                    if (mkdir($this->directory_attachments,0755)) {
                        return TRUE;
                    } else {
                        return FALSE;
                    }
                }else{
                    return TRUE;
                }
            } else {
                return FALSE;
            }
            
        }
    }
    