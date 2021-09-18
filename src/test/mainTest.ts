import moment from 'moment';
import * as assert from 'power-assert';
import * as parser from 'fast-xml-parser'
import * as fs from 'fs'
describe('初回', async () => {
  it('test', async () => {
    assert.equal(moment('2021-09-18T09:05:49Z', 'YYYY-MM-DDTHH:mm:ssZ').format('YYYYMMDDHHmmss'), '20210918180549')
  })
})

describe('XMLパース', async () => {
  it('正常系', async () => {
    const options: parser.X2jOptionsOptional = {
      attributeNamePrefix : "@_",
      attrNodeName: "attr", //default is 'false'
      textNodeName : "#text",
      ignoreAttributes : false,
      ignoreNameSpace : false,
      allowBooleanAttributes : false,
      parseNodeValue : true,
      parseAttributeValue : true,
      trimValues: true,
      cdataTagName: "__cdata", //default is 'false'
      cdataPositionChar: "\\c",
      parseTrueNumberOnly: false,
      arrayMode: false, //"strict"
      stopNodes: ["parse-me-as-string"]
    }
    const xmlStr = fs.readFileSync( 'src/test/crawling/svg.xml', 'utf-8' )
    const tObj = parser.getTraversalObj(xmlStr, options)
    const jsonObj = parser.convertToJson(tObj,options)
    fs.writeFileSync(`src/test/crawling/converted.json`, JSON.stringify(
      jsonObj,
      null,
      2)
    );
    assert.deepEqual(jsonObj, fs.readFileSync( 'src/test/crawling/svg.xml', 'utf-8' ))
  })
})

describe('ファイル名から日付取得', async () => {
  it('正常系', async () => {
    assert.equal('20210919091832.txt'.replace(/\..*/, ''), '20210919091832')
  })
})