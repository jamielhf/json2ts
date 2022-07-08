'use strict';

function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

var parser = require('@babel/parser');

var traverse = require('@babel/traverse');

var generator = require('@babel/generator');

var t = require('@babel/types');

function _interopDefaultLegacy(e) {
  return e && _typeof(e) === 'object' && 'default' in e ? e : {
    'default': e
  };
}

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);

  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function get() {
            return e[k];
          }
        });
      }
    });
  }

  n["default"] = e;
  return Object.freeze(n);
}

var parser__default = /*#__PURE__*/_interopDefaultLegacy(parser);

var traverse__default = /*#__PURE__*/_interopDefaultLegacy(traverse);

var generator__default = /*#__PURE__*/_interopDefaultLegacy(generator);

var t__namespace = /*#__PURE__*/_interopNamespace(t);

function baseTypeToTs(type) {
  var tsType;

  switch (type) {
    case "StringLiteral":
      tsType = t__namespace.tsStringKeyword();
      break;

    case "NullLiteral":
      tsType = t__namespace.tsNullKeyword();
      break;

    case "BooleanLiteral":
      tsType = t__namespace.tsBooleanKeyword();
      break;

    case "NumericLiteral":
      tsType = t__namespace.tsNumberKeyword();
      break;

    default:
      tsType = t__namespace.tsStringKeyword();
      break;
  }

  return tsType;
}

function toUpperCase(s) {
  return s.replace(/([a-z])/, function (p1) {
    return p1.toUpperCase();
  });
}

var content;
var mapComment;

function handleObjectExpression(node) {
  var arr = [];
  node.properties.forEach(function (itemNode) {
    var nodeName;

    if (t__namespace.isIdentifier(itemNode.key)) {
      nodeName = itemNode.key.name;
    } else if (t__namespace.isStringLiteral(itemNode.key)) {
      nodeName = itemNode.key.value;
    }

    if (t__namespace.isIdentifier(itemNode.key) || t__namespace.isStringLiteral(itemNode.key)) {
      var tsNode;

      if (t__namespace.isLiteral(itemNode.value)) {
        tsNode = t__namespace.tsPropertySignature(t__namespace.identifier(nodeName), t__namespace.tsTypeAnnotation(baseTypeToTs(itemNode.value.type)));
      } else if (t__namespace.isArrayExpression(itemNode.value)) {
        tsNode = handleArrayExpression(nodeName, itemNode.value);
      } else if (t__namespace.isObjectExpression(itemNode.value)) {
        var upperCase = toUpperCase(nodeName);
        tsNode = t__namespace.tsPropertySignature(t__namespace.identifier(nodeName), t__namespace.tsTypeAnnotation(t__namespace.tsTypeReference(t__namespace.identifier(upperCase))));
        var nArr = handleObjectExpression(itemNode.value);
        var objNode = t__namespace.exportNamedDeclaration(t__namespace.tsInterfaceDeclaration(t__namespace.identifier(upperCase), null, null, t__namespace.tsInterfaceBody(nArr)));
        content.push(objNode);
      }

      addComment(itemNode, tsNode);
      arr.push(tsNode);
    }
  });
  return arr;
}

function handleArrayExpression(name, node) {
  var set = /* @__PURE__ */new Set();
  node.elements.forEach(function (item) {
    if (t__namespace.isLiteral(item)) {
      set.add(baseTypeToTs(item.type));
    } else if (t__namespace.isObjectExpression(item)) {
      var tsName = toUpperCase(name);
      set.add(t__namespace.tsTypeReference(t__namespace.identifier(tsName)));
      var arr = handleObjectExpression(item);
      content.push(t__namespace.exportNamedDeclaration(t__namespace.tsInterfaceDeclaration(t__namespace.identifier(tsName), null, null, t__namespace.tsInterfaceBody(arr))));
    }
  });
  var typeArr = Array.from(set);
  return t__namespace.tsPropertySignature(t__namespace.identifier(name), t__namespace.tsTypeAnnotation(t__namespace.tsArrayType(typeArr.length > 1 ? t__namespace.tsUnionType(typeArr) : typeArr[0])));
}

function addComment(node, targetNode) {
  if (mapComment.has(node.loc.start.line)) {
    t__namespace.addComment(targetNode, "leading", "* ".concat(mapComment.get(node.loc.start.line), " "));
  }
}

function transform(ast, name) {
  content = [];
  mapComment = /* @__PURE__ */new Map();
  traverse__default["default"](ast, {
    enter: function enter(path) {
      if (t__namespace.isFile(path.container)) {
        path.container.comments.forEach(function (item) {
          mapComment.set(item.loc.start.line, item.value);
        });
      }
    },
    ObjectExpression: function ObjectExpression(path) {
      var arr = handleObjectExpression(path.node);
      var RootObject = t__namespace.exportNamedDeclaration(t__namespace.tsInterfaceDeclaration(t__namespace.identifier("RootObject"), null, null, t__namespace.tsInterfaceBody(arr)));
      content.push(RootObject);
      path.skip();
    }
  });
  var program = t__namespace.program([t__namespace.exportNamedDeclaration(t__namespace.tsModuleDeclaration(t__namespace.identifier(name), t__namespace.tSModuleBlock(content)))]);
  var newNode = t__namespace.file(program);
  return generator__default["default"](newNode).code.replace(new RegExp("(?<=[\\r\\n])[\\r\\n]", "g"), "");
}

function jsonString2Ts(content, _ref) {
  var _ref$name = _ref.name,
      name = _ref$name === void 0 ? "namespace" : _ref$name;
  content = "var a =" + content;
  var ast = parser__default["default"].parse(content);
  return transform(ast, name);
}

module.exports = jsonString2Ts;
