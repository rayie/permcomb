var PC = require("./lib/PermComb.js");
var log = console.log;
PC.permutate("great", function(err, ss){
	log("\nHere's an example of generating anagrams for the word 'great': ");
	var terms = [];
	for( var i = 0; i < ss.length; i++){
		terms.push(  ss[i].join("") );
	}
	terms.sort();
	log(terms);
});

PC.permutate([ {a:1,b:2}, 1500, {e:5,f:6},"bigfoot" ], function(err, ss){
	log("\nCombinations for a mixed set of elements");
	log(ss);
});

