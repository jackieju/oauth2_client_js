/* usage:
	1. include https://github.com/jackieju/javascripts/blob/master/utils.js first
	2. call check_session to do oauth
    check_session({
        client_id: "client1.id", // or say api_key
        redirect_uri:redirect_uri, // it's optional in some provider(e.g. shopify)
        oauth_url: "https://oauth.facebook.com/oauth2/authorization",
        ajax: false // use ajax to direct if using server-flow
    }, function(){
        // do initialzation e.g. initialze page
    });
*/

default_oauth_url = "http://127.0.0.1:60185/authorization";

// default_client_id = "4595242446497150-9uLzeLIikSgJgLHAfRfDNDJxeq0zzX7s";

default_client_id = "client1.id";


function parseParams (params) {
    var ccAuth = Array();
    var authData = params.split("&",4);
    for (i=0; i < authData.length; i++) {
        var paramVal = authData[i].split("=",2);
        ccAuth.push(paramVal[1]);
    }
    return ccAuth;
}
g_atoken = null;

// check session by aouth client-side flow (JS flow)
// but also support server-side if server support cross-domian header
// Use server-side flow: specify params.ajax: false
function check_session(params, callback){
    if (window.location.hash.length == 0) {
        _token = getCookie("atoken");
    } else {
		// client-flow: get access token from url hash
        var rawParams = window.location.hash.substring(1);
        var oAuthData = parseParams(rawParams);
        g_atoken = oAuthData[0];
        document.cookie = "atoken" + "=" + g_atoken;
		// #if you want to display all cookie
        // for (i=0; i < oAuthData.length; i++) {
        //     document.write(oAuthData[i] + "<br />" );
        // }
        // return;
    }

    if (g_atoken == null){
        client_id = params.client_id;
        if (isNullString(client_id))
            client_id = default_client_id;
        if (isNullString(params.oauth_url))
            oauth_url = default_oauth_url;
        console.log("oauth_url:"+oauth_url);
        if (!isNullString(params.appid)){
            console.log("set cookie appid="+params.appid);
            setCookie("appid", params.appid);
        }
        if (params.redirect_uri == null || params.redirect_uri == undefined){
            console.log("use default redirect_uri "+window.location.href);
            params.redirect_uri = window.location.href;
        }
        if (params.ajax == null || params.ajax == undefined){
            console.log("use default redirect_uri "+window.location.href);
            params.ajax = true;
        }
        full_url = oauth_url+"?response_type=token&client_id="+client_id+"&scope=ALL&redirect_uri="+params.redirect_uri;
        if (params.ajax){
            console.log("using ajax to oauth");
        	$.ajax({
	            type: "get",
	            url: full_url,
	            dataType: 'json',

	            success: function(data, textStatus){
	                // alert( "Data Saved: " + data +","+ textStatus);
	                if (data.redirect){
	                    window.location.href = data.redirect;
	                }
	                showWaiting(false);
	            },
	            error: function(xhr, textStatus, errorThrow){
	                // alert("error"+errorThrow+","+textStatus+","+xhr.responseText);
	                popup("error"+errorThrow+","+textStatus+","+xhr.responseText);

	                showWaiting(false);

	            }
	        }); // $ajax
	    }
		else{ // if (params.ajax){
	        // alert("NOT using ajax to oauth, but use url "+full_url);
	        window.location.href = full_url;
	    }// if (params.ajax){ else
        
    }else // if (g_atoken == null){
        callback(g_atoken);
}


