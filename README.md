[![Build Status](https://travis-ci.org/x-component/x-callback.png?v0.0.0)](https://travis-ci.org/x-component/x-callback)
=======================================================================================================



x-callback
==========

use this helper function to wrap a callback function which has err as a first parameter,
if you want to ensure that errors and exceptions are logged.
if you provide the response res, then it will send a 500 on err.

Note: it will still will call the callback with error.

examples:

    callback=require('x-callback');

    f(..,callback(log,function(err,data){....}));      // do not send response, log err and exceptions, call function with err, catch exceptions
    f(..,callback(log,res,function(err,data){....}));  // send response 500, log err and exceptions, call function with err, catch exceptions
    f(..,callback(function(err,data){....},));


callback(log, cb) or callback(log,res,cb)
-----------------------------------------

@param {log} is optional, pass the existing log from the request, or pass the request itself: req.   
@param {res} is optional, if you want send an 500 error code on error or exception, leave it away if you do handle the response yourself   
@param {cb} is your callback function(err,...){} which is wrapped   
@return {function}  to be used where the original callback cb would be used   
