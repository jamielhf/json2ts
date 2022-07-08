import parser from '@babel/parser';
import traverse from '@babel/traverse';
import generator from '@babel/generator';
import * as t from '@babel/types';

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
  traverse(ast, {
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
  return generator(newNode).code.replace(new RegExp("(?<=[\\r\\n])[\\r\\n]", "g"), "");
}

function jsonString2Ts(content, _ref) {
  var _ref$name = _ref.name,
      name = _ref$name === void 0 ? "namespace" : _ref$name;
  content = "var a =" + content;
  var ast = parser.parse(content);
  return transform(ast, name);
}

export { jsonString2Ts as default };
