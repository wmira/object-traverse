#object-traverse
==============
[![Build Status](https://travis-ci.org/wmira/object-traverse.svg?branch=master)](https://travis-ci.org/wmira/object-traverse)
[![view on npm](http://img.shields.io/npm/v/object-traverse.svg)](https://www.npmjs.org/package/object-traverse)

A very simple utility on traversing object graphs using a string.

## Changelog
v1.1.1
* added create and push

v1.1.0
* used "." instead of slash

v1.0.2
* added has which check if a path is available by checking if its undefined

## How to use

```
   npm install --save-dev object-traverse
   
```

If using via normal javascript include, then it is exported as window.objectTraverse.

## API

```javascript
var traverse = require('object-traverse');

var graph = {  
   field : {
      deep : {
         x : 1,
         y: 2
      }
   },
   field2: [],
   deepFunc : { someFunc: function(arg) {} }
   
};
//get a value
traverse(graph).get('field/deep');
//get with a default
traverse(graph).get('field/deep','default return val if not found'); 

//check if something is defined
traverse(graph).has('field/deep/missing');

//sets a value
traverse(graph).set('field/deep/z',5);
   
//helpers
traverse(graph).isArray('field2');
traverse(graph).isString('field2');
traverse(graph).isObject('field2');
traverse(graph).isNumber('field2');
          
//exec
traverse(graph).exec('deepFunc/someFunc','arg');         

//delete
traverse(graph).delete('field/deep/x');

//push - add vall to the array, will create if it doesn't exists
traverse(graph).push('a.b.c',val);

//create create the given path if it doesn't exists, will skip none object types
traverse(graph).create('a.b.c');
traverse(graph).get('a.b.c'); //{ a : { b : { c: {} } }
```


