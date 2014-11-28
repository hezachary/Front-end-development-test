
        (function(jq){
            function previewCard( sourceForm, targetContainer ){
                targetContainer.find( '[data-fields]' ).each(function(){
                    var templateField = jq( this );
                    var strFieldTemplate = templateField.attr( 'data-fields' );
                    var aryFieldNameList = strFieldTemplate.match(/\{[^}]+\}/g);
                    var objFieldValueList = {};
                    for( var i = 0; i < aryFieldNameList.length; i++ ){
                        var strValue, strFieldId = aryFieldNameList[i].substring( 1, aryFieldNameList[i].length - 1 );
                        var formField = sourceForm.find( '[name="' + strFieldId +  '"]' );
                        if( formField.is('select') )
                            strValue = formField.find( 'option[value="' + formField.val() + '"]' ).text();
                        else
                            strValue = formField.val();
                        strValue = strValue.replace( /\{/g, '<<<<' ).replace( /\}/g, '>>>>' )
                        strFieldTemplate = jq.trim( strFieldTemplate.replace( aryFieldNameList[i], strValue ) );
                        strFieldTemplate = strFieldTemplate.replace( /^[,\s]+(.*)$/, '$1' ).replace( /^(.*)[,\s]$/, '$1' );
                    }
                    templateField.text( strFieldTemplate.replace( /<<<</g, '{' ).replace( />>>>/g, '}' ) );
                });
                
                
            } 
            
            jq( document ).ready( function(){
                var form = jq( 'form[name="hCard"]' );
                var target = jq( 'aside .hCard' );
                previewCard( form, target );
                
                form.find( 'input[type="text"], input[type="email"], input[type="tel"] ' ).bind( 'keyup', function(){
                    previewCard( form, target );
                } );
                
                form.find( 'select' ).bind( 'change', function(){
                    switch( true ){
                        case 'state' == jq( this ).attr( 'name' ):
                            form.find( 'input[name="state_manually"]' ).val( jq( this ).find( 'option[value="' + jq( this ).val() + '"]' ).text() );
                            break;
                        case 'country' == jq( this ).attr( 'name' ):
                            var selectState = form.find( 'select[name="state"]' );
                            var inputStateManually = form.find( 'input[name="state_manually"]' );
                            var label = selectState.prev( 'label' );
                            if( jq( this ).val().toLowerCase() == 'au' && selectState.is( ':hidden' )){
                                selectState.removeClass( 'hide' );
                                inputStateManually.addClass( 'hide' );
                                label.attr( 'for', selectState.attr( 'id' ) );
                                selectState.trigger( 'change' );
                                return;
                            }else if( jq( this ).val().toLowerCase() != 'au' && inputStateManually.is( ':hidden' ) ){
                                selectState.addClass( 'hide' );
                                inputStateManually.removeClass( 'hide' );
                                label.attr( 'for', inputStateManually.attr( 'id' ) );
                                inputStateManually.val( '' );
                            }
                            break;
                    }
                        
                    previewCard( form, target );
                } );
            } );
        })(jQuery);