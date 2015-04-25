/* global module, require */




(function (root, factory){
    'use strict';
    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else {
        // Browser globals
        root.objectTraverse = factory();
    }
}) (this, function() {


    'use strict';


    var traverse = function (obj, path) {

        return path.split("/").reduce(function (prev, current) {
            if (prev) {
                return prev[current];
            }
        }, obj);

    };

    /**
     * Returns parent: somePath/field, child : another
     * when passed somePath/field/another
     *
     * @param path
     * @returns {{parent: string, child: *}}
     */
    var parseAsParentChild = function (path) {
        var pathArr = path.split("/");
        return {
            parent: pathArr.length > 1 ?
                pathArr.splice(0, pathArr.length - 1).join('/') : '',
            child: pathArr.length > 0 ? pathArr[pathArr.length - 1] : ''
        }
    };

    /**
     *  Traverse but only up to the second to the last path
     *
     *  returns { traversed: theParent traversed before the last, childPath: the child path }
     */
    var traverseAlmost =  function(obj,path) {
        var subPath = parseAsParentChild(path);

        if ( subPath.parent ) {
            return { traversed: traverse(obj, subPath.parent), childPath: subPath.child }
        }
        return undefined;
    };


   return function (obj) {

        return {
            get: function (path, defaultVal) {
                var traversed = traverse(obj, path);

                if (traversed !== undefined) {
                    return traversed;
                }
                return defaultVal;
            },

            set: function (path, val) {
                //we will retrieve only up to the last path
                var traversedAlmost = traverseAlmost(obj,path);
                if ( traversedAlmost ) {
                    return traversedAlmost.traversed[traversedAlmost.childPath] = val;
                } else if ( obj ) {
                    return obj[path] = val;
                }
            },

            /**
             * Remove this path
             *
             * @param path
             */
            delete: function(path) {
                var traversedAlmost = traverseAlmost(obj,path);
                if ( traversedAlmost ) {
                    delete traversedAlmost.traversed[traversedAlmost.childPath];
                } else if ( obj ) {
                    delete obj[path];
                }
            },

            /**
             *
             *
             * @param path
             */
            exec: function (path) {
                //we will retrieve only up to the last path
                var traversedAlmost = traverseAlmost(obj,path);
                var args = Array.prototype.slice.call(arguments).splice(1);
                if ( traversedAlmost && typeof traversedAlmost.traversed[traversedAlmost.childPath] === 'function') {
                    return traversedAlmost.traversed[traversedAlmost.childPath].apply(traversedAlmost.traversed,args );
                } else if ( obj && typeof obj[path] === 'function') {
                    return obj[path].apply(obj,args);
                }

            },


            /**
             *
             *
             * @param obj
             * @param path
             * @returns {boolean}
             */
            isArray: function (path) {
                return Array.isArray(traverse(obj, path));
            },

            /**
             *
             * @param obj
             * @param path
             * @returns {boolean}
             */
            isObject: function (path) {
                return typeof traverse(obj, path) === 'object';
            },

            /**
             *
             *
             * @param obj
             * @param path
             * @returns {boolean}
             */
            isString: function (path) {
                return typeof traverse(obj, path) === 'string';
            },

            /**
             *
             *
             * @param obj
             * @param path
             * @returns {boolean}
             */
            isNumber: function (path) {
                return typeof traverse(obj, path) === 'number';
            }

        };

    };


});
