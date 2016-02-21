/*! 
 * ************************************************************************* 
 *  AjaxContactForm | Simple ajax contact form 
 *  Version 1.7.1 - Date: 21/02/2016 
 *  HomePage: https://github.com/Gix075/ajax-contact-form 
 * ************************************************************************* 
*/ 

/* ****************************************************** */
/*  GOOGLE RECAPTCHA VALIDATION */
/* ****************************************************** */

function reCaptchaValidator(params) {
    
    var defaults = {
            publicKey: null,
            theme: "light", //recaptcha theme
            debug: false, //
            phpValidator: 'ajax-contact-form/php/ajaxContactForm_recaptcha.php',
            callbacks: {
                success: null,
                error: null
            }
        },
        plugin = this;
    
    this.params = $.extend(true, defaults, params);
        
    this.getCaptcha = function (elementID) {
        grecaptcha.render(elementID, {
            'sitekey' : plugin.params.publicKey, 
            'theme' : plugin.params.theme
        });  
    },
        
    this.validateCaptcha = function(elementID) {
        var reCaptchaVal = {
            response: $('#'+elementID).find('.g-recaptcha-response').val()
        }
        console.log('value: '+reCaptchaVal.response);
        if(reCaptchaVal.response != "") {
            $.ajax({
                url: plugin.params.phpValidator,
                type: 'POST',
                data: reCaptchaVal,
                dataType: 'json',
                success: function(data) {
                    if(data.success === true) {
                        if (plugin.params.debug === true) console.log('reCaptchaValidator: Validation Success!'); // DEBUG Node
                        plugin.params.callbacks.success();
                    }else{
                        if (plugin.params.debug === true) console.log('reCaptchaValidator: Validation Fail!'); // DEBUG Node
                        plugin.params.callbacks.error();
                    }
                },
                error: function() {
                    if (plugin.params.debug === true) console.log('reCaptchaValidator: AjaxError!'); // DEBUG Node
                    plugin.params.callbacks.error();
                }
            });//end ajax
        }else{
            if (plugin.params.debug === true) console.log('reCaptchaValidator: No reCaptcha Data!'); // DEBUG Node
            plugin.params.callbacks.error();
        }
    }
};
/* ****************************************************** */
/*  FORM VALIDATION
    Based on Form Validator 0.9.1 alpha */
/* ****************************************************** */

function formValidator(globOpts) {
    
    var opts = "";
    var validator = "";
    
    this.opts = globOpts,
    this.formValidation = true,
    this.validInput = false,
    this.validTextarea = false,
    this.validPassword = false,
    this.validEmail = false,
    this.validSelect = false,
    this.validRadio = false,
    this.validCheckbox = false,
    this.validPhone = false,
    opts = this.opts,
    validator = this,
 
    // validation method
    this.validate = function(element,button,callbacks) {
        $(button).on('click', function(e){
            
            e.preventDefault();
            
            var form = $('form'+element);
            var input = form.find('input.validate').not('input[type="radio"]').not('input[type="checkbox"]');
            var password = form.find('input[type="password"].validate.pswd-confirm');
            var phone = form.find('input[type="tel"].validate');
            var textarea = form.find('textarea.validate');
            var select = form.find('select.validate');
            var email = form.find('input[type="email"].validate');
            var radio = form.find('.radio-group.validate');
            var checkbox = form.find('.checkbox-group.validate');
            var loopError = 0;
           
            // text, tel and all commons inputs
            $(input).each(function(){
                if($(this).val() == "") {
                    if(opts.showErrors === true) validator.showError(this,'input','empty');
                    loopError = loopError + 1;
                }else{
                    if(opts.showErrors === true) validator.hideError(this,'input');
                }
            }); 
            validator.validInput = (loopError > 0) ?  false : true;
            loopError = 0;
            // end input
            
            // Telephone input
            $(phone).each(function(){
                var telValue = $(this).val();
                if(telValue != "") {
                    var reg = /^\d+$/;
                    if ( reg.test(telValue) === false) {
                        if(opts.showErrors === true) validator.showError(this,'input','wrong');
                        loopError = loopError + 1;
                    }else{
                        if(opts.showErrors === true) validator.hideError(this,'input');
                    }
                }
            }); 
            validator.validPhone = (loopError > 0) ?  false : true;
            loopError = 0;
            
            // textarea
            $(textarea).each(function(){
                 if($(this).val() == "") {
                    if(opts.showErrors === true) validator.showError(this,'textarea','empty');
                    loopError = loopError + 1;
                }else{
                    if(opts.showErrors === true) validator.hideError(this,'textarea');
                }
            }); 
            validator.validTextarea = (loopError > 0) ?  false : true;
            loopError = 0;
            
            // end textarea
            
            // select
            $(select).each(function(){
                if (!$("option:selected", this).not('.not-option').length) {
                    if(opts.showErrors === true) validator.showError(this,'select','empty');
                    loopError = loopError + 1;
                }else{
                    if(opts.showErrors === true) validator.hideError(this,'select');
                }
            });
            validator.validSelect = (loopError > 0) ?  false : true;
            loopError = 0;
            //end select
            
            
            $(email).not('.email-confirm').each(function(){
                if( $(this).val() != "" && opts.mailformat === true ) {
                    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                    if ( re.test($(this).val()) === false ) {
                        if(opts.showErrors === true) validator.showError(this,'email','wrong');
                        loopError = loopError + 1;
                    }else{
                        if(opts.showErrors === true) validator.hideError(this,'email');
                    }
                }
                
                if( $(this).val() != "" && opts.mailconfirm === true && loopError == 0 ) {
                    console.log($(this).attr('id'));
                    var confirmElement = $('.email-confirm[data-confirm="#'+ $(this).attr('id') +'"]');
                    if ( $(this).val() != $(confirmElement).val() ) {
                        if(opts.showErrors === true) validator.showError(confirmElement,'email','wrong');
                        loopError = loopError + 1;
                    }else{
                        if(opts.showErrors === true) validator.hideError(confirmElement,'email');
                    }
                }
                
            });
            validator.validEmail = (loopError > 0) ?  false : true;
            loopError = 0;
            //end email
            
            //password 
            if(opts.passwordconfirm === true) {
                $(password).each(function(){
                    if($(this).val() != "") {
                        var confirmPswdElement = $(this).data('confirm');
                        if ( $(this).val() != $(confirmPswdElement).val() ) {
                            if(opts.showErrors === true) validator.showError(this,'password','wrong');
                            loopError = loopError + 1;
                        }else{
                            if(opts.showErrors === true) validator.hideError(this,'password');
                        }
                    }
                });
            }
            validator.validPassword = (loopError > 0) ?  false : true;
            loopError = 0;
            
            // radio
            $(radio).each(function(){
                var checkedbox = false;
                $(this).find('input[type="radio"]').each(function(){
                    if($(this).is(':checked')) checkedbox = true;
                })
                
                if( checkedbox === false ) {
                    if(opts.showErrors === true) validator.showError(this,'radio','empty');
                    loopError = loopError + 1;
                }else{
                    if(opts.showErrors === true) validator.hideError(this,'radio');
                }
   
            }); 
            validator.validRadio = (loopError > 0) ?  false : true;
            loopError = 0;
            // end radio
            
            // checkbox
            $(checkbox).each(function(){
                var checkedbox = false;
                $(this).find('input[type="checkbox"]').each(function(){
                    if($(this).is(':checked')) checkedbox = true;
                })
                
                if( checkedbox === false ) {
                    if(opts.showErrors === true) validator.showError(this,'checkbox','empty');
                    loopError = loopError + 1;
                }else{
                    if(opts.showErrors === true) validator.hideError(this,'checkbox');
                }
   
            }); 
            validator.validCheckbox = (loopError > 0) ?  false : true;
            loopError = 0;
            // end checkbox
            
            // Callback Functions
            if (validator.validInput === true && validator.validPassword === true && validator.validPhone === true && validator.validTextarea === true && validator.validEmail === true && validator.validSelect === true && validator.validRadio === true && validator.validCheckbox === true ) {
                callbacks.success();
            }else{
                callbacks.fail();
            }
 
            
        }); //end click
        
        
    }, // end validate()
    
    this.showError = function(inputElement,inputType,errorType) {
        if (inputType == 'radio' || inputType == 'checkbox') {
            // checkbox and radio error message
            ( opts.bootstrap === true ) ? $(inputElement).closest('.'+inputType+'-group').addClass('has-error') : $(inputElement).addClass('error');
            $(inputElement).closest('.'+inputType+'-group').find('.form-input-error-msg').addClass('show-error');
        }else{
            // common inputs error message
            ( opts.bootstrap === true ) ? $(inputElement).closest('.form-group').addClass('has-error') : $(inputElement).addClass('error');
            $(inputElement).prev('.form-input-error-msg').addClass('show-error');
            switch(errorType) {
                case 'empty':
                    $(inputElement).prev('.form-input-error-msg').find('.error-wrong').removeClass('show-error');
                    $(inputElement).prev('.form-input-error-msg').find('.error-empty').addClass('show-error');
                    break;
                case 'wrong':
                    $(inputElement).prev('.form-input-error-msg').find('.error-empty').removeClass('show-error');
                    $(inputElement).prev('.form-input-error-msg').find('.error-wrong').addClass('show-error');
                    break;
            }//end switch
            
        }
        
    },
    this.hideError = function(inputElement,inputType) {
        if (inputType == 'radio' || inputType == 'checkbox') {
            ( opts.bootstrap === true ) ? $(inputElement).closest('.'+inputType+'-group').removeClass('has-error') : $(inputElement).removeClass('error');
            $(inputElement).closest('.'+inputType+'-group').find('.form-input-error-msg').removeClass('show-error');
        }else{
            ( opts.bootstrap === true ) ? $(inputElement).closest('.form-group').removeClass('has-error') : $(inputElement).removeClass('error');
            $(inputElement).prev('.form-input-error-msg').removeClass('show-error');
            $(inputElement).prev('.form-input-error-msg').find('.error-empty,.error-wrong').removeClass('show-error');
        }
        
    },
    this.clearError = function(formElement) {
        $(formElement).find('*').removeClass('error');
        $(formElement).find('*').removeClass('has-error');
        $(formElement).find('*').removeClass('show-error');
    }
 
};
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
                cleanAfterMinutes: 15
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
                            console.log('%c AjaxContactForm: MAIL_ERROR ','background:red;color:#fff;');
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
