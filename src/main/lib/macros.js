var burrito, cs, define, fs, macros, process, register, remove;

burrito = require('burrito');

fs = require('fs');

macros = {};

define = function(name, fn) {
  return macros[name] = fn;
};

remove = function(name) {
  return delete macros[name];
};

process = function(code, filename) {
  if (!((macros != null) && Object.keys(macros).length > 0)) {
    return code;
  }
  return burrito(code, function(node) {
    var arg, args, macro, out;
    if ((filename != null) && (node.start != null)) {
      node.start.filename = filename;
    }
    if (node.name === 'call' && (macros[node.start.value] != null)) {
      args = (function() {
        var i, len, ref, results;
        ref = node.value[1];
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          arg = ref[i];
          results.push(arg[arg.length - 1]);
        }
        return results;
      })();
      out = macros[node.start.value](...args, node.start);
      if (out != null) {
        return node.wrap(out);
      }
    } else if ((node.start != null) && node.start.comments_before.length > 0) {
      args = (function() {
        var i, len, ref, results;
        ref = node.start.comments_before;
        results = [];
        for (i = 0, len = ref.length; i < len; i++) {
          arg = ref[i];
          results.push(arg.value);
        }
        return results;
      })();
      if (args.length === 1) {
        macro = macros['//'];
        if (macro != null) {
          out = macro(args[0], node.start);
        }
      } else {
        macro = macros['/*'];
        if (macro != null) {
          out = macro(args, node.start);
        }
      }
      if (out != null) {
        return node.wrap(`${out}\r\n%s;`);
      }
    }
  });
};


module.exports = {
  define: define,
  remove: remove,
  process: process,
  macros: macros
};
