"use strict";
exports.__esModule = true;
var fs_1 = require("fs");
var DEFAULT_EXCLUDE_DIR = /^\./;
var DEFAULT_FILTER = /^([^\.].*)\.js(on)?$/;
var DEFAULT_RECURSIVE = true;
function requireAll(options) {
    var dirname = typeof options === 'string' ? options : options.dirname;
    var excludeDirs = DEFAULT_EXCLUDE_DIR;
    var filter = DEFAULT_FILTER;
    var modules = {};
    var recursive = DEFAULT_RECURSIVE;
    var resolve = identity;
    var map = identity;
    if (typeof options !== "string") {
        excludeDirs = options.excludeDirs === undefined ? DEFAULT_EXCLUDE_DIR : options.excludeDirs;
        filter = options.filter === undefined ? DEFAULT_FILTER : options.filter;
        recursive = options.recursive === undefined ? DEFAULT_RECURSIVE : options.recursive;
        resolve = options.resolve || identity;
        map = options.map || identity;
    }
    function excludeDirectory(dirname) {
        return !recursive ||
            (excludeDirs && dirname.match(excludeDirs));
    }
    function filterFile(filename) {
        if (typeof filter === 'function') {
            return filter(filename);
        }
        var match = filename.match(filter);
        if (!match)
            return;
        return match[1] || match[0];
    }
    var files = fs_1.readdirSync(dirname);
    files.forEach(function (file) {
        var filepath = dirname + '/' + file;
        if (fs_1.statSync(filepath).isDirectory()) {
            if (excludeDirectory(file))
                return;
            var subModules = requireAll({
                dirname: filepath,
                filter: filter,
                excludeDirs: excludeDirs,
                map: map,
                resolve: resolve
            });
            if (Object.keys(subModules).length === 0)
                return;
            modules[map(file, filepath)] = subModules;
        }
        else {
            var name = filterFile(file);
            if (!name)
                return;
            modules[map(name, filepath)] = resolve(require(filepath));
        }
    });
    return modules;
}
exports.requireAll = requireAll;
;
function identity(val) {
    return val;
}
