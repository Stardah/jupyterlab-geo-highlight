// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE
import * as CodeMirror from 'codemirror';
import 'codemirror/addon/mode/simple';

// "use strict";

var commonAtoms = ["-name", "-x", "-y", "-zoom", "-map", "-layer", "-link", "-v", "-layerId"];
var atoms_str = '(' + commonAtoms.join('|') + ')\\b';

var commonKeywords = ["create", "show", "delete", "update", "login", "register",
  "gdalinfo", "gdal_translate","gdalwarp", "algebra", "convolution"];
var keywords_str = '(' + commonKeywords.join('|') + ')\\b';

var commonCommands = ["layer", "map"];
var builtins_str = '(' + commonCommands.join('|') + ')(?=\\()';

CodeMirror.defineSimpleMode("geo",{
  // The start state contains the rules that are intially used
  start: [
    // Comments
    {regex: /\/\/\/?.*$/, token: 'comment', sol: true},
    {regex: /(\s)\/\/\/?.*$/, token: 'comment'},
    {regex: /\s*\*.*$/, token: 'comment', sol: true},
    {regex: /\/\*/, token: 'comment', push: 'comments_block'},

    // Strings
    {regex: /"/, token: 'string', push: 'string_regular'},
    {regex: /`"/, token: 'string', push: 'string_compound'},

    // Macros
    {regex: /`/, token: 'variable-2', push: 'macro_local'},
    {regex: /\$/, token: 'variable-2', push: 'macro_global'},

    // Decimal Numbers
    {regex: /\b[+-]?(?:[0-9]+(?:\.[0-9]+)?|\.[0-9]+|\.)(?:[eE][+-]?[0-9]+)?[i]?\b/,
      token: 'number'},

    // Keywords
    // There are two separate dictionaries because the `\b` at the beginning of the regex seemed not to work. So instead, I either match the preceding space before the keyword or require the keyword to be at beginning of the string. I think this necessitates two different strings.
    {regex: new RegExp('\\s' + keywords_str), token: 'keyword'},
    {regex: new RegExp(keywords_str), token: 'keyword', sol: true},

    {regex: new RegExp('\\s' + builtins_str), token: 'def'},
    {regex: /\s\w+(?=\()/, token: 'def'},

    {regex: new RegExp('\\s' + atoms_str), token: 'atom'},

    {regex: /[\{]/, indent: true},
    {regex: /[\}]/, dedent: true},

    {regex: /-|==|<=|>=|<|>|&|!=/, token: 'operator'},
    {regex: /\*|\+|\^|\/|!|~|=|~=/, token: 'operator'},
  ],
  comments_block: [
    {regex: /\/\*/, token: 'comment', push: 'comments_block'},
    // this ends and restarts a comment block. but need to catch this so
    // that it doesn\'t start _another_ level of comment blocks
    {regex: /\*\/\*/, token: 'comment'},
    {regex: /(\*\/\s+\*(?!\/)[^\n]*)|(\*\/)/, token: 'comment', pop: true},
    // Match anything else as a character inside the comment
    {regex: /./, token: 'comment'},
  ],

  string_compound: [
    {regex: /`"/, token: 'string', push: 'string_compound'},
    {regex: /"'/, token: 'string', pop: true},
    {regex: /`/, token: 'variable-2', push: 'macro_local'},
    {regex: /\$/, token: 'variable-2', push: 'macro_global'},
    {regex: /./, token: 'string'}
  ],
  string_regular: [
    {regex: /"/, token: 'string', pop: true},
    {regex: /`/, token: 'variable-2', push: 'macro_local'},
    {regex: /\$/, token: 'variable-2', push: 'macro_global'},
    {regex: /./, token: 'string'}
  ],
  macro_local: [
    {regex: /`/, token: 'variable-2', push: 'macro_local'},
    {regex: /'/, token: 'variable-2', pop: true},
    {regex: /./, token: 'variable-2'},
  ],
  macro_global: [
    {regex: /\}/, token: 'variable-2', pop: true},
    {regex: /.(?=[^\w\{\}])/, token: 'variable-2', pop: true},
    {regex: /./, token: 'variable-2'},
  ],
  meta: {
    closeBrackets: {pairs: "()[]{}`'\"\""},
    dontIndentStates: ['comment'],
    electricInput: /^\s*\}$/,
    blockCommentStart: '/*',
    blockCommentEnd: '*/',
    lineComment: '//',
    fold: 'brace'
  }
});

CodeMirror.defineMIME('text/x-geo', 'geo');
CodeMirror.defineMIME('text/geo', 'geo');

CodeMirror.modeInfo.push({
  ext: ['geo'],
  mime: "text/x-geo",
  mode: 'geo',
  name: 'Geo'
});
