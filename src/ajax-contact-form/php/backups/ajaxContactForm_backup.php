<?php

    //{BANNER}
    
    /**
     * Messages Backup System Class
     * -----------------------------------
     * this class provides a json backup for each message sended using AjaxContactForm
     */
     
    class MessageBackup  {
        
        function __construct($encryptKey,$encryptIv,$zipPassword,$backupDir,$senderName,$senderEmail,$privacy,$messageSubject,$messageBody,$attachmentsFilesDir,$attachmentsFiles) {
            
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
            
            // Encrypt/Decrypt
            $this->encrypt_key = $encryptKey;
            $this->encrypt_iv = $encryptIv;
            
            // Zip Password
            $this->zip_pass = $zipPassword;
            
            // Save Message
            $saveMessage = $this->saveMessage();
            if ($saveMessage == TRUE) {
                $this->writeLog("Backup Success");
            } else {
                $this->writeLog("Backup Error");
            }
        }

        private function writeLog($message) {
            $log_date = $this->json->date;
            $log_message = $log_date." : ".$this->filename." : ".$message.PHP_EOL;
            if (!file_exists("backups/logs")) mkdir("backups/logs",0755);
            file_put_contents("backups/logs/backups_logs.txt", $log_message,FILE_APPEND);
        }
        
        private function saveMessage() {
            $mkDir = $this->makeBackupDirs();
            if($mkDir == TRUE) {
                $json = json_encode($this->json);
                $data = $this->messageEncriptDecript("encrypt", $json);
                if(!file_put_contents($this->directory."/".$this->filename, $data)) {
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
            
            //$this->zipAttachments();
            
            if ($errors > 0) {
                return FALSE;
            }else{
                return TRUE;
            }
        }
        
        private function zipAttachments() {
            //$attachments_log = $this->json->date." - ".$this->filename;
            //$log_file = $this->directory."/attachments.log";
            $zip_file = $this->directory.'/'.$this->filename.'_attachments.zip';
            //file_put_contents($log_file, $attachments_log);
            //system('zip -P'.$this->zip_pass.' -r '.$zip_file.' '.$this->directory_attachments);
            
            $zip = new ZipArchive();
            $ret = $zip->open($zip_file, ZipArchive::CREATE);
            if ($ret !== TRUE) {
                //printf('Failed with code %d', $ret);
            } else {
                $options = array('add_path' => $this->directory_attachments.'/', 'remove_all_path' => TRUE);
                $zip->addGlob('*', GLOB_BRACE, $options);
                $zip->close();
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
            $return->filename = $basename.".message";
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
        
        public function messageEncriptDecript($action, $string) {
            
                $output = false;
            
                $encrypt_method = "AES-256-CBC";
                $secret_key = $this->encrypt_key;
                $secret_iv = $this->encrypt_iv;
            
                // hash
                $key = hash('sha256', $secret_key);
                
                // iv - encrypt method AES-256-CBC expects 16 bytes - else you will get a warning
                $iv = substr(hash('sha256', $secret_iv), 0, 16);
            
                if( $action == 'encrypt' ) {
                    $output = openssl_encrypt($string, $encrypt_method, $key, 0, $iv);
                    $output = base64_encode($output);
                }
                else if( $action == 'decrypt' ){
                    $output = openssl_decrypt(base64_decode($string), $encrypt_method, $key, 0, $iv);
                }
            
                return $output;
            
            
        }
    }
    