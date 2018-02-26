// JavaScript Document

$(function(){
    
    $('.sdk-accordion-title').click(function() {
        $(this).parent().toggleClass('active');
        $(this).next('.sdk-accordion-content-container').toggleClass('show');
    });
    
    $('.sdk-download-button').click(function() {
        $('#getCountry-downloadUrl').val($(this).data('download_url'));
        $('#getCountryInfo-terms_url').attr('href', '/assets/downloads/sdk/Akamai Developers Term of Use (AK 10.14.2016).pdf');
        $('#getCountryInfo-license_url').attr('href', $(this).data('license_url'));
        $('#getCountryInfo-license-text').html(''); //empty it first
        var license = $(this).data('license_url');
        if (typeof license !== 'undefined') {
            if (license != "") {
                $('#getCountryInfo-license-text').html('and the <a href="'+ license +'" target="_blank">License Agreement</a>');
            }
        }
    });
    
    var submitForm = function() {
        var formData = {
            first_name : $('input[name=getCountryInfo-first_name]').val(),
            last_name : $('input[name=getCountryInfo-last_name]').val(),
            email : $('input[name=getCountryInfo-email]').val(),
            country : $('input[name=getCountryInfo-country]').val(),
            company : $('input[name=getCountryInfo-company]').val(),
        };
        
        //submit formData to the API
        $.post("https://shielded-woodland-11065.herokuapp.com/db", formData, function() { /* callback goes here if needed */ });
        
        $('#getCountry').modal('hide');
        
        //do download
        //alert('download success');
        window.location = $('#getCountry-downloadUrl').val();
    };
        
    $('#getCountry-form').validate({
        ignore: [],
        rules: {
            'getCountryInfo-first_name': {
                minlength: 2,
                required: true
            },
            'getCountryInfo-last_name': {
                minlength: 2,
                required: true
            },
            'getCountryInfo-email': {
                required: true,
                email: true
            },
            'getCountryInfo-country': {
                required: true
            },
            'getCountryInfo-terms': {
                required: true
            },
            'hiddenRecaptcha': {
                 required: function() {
                     if (grecaptcha.getResponse() == '') {
                         return true;
                     } else {
                         return false;
                     }
                 } 
            },
        },
        messages: {
            'getCountryInfo-first_name': {
                minlength: 'Please enter a valid name',
                required: 'A first name is required'
            },
            'getCountryInfo-last_name': {
                minlength: 'Please enter a valid name',
                required: 'A last name is required'
            },
            'getCountryInfo-email': {
                required: 'An email is required',
                email: 'A valid email address is required'
            },
            'getCountryInfo-country': {
                required: 'Please select your country',
            },
            'hiddenRecaptcha': {
                required: 'Please verify if you are human or not',
            },
        },
        submitHandler: function() {
            submitForm();
        },
    });
    
    $('#getCountry-form').submit(function(e) {
        e.preventDefault();
        //validate
    });
    
    $('#getTerms-agree').click(function() {
        //terms and conditions agree action
        
        window.location = $('#getCountry-downloadUrl').val();
    });
    
});
