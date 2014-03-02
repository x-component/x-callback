'use strict';


/**
 * x-callback
 * ==========
 *
 * use this helper function to wrap a callback function which has err as a first parameter,
 * if you want to ensure that errors and exceptions are logged.
 * if you provide the response res, then it will send a 500 on err.
 *
 * Note: it will still will call the callback with error.
 *
 * examples:
 *
 *     callback=require('x-callback');
 *
 *     f(..,callback(log,function(err,data){....}));      // do not send response, log err and exceptions, call function with err, catch exceptions
 *     f(..,callback(log,res,function(err,data){....}));  // send response 500, log err and exceptions, call function with err, catch exceptions
 *     f(..,callback(function(err,data){....},));
 *
 *
 * callback(log, cb) or callback(log,res,cb)
 * -----------------------------------------
 *
 * @param log is optional, pass the existing log from the request, or pass the request itself: req.
 * @param res is optional, if you want send an 500 error code on error or exception, leave it away if you do handle the response yourself
 * @param cb is your callback function(err,...){} which is wrapped
 * @return function to be used where the original callback cb would be used
 */

//
module.exports = function F(log/*!optional*/, res/*!optional*/, cb, onError/*!optional*/, rethrow) {
		/*! handle optional parameters*/
		/*! no res         */ if (typeof res === 'function')                           return F(log, void 0, res, cb, onError);
		/*! no log, no res */ if (typeof log === 'function')                           return F(void 0, void 0, log, res, cb);
		/*! no onError     */ if (onError !== void 0 && typeof onError !== 'function') return F(log, res, cb, void 0, onError);
		
		log = (log && log.log ? log.log(__filename) : log) || require('x-log'); // use given request log, or given log or general log
		
		var handle_error = function handle_error(err) {
			try {
				// log error
				if (log.error){
					
					// try to get stack , if needed by throwing dummy exception
					var stack = err.stack; if (!err instanceof Error || !stack){ try { throw Error('dummy'); } catch (dummy) { stack = dummy.stack; } }
					
					var meta = typeof err === 'object' ? err : {}; // err object is used as meta info and logged in json format
					
					if (!meta.stack && stack) meta.stack = stack;
					
					log.error('callback error occurred: ' + (typeof err === 'object' ? (err.message ? err.message : err) +
						(err.fileName ? '(' + err.fileName + (err.lineNumber ? ':' + err.lineNumber : '') + ')' : '') : err),
						meta
					);
				}
				
				if (res && !res.headerSent && res.send){
					if (log.error) log.error(" HTTP 500 sent, via util/callback.js");
					res.send(500);
				}
				
				if (onError && (typeof onError === 'function')) onError(err);
				
			} catch (e) {
				if (log.error)log.error('exception in handle error of callback', e);
				if (rethrow) throw e;
			}
		};
		
		return function (err) {
			
			if (err) handle_error(err); // Always call callback even with err !
			
			if (cb){
				try {
					cb.apply(this, arguments);
				}catch (e) {
					handle_error(e);
					if (rethrow) throw e;
				}
			}
		};
	};
