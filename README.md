usage:
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
