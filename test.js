const jsonStringToTs = require("./src/index.js");

console.log(
  jsonStringToTs(
    '{\n    "code": 200,\n    "message": "成功",\n    "data": {\n        "iDataType":1, //1-信息数据，2-开播数据，3-营收数据，4-用户数据\n        "iTotal":100, //总记录数\n        "vData": [\n            {\n                "sdate": "2021-01-19", //日期 可以看做是横坐标\n                "luid": 123456, //主播uid\n                "snick": "主播昵称", //主播昵称\n                "shuyaId": "544554548",//主播虎牙号\n                "lroomId": 251974090,//房间号\n                "sdata":{\n                    //iDataType=1时 信息\n                    "subscribeCnt": 100, //订阅总数\n                    "fansbadgeCnt": 100, //粉丝徽章数\n                    "signPercent": 100, //签约比例\n                    "binOfficialSign": 1, //是否官签，0-否，1-是\n                    "binDepositCommission": 0, //是否托管佣金，0-否，1-是\n                    "binCollectionCooperationFee": 1, //是否托收合作费用，0-否，1-是\n                    //iDataType=2时 开播\n                    "liveCnt": 100, //开播天数\n                    "validLiveCnt": 100, //有效开播天数\n                    "liveDuration": 100, //开播时长，单位：秒\n                    //iDataType=3时 营收\n                    "consumeAmount": 100, //总流水\n                    "consumeUcnt": 100, //付费用户数\n                    "giftConsumeAmount": 100, //礼物流水（元）\n                    //iDataType=4时用户\n                    "dau": 100, //观看人数\n                    "fiveMinDau": 100, //五分钟观看用户数\n                    "mcDau": 100, //移动端观看人数\n                    "webDau": 100, //web端观看人数\n                    "pcDau": 100, //pc端观看人数\n                    "acu": 100, //平均人气\n                    "pcu": 100, //峰值人气\n                    "newDau": 100, //新用户数\n                    "watchDuration": 100, //总观看时长，单位：秒\n                }\n            }\n        ]\n    }\n}',
    {
      name: "test3233",
    }
  )
);
