/*
 * Bootstrap-based responsive mashup
 * @owner Enter you name here (xxx)
 */
/*
 *    Fill in host and port for Qlik engine
 */
var prefix = window.location.pathname.substr( 0, window.location.pathname.toLowerCase().lastIndexOf( "/extensions" ) + 1 );

var config = {
	host: window.location.hostname,
	prefix: prefix,
	port: window.location.port,
	isSecure: window.location.protocol === "https:"
};
//to avoid errors in dev-hub: you can remove this when you have added an app
var app;
require.config( {
	baseUrl: (config.isSecure ? "https://" : "http://" ) + config.host + (config.port ? ":" + config.port : "" ) + config.prefix + "resources"
} );

require( ["js/qlik", "settings.js"]
, function ( qlik, settings ) {

	var control = false;
	qlik.setOnError( function ( error ) {
		$( '#popupText' ).append( error.message + "<br>" );
		if ( !control ) {
			control = true;
			$( '#popup' ).delay( 1000 ).fadeIn( 1000 ).delay( 11000 ).fadeOut( 1000 );
		}
	} );
	$( "body" ).css( "overflow: hidden;" );
	function AppUi ( app ) {
		var me = this;
		this.app = app;
		app.global.isPersonalMode( function ( reply ) {
			me.isPersonalMode = reply.qReturn;
		} );
		app.getAppLayout( function ( layout ) {
			$( "#title" ).html( layout.qTitle );
			$( "#title" ).attr( "title", "Last reload:" + layout.qLastReloadTime.replace( /T/, ' ' ).replace( /Z/, ' ' ) );
			//TODO: bootstrap tooltip ??
		} );
		app.getList( 'SelectionObject', function ( reply ) {
			$( "[data-qcmd='back']" ).parent().toggleClass( 'disabled', reply.qSelectionObject.qBackCount < 1 );
			$( "[data-qcmd='forward']" ).parent().toggleClass( 'disabled', reply.qSelectionObject.qForwardCount < 1 );
		} );
		app.getList( "BookmarkList", function ( reply ) {
			var str = "";
			reply.qBookmarkList.qItems.forEach( function ( value ) {
				if ( value.qData.title ) {
					str += '<li><a data-id="' + value.qInfo.qId + '">' + value.qData.title + '</a></li>';
				}
			} );
			str += '<li><a data-cmd="create">Create</a></li>';
			$( '#qbmlist' ).html( str ).find( 'a' ).on( 'click', function () {
				var id = $( this ).data( 'id' );
				if ( id ) {
					app.bookmark.apply( id );
				} else {
					var cmd = $( this ).data( 'cmd' );
					if ( cmd === "create" ) {
						$( '#createBmModal' ).modal();
					}
				}
			} );
		} );
		$( "[data-qcmd]" ).on( 'click', function () {
			var $element = $( this );
			switch ( $element.data( 'qcmd' ) ) {
				//app level commands
				case 'page1':
					page1();
					break;
				case 'page2':
					page2();
					break;					
				case 'clearAll':
					app.clearAll();
					break;
				case 'back':
					app.back();
					break;
				case 'forward':
					app.forward();
					break;
				case 'lockAll':
					app.lockAll();
					break;
				case 'unlockAll':
					app.unlockAll();
					break;
				case 'createBm':
					var title = $( "#bmtitle" ).val(), desc = $( "#bmdesc" ).val();
					app.bookmark.create( title, desc );
					$( '#createBmModal' ).modal( 'hide' );
					break;
			}
		} );
	}

	//callbacks -- inserted here --
	//open apps -- inserted here --
	var app = qlik.openApp(settings.appId, config);

	//get objects -- inserted here --
	var visList = [];
	
	page1();
	function page1() {
		cleanup();
		// using app.visualization.get instead of app.getObject
		app.visualization.get('mVPztHm').then(function(vis){vis.show('QV03');visList.push(vis);});
		app.visualization.get('BHTXyNM').then(function(vis){vis.show('QV02');visList.push(vis);});
		app.visualization.get('YPPUPE').then(function(vis){vis.show('QV01');visList.push(vis);});
	}
	
	function page2() {	
		cleanup();
		// using app.visualization.get instead of app.getObject
		app.visualization.get('pDKRhr').then(function(vis){vis.show('QV03');visList.push(vis);});
		app.visualization.get('FDJPm').then(function(vis){vis.show('QV02');visList.push(vis);});
		app.visualization.get('nRxXG').then(function(vis){vis.show('QV01');visList.push(vis);});
	}	

	function cleanup(){
		visList.forEach(function(vis){
			vis.close().then(function(ret){console.log('closed ' + vis.id);});
		});
		visList = [];
	}
	//create cubes and lists -- inserted here --
	if ( app ) {
		new AppUi( app );
	}

} );

