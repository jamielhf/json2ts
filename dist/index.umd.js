function _typeof(obj) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) { return typeof obj; } : function (obj) { return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }, _typeof(obj); }

(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "@babel/parser", "@babel/traverse", "@babel/generator", "@babel/types"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("@babel/parser"), require("@babel/traverse"), require("@babel/generator"), require("@babel/types"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.parser, global.traverse, global.generator, global.types);
    global.json2ts = mod.exports;
  }
})(typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : this, function (_exports, _parser, _traverse, _generator, t) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports["default"] = jsonString2Ts;
  _parser = _interopRequireDefault(_parser);
  _traverse = _interopRequireDefault(_traverse);
  _generator = _interopRequireDefault(_generator);
  t = _interopRequireWildcard(t);

  function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

  function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

  function baseTypeToTs(type) {
    var tsType;

    switch (type) {
      case "StringLiteral":
        tsType = t.tsStringKeyword();
        break;

      case "NullLiteral":
        tsType = t.tsNullKeyword();
        break;

      case "BooleanLiteral":
        tsType = t.tsBooleanKeyword();
        break;

      case "NumericLiteral":
        tsType = t.tsNumberKeyword();
        break;

      default:
        tsType = t.tsStringKeyword();
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

      if (t.isIdentifier(itemNode.key)) {
        nodeName = itemNode.key.name;
      } else if (t.isStringLiteral(itemNode.key)) {
        nodeName = itemNode.key.value;
      }

      if (t.isIdentifier(itemNode.key) || t.isStringLiteral(itemNode.key)) {
        var tsNode;

        if (t.isLiteral(itemNode.value)) {
          tsNode = t.tsPropertySignature(t.identifier(nodeName), t.tsTypeAnnotation(baseTypeToTs(itemNode.value.type)));
        } else if (t.isArrayExpression(itemNode.value)) {
          tsNode = handleArrayExpression(nodeName, itemNode.value);
        } else if (t.isObjectExpression(itemNode.value)) {
          var upperCase = toUpperCase(nodeName);
          tsNode = t.tsPropertySignature(t.identifier(nodeName), t.tsTypeAnnotation(t.tsTypeReference(t.identifier(upperCase))));
          var nArr = handleObjectExpression(itemNode.value);
          var objNode = t.exportNamedDeclaration(t.tsInterfaceDeclaration(t.identifier(upperCase), null, null, t.tsInterfaceBody(nArr)));
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
      if (t.isLiteral(item)) {
        set.add(baseTypeToTs(item.type));
      } else if (t.isObjectExpression(item)) {
        var tsName = toUpperCase(name);
        set.add(t.tsTypeReference(t.identifier(tsName)));
        var arr = handleObjectExpression(item);
        content.push(t.exportNamedDeclaration(t.tsInterfaceDeclaration(t.identifier(tsName), null, null, t.tsInterfaceBody(arr))));
      }
    });
    var typeArr = Array.from(set);
    return t.tsPropertySignature(t.identifier(name), t.tsTypeAnnotation(t.tsArrayType(typeArr.length > 1 ? t.tsUnionType(typeArr) : typeArr[0])));
  }

  function addComment(node, targetNode) {
    if (mapComment.has(node.loc.start.line)) {
      t.addComment(targetNode, "leading", "* ".concat(mapComment.get(node.loc.start.line), " "));
    }
  }

  function transform(ast, name) {
    content = [];
    mapComment = /* @__PURE__ */new Map();
    (0, _traverse["default"])(ast, {
      enter: function enter(path) {
        if (t.isFile(path.container)) {
          path.container.comments.forEach(function (item) {
            mapComment.set(item.loc.start.line, item.value);
          });
        }
      },
      ObjectExpression: function ObjectExpression(path) {
        var arr = handleObjectExpression(path.node);
        var RootObject = t.exportNamedDeclaration(t.tsInterfaceDeclaration(t.identifier("RootObject"), null, null, t.tsInterfaceBody(arr)));
        content.push(RootObject);
        path.skip();
      }
    });
    var program = t.program([t.exportNamedDeclaration(t.tsModuleDeclaration(t.identifier(name), t.tSModuleBlock(content)))]);
    var newNode = t.file(program);
    return (0, _generator["default"])(newNode).code.replace(new RegExp("(?<=[\\r\\n])[\\r\\n]", "g"), "");
  }

  function jsonString2Ts(content, _ref) {
    var _ref$name = _ref.name,
        name = _ref$name === void 0 ? "namespace" : _ref$name;
    content = "var a =" + content;

    var ast = _parser["default"].parse(content);

    return transform(ast, name);
  }
});
