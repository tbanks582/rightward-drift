1. start with array in memory
	* e.g. 
		* `[{prefix: "CS",number: 149},{prefix: "CS",number: 159},]`
1. filter the array
	1. define a function that:
		1. given an element of the array
		2. returns true if the element is considered a match for your use case
	1. call filter on your array and pass filter this function
1. map the array
	1. define a function that:
		1. given an element of the array
		1. returns a string that has the marked up (HTML) representation of the array element
	1. call map on your array and pass it the function
	1. the result of the map call is an array where every element is the result of calling your function on the corresponding elem in the original array
1. call reduce on your array