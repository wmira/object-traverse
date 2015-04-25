#object-traverse
==============
[![Build Status](https://travis-ci.org/wmira/object-traverse.svg?branch=master)](https://travis-ci.org/wmira/object-traverse)

A very simple utility on traversing object graphs using a string.

## How to use

```
   npm install --save-dev js-path
   
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
#get a value
traverse(graph).get('field/deep');

#sets a value
traverse(graph).get('field/deep/z',5);
   
#helpers
traverse(graph).isArray('field2');
traverse(graph).isString('field2');
traverse(graph).isObject('field2');
traverse(graph).isNumber('field2');
          
#exec
traverse(graph).exec('deepFunc/someFunc','arg');         

#delete
traverse(graph).delete('field/deep/x');
 
```


