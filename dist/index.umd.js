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

  function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

  function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

  function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

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

  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;

  var __defNormalProp = function __defNormalProp(obj, key, value) {
    return key in obj ? __defProp(obj, key, {
      enumerable: true,
      configurable: true,
      writable: true,
      value: value
    }) : obj[key] = value;
  };

  var __spreadValues = function __spreadValues(a, b) {
    for (var prop in b || (b = {})) {
      if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
    }

    if (__getOwnPropSymbols) {
      var _iterator = _createForOfIteratorHelper(__getOwnPropSymbols(b)),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var prop = _step.value;
          if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }

    return a;
  };

  var __spreadProps = function __spreadProps(a, b) {
    return __defProps(a, __getOwnPropDescs(b));
  };

  var content;
  var mapComment;

  function handleObjectExpression(node) {
    var parentNodeName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
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
          var arrayNode = handleArrayExpression(nodeName, itemNode.value);
          tsNode = t.tsPropertySignature(t.identifier(nodeName), t.tsTypeAnnotation(arrayNode));
        } else if (t.isObjectExpression(itemNode.value)) {
          console.log("nodeName", nodeName);
          var upperCase = parentNodeName + toUpperCase(nodeName);
          tsNode = t.tsPropertySignature(t.identifier(nodeName), t.tsTypeAnnotation(t.tsTypeReference(t.identifier(upperCase))));
          var nArr = handleObjectExpression(itemNode.value, upperCase);
          var objNode = t.exportNamedDeclaration(t.tsInterfaceDeclaration(t.identifier(upperCase), null, null, t.tsInterfaceBody(nArr)));

          if (content.has(upperCase)) {
            content.set(upperCase, content.get(upperCase));
          } else {
            content.set(upperCase, objNode);
          }
        }

        addComment(itemNode, tsNode);
        arr.push(tsNode);
      }
    });
    return arr;
  }

  function handleArrayExpression(name, node) {
    var nameMap = /* @__PURE__ */new Map();
    node.elements.forEach(function (item) {
      if (t.isLiteral(item)) {
        nameMap.set(item.type, baseTypeToTs(item.type));
      } else if (t.isObjectExpression(item)) {
        var tsName = toUpperCase(name);
        nameMap.set(tsName, t.tsTypeReference(t.identifier(tsName)));
        var arr = handleObjectExpression(item);
        var tNode = t.exportNamedDeclaration(t.tsInterfaceDeclaration(t.identifier(tsName), null, null, t.tsInterfaceBody(arr)));

        if (content.has(tsName)) {
          var node2 = content.get(tsName);
          var body = node2.declaration.body.body;
          var map = /* @__PURE__ */new Map();
          body.forEach(function (item2) {
            item2.optional = true;
            map.set(item2.key.name, item2);
          });
          arr.forEach(function (item2) {
            if (map.has(item2.key.name)) {
              map.set(item2.key.name, __spreadProps(__spreadValues({}, map.get(item2.key.name)), {
                optional: false
              }));
            } else {
              item2.optional = true;
              map.set(item2.key.name, item2);
            }
          });
          var newBody = [];
          map.forEach(function (val) {
            newBody.push(val);
          });
          node2.declaration.body.body = newBody;
          content.set(tsName, node2);
        } else {
          content.set(tsName, tNode);
        }
      } else if (t.isArrayExpression(item)) {
        var arrayNode = handleArrayExpression(name, item);
        nameMap.set("ArrayExpression", arrayNode);
      }
    });
    var typeArr = [];
    nameMap.forEach(function (item) {
      typeArr.push(item);
    });

    if (typeArr.length === 0) {
      typeArr.push(t.tsUnknownKeyword());
    }

    return t.tsArrayType(typeArr.length > 1 ? t.tsUnionType(typeArr) : typeArr[0]);
  }

  function addComment(node, targetNode) {
    if (mapComment.has(node.loc.start.line)) {
      t.addComment(targetNode, "leading", "* ".concat(mapComment.get(node.loc.start.line), " "));
    }
  }

  function transform(ast, name) {
    content = /* @__PURE__ */new Map();
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
        content.set("RootObject", RootObject);
        path.skip();
      }
    });
    var contentArr = [];
    content.forEach(function (item) {
      contentArr.push(item);
    });
    var program = t.program([t.exportNamedDeclaration(t.tsModuleDeclaration(t.identifier(name), t.tSModuleBlock(contentArr)))]);
    var newNode = t.file(program);
    return (0, _generator["default"])(newNode).code.replace(new RegExp("(?<=[\\r\\n])[\\r\\n]", "g"), "");
  }

  function jsonString2Ts(content) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
      name: "namespace"
    };
    content = "var a =" + content;

    var ast = _parser["default"].parse(content);

    return transform(ast, opt.name);
  }
});
