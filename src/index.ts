import parser from "@babel/parser";
import transform from "./traverse";

/**
 *
 * @param content 字符串内容
 * @param param.name namespace名称
 * @returns
 */
function jsonString2Ts(
  content: string,
  opt: {
    name: string;
  } = { name: "namespace" }
) {
  content = "var a =" + content;
  const ast = parser.parse(content);
  return transform(ast, opt.name);
}

export default jsonString2Ts;
