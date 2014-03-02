'use strict';

var
	vows     = require('vows'),
	assert   = require('assert'),
	callback = require('../callback'),
	extend   = require('x-common').extend,
	suite    = vows.describe('callback');

var logger = function(){
	return {
		error : extend(function F(){
			F.called.push(arguments);
		},{ called:[] })
	};
};

suite.addBatch({
	'test error callback': {
		topic: function(){
			return function(log,cb){
				return callback(log,function(err,result){
					cb(err,result);
				});
			};
		},
		'call with error' : {
			topic: function(topic){
				var log = logger();
				topic(log,this.callback)(new Error(),log);
			},
			'error passed' : function(err,result){
				assert(err!==null);
			},
			'error logged' : function(err,log){
				assert.equal(log.error.called.length, 1);
			}
		},
		'call with no error' : {
			topic: function(topic){
				var log = logger();
				topic(log,this.callback)(null,log);
			},
			'no error passed' : function(err,result){
				assert(err===null);
			},
			'no error logged' : function(err,log){
				assert.equal(log.error.called.length, 0);
			}
		},
		'callback wich causes exception' : {
			topic: function(topic){
				var log = logger();
				topic(log,function(){ throw new Error('oh no');})(null,log);
				return log;
			},
			'exception logged' : function(log){
				assert.equal(log.error.called.length, 1);
			}
		}
	}
});
suite.exportTo(module,{error:false});
