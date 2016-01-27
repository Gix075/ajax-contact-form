
function ajaxContactForm(opts) {
    
    var defaultOptions = {
            form: "#ajaxContactForm",
            formBtn: "#ajaxContactFormBtn",
            ws: 'ajax-contact-form/php/ajaxContactForm.php',
            showMsg: true,
            recaptcha: {
                pubKey: "",
                element: "ajaxContactForm_recaptcha",
                theme: "light",
                ws: 'ajax-contact-form/php/ajaxContactForm_recaptcha.php'
            },
            attachments: {
                allowed: true,
                ws: 'ajax-contact-form/php/attachments/ajaxContactForm_attachments.php',
                acceptFileTypes: /(\.|\/)(gif|jpe?g|png|pdf|zip)$/i,
                maxFileSize: 20971520,
                maxTotalSize: 20971520,
                maxFiles: 10,
                cleanAfterMinutes: 20
            },
            messages: {
                attachments: {
                    clean: 'TIMEOUT - Your file was removed, please upload it again!',
                    fileRemoved: 'File removed!',
                    errors: {
                        uploadFailed: 'Upload failed!',
                        maxNumberOfFiles: 'Sorry, maximum number of files exceeded',
                        maxFileSize: 'Sorry, file too large!',
                        maxTotalSize: 'Sorry the attachment size amount exceeds the maximum quota!',
                        timeout: 'TIMEOUT - Your file was removed, please upload it again!',
                        fileType: 'File type not allowed!'
                    }
                }
            },
            debug: true
        },
        plugin= this;
    
    // Settings
    this.settings = $.extend(true, defaultOptions, opts );
    
    // Recaptcha Parameters
    var recaptchaParams = {
        publicKey: this.settings.recaptcha.pubKey,
        theme: this.settings.recaptcha.theme, //recaptcha theme
        debug: true, //
        phpValidator: this.settings.recaptcha.ws,
        callbacks: {
            success: function() {
                $('#' + plugin.settings.recaptcha.element).prev('.form-input-error-msg').hide();
                plugin.sendMessage();
            },
            error: function() {
                $('#' + plugin.settings.recaptcha.element).prev('.form-input-error-msg').show();
            }
        }
    };  
    
    this.recaptcha = new reCaptchaValidator(recaptchaParams);
    
    // Init
    this.init = function() {
        this.recaptcha.getCaptcha(this.settings.recaptcha.element);
        this.validateContactForm();
        
        // Attachments
        if(this.settings.attachments.allowed === true) {
            var webStorageName1 = 'acf_attachmentTotalSize_' + this.settings.form.replace('#',''),
                webStorageName2 = 'acf_attachmentMaxNumber_' + this.settings.form.replace('#','');
            sessionStorage[webStorageName1] = 0;
            sessionStorage[webStorageName2] = 0;
            this.uploadFile(this.settings.attachments.cleanAfterMinutes);
        }
        
    };
    
    /* FORM VALIDATION */
    /* ============================== */
    this.validateContactForm = function() {
        
        var validatorOptions = {
                bootstrap: true,
                mailconfirm: true,
                mailformat: true,
                showErrors: true
            };
        
        new formValidator(validatorOptions).validate(this.settings.form, this.settings.formBtn,
        {
            success:function(){
                console.log('%c AjaxContactForm: validation success! ','background:#333;color:#fff;');
                $(plugin.settings.form).find('.acf_messagebox').height($(plugin.settings.form).height());
                plugin.spinnerPlay();
                
                // Recaptcha Validation
                plugin.recaptcha.validateCaptcha(plugin.settings.recaptcha.element);
                
            },
            fail:function(){
                console.log('%c AjaxContactForm: validation fail! ','background:#333;color:red;');
            }
        });
    };
    
    /* SEND MESSAGE */
    /* ============================== */
    this.sendMessage = function() {
        var formData = $(this.settings.form).serialize();
        var plugin = this;
        $.ajax({
            url: this.settings.ws,
            type: 'POST',
            data: formData,
            dataType: 'json',
            success: function(data) {
                plugin.spinnerStop();
                if (plugin.settings.showMsg === true) {
                    
                    $(plugin.settings.form).find('.acf_messagebox').show();
                    
                    switch(data.result) {
                        case "success": 
                            $(plugin.settings.form).find('.acf_messagebox > .msg-error').hide();
                            $(plugin.settings.form).find('.acf_messagebox > .msg-success').show();
                            break;
                        case "fail":
                            $(plugin.settings.form).find('.acf_messagebox > .msg-error > .msg-error-info').text(data.msg);
                            $(plugin.settings.form).find('.acf_messagebox > .msg-success').hide();
                            $(plugin.settings.form).find('.acf_messagebox > .msg-error').show();
                            break;
                    }
                      
                    $('.acf_close-msg').on('click', function(e) {
                        e.preventDefault();
                        $(this).closest('.acf_messagebox').hide();
                    });
                }
            },
            error: function() {
                console.log('%c AjaxContactForm: AJAX_ERROR ','background:red;color:#fff;');
                plugin.spinnerStop();
                $(plugin.settings.form).find('.acf_messagebox').show();
                $(plugin.settings.form).find('.acf_messagebox > .msg-success').hide();
                $(plugin.settings.form).find('.acf_messagebox > .msg-error').show();
                $('.acf_close-msg').on('click', function(e) {
                    e.preventDefault();
                    $(this).closest('.acf_messagebox').hide();
                });
            }
        });
    };
    
    
    /* ATTACHMENTS */
    /* ============================== */
    
    // Attachments: UploadFile 
    this.uploadFile = function(cleanAfterMinutes) {
        
        var maxFileNumber = this.settings.attachments.maxFileNumber,
            maxFileSize = this.settings.attachments.maxFileSize,
            maxTotalFile = this.settings.attachments.maxTotalSize;
        
        
        $(plugin.settings.form).find('.acf_attachments-dragarea span').on('click', function() {
            $(this).closest('.acf_attachments-dragarea').find('input[name="files[]"]').click();
        });
        
        var filenameMarkup = "";
        
        $(plugin.settings.form).fileupload({
            
            url: plugin.settings.attachments.ws,
            dataType: 'json',
            maxFileSize: plugin.settings.attachments.maxFileSize,
            acceptFileTypes: plugin.settings.attachments.acceptFileTypes,
            dropZone: $(plugin.settings.form).find('.acf_attachments-dragarea'),
            messages: {
                maxNumberOfFiles: plugin.settings.messages.attachments.errors.maxNumberOfFiles,
                acceptFileTypes: plugin.settings.messages.attachments.errors.fileType,
                maxFileSize: plugin.settings.messages.attachments.errors.maxFileSize,
                minFileSize: 'File is too small'
            },
            done: function (e, data) {
                
                // DEBUG NODE
                if (plugin.settings.debug === true) console.log('ATTACHMENTS --> UPLOAD DONE');
                
                $.each(data.result.files, function (index, file) {
                   
                    filenameMarkup =    '<li>\n'+
                                        '   <div class="acf_attachments-filename" data-fileurl="' + file.url + '" data-filename="' + file.name + '" data-filesize="' + file.size + '">\n' +
                                        '       <span class="filename">' + file.name + '</span>\n' +
                                        '       <span class="fileremove" data-filename="' + file.name + '" data-remove="' + file.deleteUrl + '"><span class="glyphicon glyphicon-remove"></span></span>\n' +
                                        '   </div>' +
                                        '</li>\n';
                    
                    $(plugin.settings.form).find('.acf_attachments-error-msg').closest('li').remove();
                    $(plugin.settings.form).find('.acf_attachments-list').append(filenameMarkup);
                    $(plugin.settings.form).find('.acf_attachments-progress').hide();
                    if(cleanAfterMinutes > 0) plugin.uploadCleaner(file.name,file.url,file.size,cleanAfterMinutes);
                    
                    plugin.uploadDeleteFile(file.name);
                    plugin.uploadUpdateFileVal('add',file.name);
                    plugin.uploadControlsWidget("add",file.size);
                    
                    
                });

                
            },
            progressall: function (e, data) {
                $(plugin.settings.form).find('.acf_attachments-progress').show();
                var progress = parseInt(data.loaded / data.total * 100, 10);
                $(plugin.settings.form).find('.acf_attachments-progbar').css(
                    'width',
                    progress + '%'
                );
            },
            processfail: function (e, data) {
                
                // DEBUG NODE
                if (plugin.settings.debug === true) console.log('ATTACHMENTS --> UPLOAD PROCESS FAIL');
                filenameMarkup = '<li><span class="acf_attachments-error-msg acf_attachments-processfail-msg">' + data.files[data.index].error + '</span></li>';
                $(plugin.settings.form).find('.acf_attachments-error-msg').closest('li').remove();
                $(plugin.settings.form).find('.acf_attachments-list').append(filenameMarkup);
                /*console.log('Processing ' + data.files[data.index].name + ' failed.');
                console.log(data.files[data.index].error);
                console.log(e);*/
            },
            fail: function (e, data) {
                // data.errorThrown
                // data.textStatus;
                // data.jqXHR;
                console.log('FAIL: ' + data);
            }
        });
    };
    
    // Attachments: DeleteFile 
    this.uploadDeleteFile = function(filename) {
        
        $(plugin.settings.form).find('.fileremove[data-filename="' + filename + '"]').on('click', function(e) {
            e.preventDefault();
            var element = $(this).closest('li'),
                fileurl = $(this).closest('.acf_attachments-filename').data('fileurl'),
                filesize = $(this).closest('.acf_attachments-filename').data('filesize');
            $.ajax({
                url: $(this).data('remove'),
                type: 'DELETE',
                success: function(e, data) {
                    
                    // DEBUG NODE
                    if (plugin.settings.debug === true) console.log('ATTACHMENTS --> FILE DELETED!');
                    
                    if (data === 'success') {
                        plugin.uploadUpdateFileVal('remove',filename);
                        plugin.uploadControlsWidget("remove",filesize);
                        $(element).find('.acf_attachments-filename').html(plugin.settings.messages.attachments.fileRemoved);
                        setTimeout(function() {
                            $(element).remove();
                        },1000);
                    }
                },
                error: function() {
                    // DEBUG NODE
                    if (plugin.settings.debug === true) console.log('ATTACHMENTS --> DELETE ERROR: AjaxError!');
                }
            });
        });
    };
    
    // Attachments: Cleaner 
    this.uploadCleaner = function(filename,fileurl,filesize,cleanAfterMinutes) {
        $.ajax({
            url: 'ajax-contact-form/php/attachments/ajaxContactForm_cleaner.php?file=' + filename + '&minutes=' + cleanAfterMinutes,
            dataType: 'json',
            success: function(data) {
                if (data.success === true ) {
                    
                    // DEBUG NODE
                    if (plugin.settings.debug === true) console.log('ATTACHMENTS --> CLEANER: ' + data.success + ' - ' + data.file + ' ' + data.msg);
                    
                    $(plugin.settings.form).find('.acf_attachments-filename[data-filename="' + data.file + '"]').html('<span class="acf_attachments-error-msg acf_attachments-filetimeout">' + plugin.settings.messages.attachments.errors.timeout + '</span>');
                    plugin.uploadUpdateFileVal('remove',filename);
                    plugin.uploadControlsWidget("remove",filesize);
                }
            },
            error: function() {
                // DEBUG NODE
                if (plugin.settings.debug === true) console.log('ATTACHMENTS --> CLEANER ERROR: AjaxError!');
            }
        });
    };
    
    // Attachments: Update Input Value
    this.uploadUpdateFileVal = function(operation,filename) {
        
        var attachments = $(plugin.settings.form).find('input[name="acf_attachments"]').val();
        
        switch(operation) {
                
            case "add":
                attachments = attachments.split(',');
                attachments.push(filename);
                var newVal = attachments.toString();
                newVal = (newVal.charAt( 0 ) === ',') ? newVal.slice( 1 ) : newVal;
                $(plugin.settings.form).find('input[name="acf_attachments"]').val(newVal);
                break;
            
            case "remove":
                attachments = attachments.split(',');
                var index = attachments.indexOf(filename);
                if (index >= 0) attachments.splice( index, 1 );
                var newVal = attachments.toString();
                newVal = (newVal.charAt( 0 ) === ',') ? newVal.slice( 1 ) : newVal;
                $(plugin.settings.form).find('input[name="acf_attachments"]').val(newVal);
                break;
        }
    };
    
    // Attachments: Total Size Control
    this.uploadTotalSizeControl = function(operation,filesize) {
        
        var webStorageName = 'acf_attachmentTotalSize_' + this.settings.form.replace('#',''),
            currentAmount = (sessionStorage[webStorageName] !== "" && sessionStorage[webStorageName] !== undefined) ? Number(sessionStorage[webStorageName]) : 0;
        
        filesize = Number(filesize);
        
        switch(operation) {      
            case "add":
                currentAmount = currentAmount + filesize;
                sessionStorage[webStorageName] = currentAmount;
                break;
            case "remove":
                currentAmount = currentAmount - filesize;
                sessionStorage[webStorageName] = currentAmount;
                break;
        }
        
        
        var result = {
            overlimit: (this.settings.attachments.maxTotalSize > currentAmount) ? false : true,
            limit: this.settings.attachments.maxTotalSize,
            amount: currentAmount
        }
        return result;
    }
    
    // Attachments: Max Number of Files Control
    this.uploadMaxNumberControl = function(operation) {
        
        var maxNumberStorage = 'acf_attachmentMaxNumber_' + this.settings.form.replace('#',''),
            currentNumber = (sessionStorage[maxNumberStorage] !== "" && sessionStorage[maxNumberStorage] !== undefined) ? Number(sessionStorage[maxNumberStorage]) : 0;
        
        switch(operation) {
            case "add":
                currentNumber = currentNumber + 1;
                break;
            case "remove":
                currentNumber = currentNumber - 1;
                break;
        }
        
        sessionStorage[maxNumberStorage] = currentNumber;
        
        var result = {
            overlimit: (this.settings.attachments.maxFiles > currentNumber) ? false : true,
            limit: this.settings.attachments.maxFiles,
            amount: currentNumber
        }
        return result;
    }
    
    // Attachments: Total Size Control Widget 
    this.uploadControlsWidget = function(operation,filesize) {
        
        var totalSizeControl,
            markupTotalSizeControl,
            maxNumberControl,
            markupMaxNumberControl;
        
        // LIMITS CONTROL BLOCK
        if( plugin.settings.attachments.maxTotalSize > 0 ) {
            totalSizeControl = plugin.uploadTotalSizeControl(operation,filesize);
        }
        
        if( plugin.settings.attachments.maxFiles > 0 ) {
            
            maxNumberControl = plugin.uploadMaxNumberControl(operation);
            
            // DEBUG NODE
            if (plugin.settings.debug === true) console.log('ATTACHMENTS MAX NUMBER --> Overlimit: ' + maxNumberControl.overlimit);
            
            if (maxNumberControl.overlimit === true) {
                plugin.uploadBlockForm();
            }else{  
                plugin.uploadUnBlockForm();
            }
        }
        
        
        // LIMITS CONTROL DISPLAY
        if ($(plugin.settings.form).find('.acf_attachments-sizecontrol').length) {
               
            
            if( plugin.settings.attachments.maxTotalSize > 0 ) {
                markupTotalSizeControl =    '<div class="acf_attachments-sizecontrol-display">\n' + 
                                            '   <span class="display_current-amount">' + Math.round(totalSizeControl.amount / 1024 / 1024 * 100) / 100 + '</span>\n' +
                                            '   <span class="display_total-limit">' + totalSizeControl.limit / 1024 / 1024 + 'MB</span>\n' +
                                            '</div>';
            }
            
            if( plugin.settings.attachments.maxFiles > 0 ) {
                markupMaxNumberControl =    '<div class="acf_attachments-sizecontrol-display">\n' + 
                                            '   <span class="display_current-amount">' + maxNumberControl.amount + '</span>\n' +
                                            '   <span class="display_total-limit">' + maxNumberControl.limit + ' files</span>\n' +
                                            '</div>';
            }
                  
            $(plugin.settings.form).find('.acf_attachments-sizecontrol').html(markupTotalSizeControl + markupMaxNumberControl);
        }
        
    };
    
    // Attachments: Form Block
    this.uploadBlockForm = function() {
        $(plugin.settings.form).find('.acf_attachments-dragarea').css('opacity',0.5);
        $(plugin.settings.form).find('.acf_attachments-dragarea > input').prop('disabled',true);
        $(plugin.settings.form).find('.acf_attachments-dragarea > span').attr('disabled','disabled');
    };
    
    // Attachments: Form UnBlock
    this.uploadUnBlockForm = function() {
        $(plugin.settings.form).find('.acf_attachments-dragarea').css('opacity',1);
        $(plugin.settings.form).find('.acf_attachments-dragarea > input').prop('disabled',false);
        $(plugin.settings.form).find('.acf_attachments-dragarea > span').removeAttr('disabled');
    };
    
    /* SPINNER */
    /* ============================== */
    this.spinnerPlay = function() {
        $(this.settings.form).find('.acf_spinner-wrapper').show();
    };
    
    this.spinnerStop = function() {
        $(this.settings.form).find('.acf_spinner-wrapper').hide();
    };
}
