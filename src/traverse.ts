import traverse from "@babel/traverse";
import generator from "@babel/generator";
import * as t from "@babel/types";
import { baseTypeToTs, toUpperCase } from "./lib/utils";
let content;
let mapComment;

/**
 * 处理对象
 * @param node
 * @param parentNodeName 父级节点名
 * @returns
 */
function handleObjectExpression(node, parentNodeName: string = "") {
  const arr = [];
  node.properties.forEach((itemNode: t.ObjectProperty) => {
    let nodeName;
    if (t.isIdentifier(itemNode.key)) {
      nodeName = itemNode.key.name;
    } else if (t.isStringLiteral(itemNode.key)) {
      nodeName = itemNode.key.value;
    }

    if (t.isIdentifier(itemNode.key) || t.isStringLiteral(itemNode.key)) {
      let tsNode;
      // 基础类型
      if (t.isLiteral(itemNode.value)) {
        tsNode = t.tsPropertySignature(
          t.identifier(nodeName),
          t.tsTypeAnnotation(baseTypeToTs(itemNode.value.type))
        );
      } else if (t.isArrayExpression(itemNode.value)) {
        const arrayNode = handleArrayExpression(nodeName, itemNode.value);
        tsNode = t.tsPropertySignature(
          t.identifier(nodeName),
          t.tsTypeAnnotation(arrayNode)
        );
      } else if (t.isObjectExpression(itemNode.value)) {
        console.log("nodeName", nodeName);
        const upperCase = parentNodeName + toUpperCase(nodeName);
        tsNode = t.tsPropertySignature(
          t.identifier(nodeName),
          t.tsTypeAnnotation(t.tsTypeReference(t.identifier(upperCase)))
        );

        // 继续遍历obj
        const nArr = handleObjectExpression(itemNode.value, upperCase);
        const objNode = t.exportNamedDeclaration(
          t.tsInterfaceDeclaration(
            t.identifier(upperCase),
            null,
            null,
            t.tsInterfaceBody(nArr)
          )
        );

        if (content.has(upperCase)) {
          content.set(upperCase, content.get(upperCase));
        } else {
          content.set(upperCase, objNode);
        }
      }

      // 查看是否有注释并插入
      addComment(itemNode, tsNode);
      arr.push(tsNode);
    }
  });

  return arr;
}
/**
 * 处理数组
 * @param node
 */
function handleArrayExpression(name, node: t.ArrayExpression) {
  const nameMap = new Map<string, t.TSType>();
  node.elements.forEach((item) => {
    if (t.isLiteral(item)) {
      nameMap.set(item.type, baseTypeToTs(item.type));
    } else if (t.isObjectExpression(item)) {
      const tsName = toUpperCase(name);
      nameMap.set(tsName, t.tsTypeReference(t.identifier(tsName)));
      const arr = handleObjectExpression(item);
      let tNode = t.exportNamedDeclaration(
        t.tsInterfaceDeclaration(
          t.identifier(tsName),
          null,
          null,
          t.tsInterfaceBody(arr)
        )
      );
      if (content.has(tsName)) {
        let node = content.get(tsName);
        let body = node.declaration.body.body;
        let map = new Map();
        body.forEach((item) => {
          // 默认没必选
          item.optional = true;
          map.set(item.key.name, item);
        });
        arr.forEach((item) => {
          if (map.has(item.key.name)) {
            map.set(item.key.name, {
              ...map.get(item.key.name),
              optional: false,
            });
          } else {
            item.optional = true;
            map.set(item.key.name, item);
          }
        });
        let newBody = [];
        map.forEach((val) => {
          newBody.push(val);
        });
        node.declaration.body.body = newBody;
        content.set(tsName, node);
      } else {
        content.set(tsName, tNode);
      }
    } else if (t.isArrayExpression(item)) {
      const arrayNode = handleArrayExpression(name, item);
      nameMap.set("ArrayExpression", arrayNode);
    }
  });
  let typeArr = [];

  nameMap.forEach((item) => {
    typeArr.push(item);
  });
  if (typeArr.length === 0) {
    typeArr.push(t.tsUnknownKeyword());
  }
  return t.tsArrayType(
    typeArr.length > 1 ? t.tsUnionType(typeArr) : typeArr[0]
  );
}

// type a = string[][][]

/**
 * 添加注释 当前行 或者上一行有注释就加入
 * @param node
 * @param targetNode
 */
function addComment(node: t.Node, targetNode: t.Node) {
  if (mapComment.has(node.loc.start.line)) {
    t.addComment(
      targetNode,
      "leading",
      `* ${mapComment.get(node.loc.start.line)} `
    );
  }
}

export default function transform(ast, name: string) {
  content = new Map();
  mapComment = new Map();
  traverse(ast, {
    enter(path) {
      if (t.isFile(path.container)) {
        path.container.comments.forEach((item) => {
          mapComment.set(item.loc.start.line, item.value);
        });
      }
    },
    ObjectExpression(path) {
      const arr = handleObjectExpression(path.node);
      const RootObject = t.exportNamedDeclaration(
        t.tsInterfaceDeclaration(
          t.identifier("RootObject"),
          null,
          null,
          t.tsInterfaceBody(arr)
        )
      );
      content.set("RootObject", RootObject);
      path.skip();
    },
  });
  let contentArr = [];
  content.forEach((item) => {
    contentArr.push(item);
  });
  const program = t.program([
    t.exportNamedDeclaration(
      t.tsModuleDeclaration(t.identifier(name), t.tSModuleBlock(contentArr))
    ),
  ]);

  const newNode = t.file(program);

  return generator(newNode).code.replace(/(?<=[\r\n])[\r\n]/g, "");
}
