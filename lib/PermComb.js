var config = { verbose:0 };
var log = function(){ };
var config = { verbose: 0 };
var verbose = function(on){
	config.verbose = on;
	if (config.verbose) log = console.log;
	else log = function(){ };
}

var comb = function( bucket , ref ){
	var stack=[];
	while(bucket.length){
		var work = bucket.splice(0,1)[0];
		var val=work[ work.length - 1];
		var basket = ref.slice( val );
		while (basket.length){
			stack.push( work.concat( basket.splice(0,1) ));
		}
	}
	return stack;
}
var build_combo_stack = function( size , spots ){
	var ref=[];
	var bucket=[];
	for( var i = 1; i <= size; i++){
		ref.push(i);	
		bucket.push([i]);	
	}

	//do once
	var combostack = comb( bucket , ref);
	bucket = combostack.concat();

	//repeat till we reach # of spots
	while( combostack[0].length < spots ){
		combostack=comb( bucket , ref);
		bucket=combostack.concat();
	}
	return combostack;
}

/*
	for permutations
*/
var weave = function( outer ){
	var output = [];
	for( var i = 0; i < outer.length; i++){
		for( var j = outer[i].length; j>=0; j--){
			//place in pos
			var val = outer[i].length+1;
			var x = outer[i].slice( 0, j ).concat( [ val ], outer[i].slice(j) );
			output.push( x );
			//log(output);
		}
		log( (process.memoryUsage().heapUsed/131072).toFixed(2) );
	}
	return output;
}

var perm = function( n , output){
	if ( output == undefined ) return perm( n, [ [ 1 ] ] );
	if ( output[0].length < n ) return perm( n, weave( output ) ); 
	return output;
}

var permutate_spots = function( arr, n ){
	var combostack = build_combo_stack( arr.length, n );
	var t=[];
	while(combostack.length){
		var c = combostack.splice(0,1);
		c =  transpose( arr, c )[0];
		var stack = transpose( c, perm( c.length ) );
		t = t.concat(stack);
	}
	return t;
}

var transpose = function(set, inv){
	var output = [];
	for( var i = 0; i < inv.length; i++){
		var layer = inv[i];	
		var out = [];
		for( var j = 0; j < layer.length; j++)
			out.push( set[ layer[j]-1 ] );
		output.push( out );
	}
	//log("Line 130");
	return output;
}

var validate_args = function(arr, n, cb){
	if (typeof arr=="string") arr=arr.split("");

	switch(typeof n){
		case "number":
			break;
		case "function":
			cb = n;
			var n = arr.length;
			break;
		default:
			var n = arr.length;
			break;
	}

	if (typeof cb!="function") 
		cb = function(err, result){ 
			if (err) return log(err); return log(result);
		};
	
	if (undefined == arr.length)
		return {cb: cb, error: "First argument must be an array or string. Code 100"};

	if (arr.length<2)
		return {cb: cb, error: "Array must be of length 2 or greater. Code 200"};

	if (isNaN(n))
		return {cb: cb, error: "2nd argument must either callback function or a positive integer less than length of first argument. Code 300 "}

	if ( n<2 || n>arr.length)
		return {cb: cb, error: "2nd argument must either callback function or a positive integer greater than 2 and less than length of first argument. Code 400 "};

	return {arr:arr, n:n, cb:cb};
}



exports.combinate = function( arr, n , cb){
	process.nextTick( function(){
		var args = validate_args(arr,n,cb);
		if (args.error) return args.cb(args.error);

		var stack = build_combo_stack(args.arr.length, args.n);
		stack = transpose( args.arr, stack );
		return args.cb(null, stack); 
	});
	log("Line 100");
}

exports.permutate = function( arr, n , cb){
	process.nextTick( function(){
		var args = validate_args(arr,n,cb);
		if (args.error) return args.cb(args.error);

		if ( args.arr.length > args.n ){
			var stack = permutate_spots( args.arr, args.n );
			return args.cb(null, stack);
		}
		var stack = transpose( args.arr, perm( args.n) );
		return args.cb(null, stack);
	});
}

exports.factorial = function( n, places ){
	if (places==undefined) places=1;
	else places = n - (places-1);
	for(var i=n; i>places; i--) n=n*(i-1);
	return n;
}

exports.comboCount = function( n, r ){
	return ( exports.factorial(n) / ( exports.factorial(r) * exports.factorial( n -r ) ) );
}

exports.permuCount = function( n, r ){
	return ( exports.factorial(n, r) );
}


