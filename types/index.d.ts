/**
 *
 * @param content 字符串内容
 * @param param.name namespace名称
 * @returns
 */
declare function jsonString2Ts(content: string, opt?: {
    name: string;
}): any;

export { jsonString2Ts as default };
