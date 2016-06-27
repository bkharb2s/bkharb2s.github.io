ccm.component( {

  name: 'messenger',

  config: {

    html:  [ ccm.store, { local: 'http://bkharb2s.github.io/templates.json' } ],
    key:   'testmessenger',
    store: [ ccm.store, { url: 'ws://ccm2.inf.h-brs.de/index.js', store: 'messengerstore123' } ],
    style: [ ccm.load, 'http://bkharb2s.github.io/style.css' ],
    user:  [ ccm.instance, 'https://kaul.inf.h-brs.de/ccm/components/user2.js' ],
    icons: [ ccm.load, 'https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css'  ]

  },

  
  Instance: function () {

    var self = this;

    self.init=function( callback ) {

      self.store.onChange = function(){self.render();};
      
      callback();

    };

    self.render = function ( callback ) {

      var element = ccm.helper.element( self );

      self.store.get( self.key, function ( dataset ) {

          if ( dataset === null )
          self.store.set( { key: self.key, messages: [] }, proceed );
        else
          proceed( dataset );

        function proceed( dataset ) {

          
          element.html( ccm.helper.html( self.html.get( 'main' ) ) );

            
          var messages_div = ccm.helper.find( self, '.messages' );

          
          for ( var i = 0; i < dataset.messages.length; i++ ) {

          
                addMessage(i);

          }     
            
            function addMessage(i){
              var message = dataset.messages[ i ];

              messages_div.append( ccm.helper.html( self.html.get( 'message' ), {
            
              click: function(){
                  removeMessage(i);
              },
              datum: ccm.helper.val(message.datum),
              name: ccm.helper.val( message.user ),
              text: ccm.helper.val( message.text ),
              vernichten: function(){
                  destroy(i);
              }

            } ) );
            }
            function destroy(index){
                if(dataset.messages[index].user===self.user.data().key||self.user.data().key==="bkharb2s"||dataset.messages[index].user==="ToDo liste"){
                dataset.messages.splice(index,1);     
                  self.store.set(dataset,function(){
                           self.render();
                       });
                }
                else{
                    alert("Sie dürfen diese Nachricht nicht vernichten.");
                }
            }
            
            
            function removeMessage(index){
                self.user.login(function(){
                   if(dataset.messages[index].user===self.user.data().key){
                        dataset.messages[index].text="Die Nachricht wurde entfernt.";
                       
                       self.store.set(dataset,function(){
                           self.render();
                       });
                       
                       
                   } 
                   else{
                       alert("Sie dürfen diese Nachricht nicht löschen.");
                   }
                });
                
                
            }
            
            
    function getTime(){
    var date = new Date();
	var stunden = date.getHours();
	var minuten = date.getMinutes();
    var seconde = date.getSeconds();
	var tag = date.getDate();
	var monatDesJahres = date.getMonth();
	var jahr = date.getFullYear();
	var tagInWoche = date.getDay();
	var wochentag = new Array("Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag");
	var monat = new Array("Januar", "Februar", "M&auml;rz", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember");

	var datum;
        console.log(datum);

    if(minuten<10){
         datum = wochentag[tagInWoche] + ", " + tag + ". " + monat[monatDesJahres] + " " + jahr + " um " + stunden+":0" + minuten ;

    }else{
          datum = wochentag[tagInWoche] + ", " + tag + ". " + monat[monatDesJahres] + " " + jahr + " um " + stunden+":" + minuten ;

    }

        return datum;
    };
            
            
            
            
            
            
          messages_div.append( ccm.helper.html( self.html.get( 'input' ), { onsubmit: function () {

            
            var value = ccm.helper.val( ccm.helper.find( self, 'input' ).val() ).trim();

            if ( value === '' ) return;

            
            self.user.login( function () {

              dataset.messages.push( { user: self.user.data().key, datum: getTime()  ,text: value } );

              self.store.set( dataset, function () { self.render(); } );

            } );

            return false;

          } } ) );

          if ( callback ) callback();

        }

      } );

    };

  }

} );