/* global module, require */
/* jshint esnext: true, -W097 */


'use strict';


var traverse = function(obj,path) {

    return path.split("/").reduce(function(prev,current) {
        if ( prev ) {
            return prev[current];
        }
    },obj);

};

/**
 * Returns parent: somePath/field, child : another
 * when passed somePath/field/another
 *
 * @param path
 * @returns {{parent: string, child: *}}
 */
var parseAsParentChild = function(path) {
   var pathArr = path.split("/");
   return { parent: pathArr.length > 1 ?
                    pathArr.splice(0,pathArr.length-1).join('/') : '',
            child: pathArr.length > 0 ? pathArr[pathArr.length-1] : '' }
};


var traverseApi = function(obj) {

    return {
        get : function(path,defaultVal) {
            var traversed = traverse(obj,path);

            if ( traversed !== undefined  ) {
                return traversed;
            }
            return defaultVal;
        },

        set : function(path,val) {
            //we will retrieve only up to the last path
            var subPath = parseAsParentChild(path);
            var traversed;

            //FIXME: so similar with below, we should refactor this.
            if ( subPath.parent ) {
                traversed = traverse(obj,subPath.parent);
                if ( traversed ) {
                    traversed[subPath.child] = val;
                    return traversed[subPath.child];
                }
            } else {
                obj[path] = val;
                return obj[path];
            }

        },

        /**
         *
         *
         * @param path
         */
        exec : function(path) {
            var subPath = parseAsParentChild(path);

            var traversed;

            if ( subPath.parent ) {
                traversed = traverse(obj,subPath.parent);
                if ( traversed && typeof traversed[subPath.child] === 'function' ) {
                    return traversed[subPath.child].apply(traversed,Array.prototype.slice.call(arguments).splice(1))
                }
            } else {
                if ( typeof obj[path] === 'function' ) {
                    return obj[path].apply(obj,Array.prototype.slice.call(arguments).splice(1));
                }
            }

        },


        /**
         *
         *
         * @param obj
         * @param path
         * @returns {boolean}
         */
        isArray: function( path ) {
            return Array.isArray(traverse(obj,path));
        },

        /**
         *
         * @param obj
         * @param path
         * @returns {boolean}
         */
        isObject : function( path) {
            return typeof traverse(obj,path) === 'object';
        },

        /**
         *
         *
         * @param obj
         * @param path
         * @returns {boolean}
         */
        isString : function(path) {
            return typeof traverse(obj,path) === 'string';
        },

        /**
         *
         *
         * @param obj
         * @param path
         * @returns {boolean}
         */
        isNumber : function(path) {
            return typeof traverse(obj,path) === 'number';
        }

    };

};



module.exports  = traverseApi;