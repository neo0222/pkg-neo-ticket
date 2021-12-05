import axios from "axios";
import { Session } from "../../domain/model/session/Session";
import { ICrawlingInvoker } from "../../gateway/ICrawlingInvoker";
import { CommonUtil } from "../../util/CommonUtil";
import htmlToJson from "html-to-json";
import { PerformanceDate } from "../../domain/value/performance/PerformanceDate";
import { PerformanceStartTime } from "../../domain/value/performance/PerformanceStartTime";
import { MatineeOrSoiree } from "../../domain/value/performance/MatineeOrSoiree";
import { PerformanceDatetimeInfo } from "../../domain/value/performance/PerformanceDatetimeInfo";
import { PerformanceDatetimeInfoList } from "../../domain/value/performance/PerformanceDatetimeInfoList";
import { VacantSeatInfoList } from "../../domain/value/seat/VacantSeatInfoList";
import { VacantSeatInfo } from "../../domain/value/seat/VacantSeatInfo";
import * as parser from 'fast-xml-parser'
import { PerformanceCode } from "../../domain/value/performance/PerformanceCode";

const floorAndRowMapping = {
  '1': [
    '1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22',
  ],
  '2': [
    '1','2','3','4','5','6',' ',
    '7','8','9','10','11'
  ]
} // TODO: 劇場によって変わる

const columnMapping = [
  '1','2','3','4','5','6','7','8','9','10','11','12','13',' ',
  '14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29',' ',
  '30','31','32','33','34','35','36','37','38','39','40','41','42',
] // TODO: 劇場によって変わる

const axiosInstance = axios.create({ timeout: 20000 })

export class CrawlingInvoker implements ICrawlingInvoker {
  async getSession(): Promise<Session> {
    const topPageRes = await axiosInstance.get(
      'https://entrance.shiki.jp/ticket/top.do'
    )
    console.log(`[SUCCESS]moved to performance select page.`)
  
    const skSession = topPageRes.headers['set-cookie'][0].replace(/\;.*/, '').replace(/SKSESSION=/, '')
    const jSessionId = topPageRes.headers['set-cookie'][2].replace(/\;.*/, '').replace(/JSESSIONID=/, '')
    const bigIpKeyValueJoinWithEqual = topPageRes.headers['set-cookie'][3].replace(/\;.*/, '')
    console.log(`[SUCCESS]got Cookies. SKSESSION: ${skSession}, JSESSIONID: ${jSessionId}, ${bigIpKeyValueJoinWithEqual}`)
  
    const headersForPost = this.createHeadersForPost(skSession,
      jSessionId,
      bigIpKeyValueJoinWithEqual,
      'https://tickets.shiki.jp/ticket/RY104004.do')
    
    const headersForHtml = this.createHeadersForHtml(skSession,
      jSessionId,
      bigIpKeyValueJoinWithEqual,
      'https://tickets.shiki.jp/ticket/RY104004.do')
  
    await CommonUtil.sleep(1)
  
    return { skSession, bigIpKeyValueJoinWithEqual, headersForPost, headersForHtml }
  }

  async getYearAndMonthList(session: Session, performanceCode: PerformanceCode, koenKi: string): Promise<string[]> {
    await axiosInstance.post(
      `https://tickets.shiki.jp/ticket/RY101002.do?koenCode=${performanceCode}&edaban=00&koenKi=${koenKi}&allJapan=0`,
      {},
      {
        headers: session.headersForPost,
      })
    console.log(`[SUCCESS]selected performance.`)
  
    const selectDatePageRes = await axiosInstance.post(
      'https://tickets.shiki.jp/ticket/RY101003.do?alctChange=0',
      {},
      {
        headers: session.headersForHtml,
      }
    )
    console.log(`[SUCCESS]moved to date select page.`)
    const yyyyMmSelectPromise = await htmlToJson.parse(selectDatePageRes.data, {
      'yyyyMmList': function ($doc): string[] {
        const children = $doc.find('#selectYyyymm')[0].children
        return children.filter(child => child.name === 'option').map(option => option.attribs.value)
      }
    })
    console.log(yyyyMmSelectPromise.yyyyMmList)
  
    CommonUtil.sleep(1)
  
    return yyyyMmSelectPromise.yyyyMmList
  }

  async getAvailabledatetimeList(session: Session, yyyymm: string, performanceCode: PerformanceCode, koenKi: string): Promise<PerformanceDatetimeInfoList> {
    await axiosInstance.post(
      `https://tickets.shiki.jp/ticket/RY101002.do?koenCode=${performanceCode}&edaban=00&koenKi=${koenKi}&allJapan=0`,
      {},
      {
        headers: session.headersForPost,
      })
    console.log(`[SUCCESS]selected performance.`)
  
    await axiosInstance.post(
      'https://tickets.shiki.jp/ticket/RY101003.do?alctChange=0',
      {},
      {
        headers: session.headersForHtml,
      }
    )
    console.log(`[SUCCESS]moved to date select page.`)

    await axiosInstance.post(
      `https://tickets.shiki.jp/ticket/RY104005.do?alctChange=0&yyyymm=${yyyymm}`,
      {},
      {
        headers: this.changeReferer(session.headersForPost, 'https://tickets.shiki.jp/ticket/RY101003.do'),
      })
    console.log(`[SUCCESS]selected yyyymm. ${yyyymm}`)
  
    const selectYyyyMmPageRes = await axiosInstance.post(
      `https://tickets.shiki.jp/ticket/RY104005.do?alctChange=0&yyyymm=${yyyymm}`,
      {},
      {
        headers: this.changeReferer(session.headersForHtml, 'https://tickets.shiki.jp/ticket/RY101003.do'),
      }
    )
    console.log(`[SUCCESS]moved to date select page on ${yyyymm}.`)

    console.log(`[START]collect avaiable datetime...`)
    const promise = await htmlToJson.parse(selectYyyyMmPageRes.data, {
      'a': function ($doc): PerformanceDatetimeInfoList {
        const nowYYYYMM = $doc.find('#nowYyyymm')[0].attribs.value
        const availableDatetimeList: PerformanceDatetimeInfo[] = []
        for (let i = 0; i < $doc.find('a').length; i++) {
          if (!!$doc.find('a')[i].attribs.class && $doc.find('a')[i].attribs.class.includes('time')) {
            const startTime = $doc.find('a')[i].children[0].data.replace('\r\n', '').replace('                                                                    ', '')
            const morOrAft = $doc.find('a')[i].parent.attribs.class
            let dayNumber
            let matineeOrSoiree: MatineeOrSoiree
            if (morOrAft === 'mor') {
              dayNumber = Number($doc.find('a')[i].parent.parent.prev.prev.children[1].children[0].data)
              matineeOrSoiree = MatineeOrSoiree.MATINEE
            } else {
              dayNumber = Number($doc.find('a')[i].parent.parent.prev.prev.prev.prev.children[1].children[0].data)
              matineeOrSoiree = MatineeOrSoiree.SOIREE
            }
            const formattedDay = dayNumber < 10 ? `0${dayNumber}` : `${dayNumber}`
            availableDatetimeList.push(PerformanceDatetimeInfo.create({
              day: `${nowYYYYMM}${formattedDay}`,
              startTime,
              matineeOrSoiree,
            }))
          }
        }
        return PerformanceDatetimeInfoList.create({
          list: availableDatetimeList
        });
      }
    })
    console.log(`[SUCCESS]collected available datetime. available datetime: ${JSON.stringify(promise.a)}`)

    await CommonUtil.sleep(1)

    return promise.a
  }

  async getAvailableSeatSvg(session: Session, yyyymm: string, availableDatetime: PerformanceDatetimeInfo): Promise<string> {
    const selectDateRes = await axiosInstance.post(
      `https://tickets.shiki.jp/ticket/RY104003.do?alctChange=0&koenDay=${availableDatetime.day}&tuyaKbn=${availableDatetime.matineeOrSoiree}`,
      {},
      {
        headers: this.changeReferer(session.headersForPost, `https://tickets.shiki.jp/ticket/${yyyymm ? 'RY108005.do' : 'RY101003.do'}`),
      })
    console.log(`[SUCCESS]selected date. target: ${JSON.stringify(availableDatetime)}`)
  
    if (selectDateRes.data.exceptionMsgCd) {
      console.log(selectDateRes.data)
    }
  
    const selectSeatPageRes = await axiosInstance.post(
      'https://tickets.shiki.jp/ticket/RY104006.do?alctChange=0',
      {},
      {
        headers: this.changeReferer(session.headersForHtml, 'https://tickets.shiki.jp/ticket/RY101003.do'),
      }
    )
    console.log(`[SUCCESS]moved to seat select page.`)
    console.log(`[START]collecting available seat...`)

    const promise = await htmlToJson.parse(selectSeatPageRes.data, {
      'svg': function ($doc) {
        for (let i = 0; i < $doc.find('object').length; i++) {
          if ($doc.find('object')[i].attribs.type === 'image/svg+xml') {
            return $doc.find('object')[i].attribs.data
          }
        }
      }
    })

    const getSvgRes = await axiosInstance.get(
      `https://tickets.shiki.jp${promise.svg}`,
      {
        headers: this.createHeadersForSvg(session.skSession, session.bigIpKeyValueJoinWithEqual),
      }
    )

    console.log(`[SUCCESS]got svg file. URL: https://tickets.shiki.jp${promise.svg}`)

    return getSvgRes.data
  }

  async getAvailableSeatList(svgData: string): Promise<VacantSeatInfoList> {
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

    const tObj = parser.getTraversalObj(svgData, options)
    const jsonObj = parser.convertToJson(tObj,options)
    const seatList: VacantSeatInfo[] = []
    jsonObj.svg.g[1].g.filter(seat => {
      return ['color01', 'color02'].includes(seat.circle.attr['@_class'])
    }).forEach(seat => {
      const [ , floor, row, column, ] = seat.attr['@_id'].split('-')
      seatList.push(VacantSeatInfo.create({
        floor,
        row: floorAndRowMapping[floor][row],
        column: columnMapping[column],
      }))
    });
    console.log(`[SUCCESS]collected available seat. count: ${seatList.length}`)

    return VacantSeatInfoList.create({
      list: seatList,
    })
  }

  createHeadersForPost(skSession, jSessionId, bigIpKeyValueJoinWithEqual, referer) {
    return {
      'Host': 'tickets.shiki.jp',
      'sec-ch-ua': '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
      'Accept': 'application/json, text/javascript, */*; q=0.01',
      'X-Requested-With': 'XMLHttpRequest',
      'sec-ch-ua-mobile': '?0',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'Origin': 'https://tickets.shiki.jp',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Dest': 'empty',
      'Referer': `${referer}`,
      'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
      'Cookie': `JSESSIONID=${jSessionId}; messagesUtk=dad66ddf6d594140b54cbbe4678eef55; Device=PC; CORPFLG=0; EnglishFlg=0; ${bigIpKeyValueJoinWithEqual}; _gcl_au=1.1.917971311.1631708291; _ts_yjad=1631708290847; _ga=GA1.3.1559874281.1631708291; _gid=GA1.3.1993766697.1631708291; __lt__cid=38e8cc09-742e-4538-9c6c-bc49fee5feb4; __pp_uid=SHFtpAIkqmxTX88JrIoENmmmbOPMstvo; _fbp=fb.1.1631708292261.768616441; __lt__sid=246715d5-cf6e8b95; _gat_UA-17291882-2=1; SKSESSION=${skSession}`,
    }
  }
  
  createHeadersForHtml(skSession, jSessionId, bigIpKeyValueJoinWithEqual, referer) {
    return {
      'Host': 'tickets.shiki.jp',
      'Cache-Control': 'max-age=0',
      'sec-ch-ua': '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
      'sec-ch-ua-mobile': '?0',
      'Upgrade-Insecure-Requests': '1',
      'Origin': 'https://tickets.shiki.jp',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-User': '?1',
      'Sec-Fetch-Dest': 'document',
      'Referer': 'https://tickets.shiki.jp/ticket/RY104004.do',
      'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
      'Cookie': `JSESSIONID=${jSessionId}; messagesUtk=dad66ddf6d594140b54cbbe4678eef55; Device=PC; CORPFLG=0; EnglishFlg=0; ${bigIpKeyValueJoinWithEqual}; _gcl_au=1.1.917971311.1631708291; _ts_yjad=1631708290847; _ga=GA1.3.1559874281.1631708291; _gid=GA1.3.1993766697.1631708291; __lt__cid=38e8cc09-742e-4538-9c6c-bc49fee5feb4; __pp_uid=SHFtpAIkqmxTX88JrIoENmmmbOPMstvo; _fbp=fb.1.1631708292261.768616441; __lt__sid=246715d5-cf6e8b95; _gat_UA-17291882-2=1; SKSESSION=${skSession}`,
    }
  }
  
  createHeadersForSvg(skSession, bigIpKeyValueJoinWithEqual) {
    return {
      'Host': 'tickets.shiki.jp',
      'sec-ch-ua': '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
      'sec-ch-ua-mobile': '?0',
      'Upgrade-Insecure-Requests': '1',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'Sec-Fetch-Site': 'same-origin',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Dest': 'object',
      'Referer': 'https://tickets.shiki.jp/ticket/RY104006.do',
      'Accept-Language': 'ja,en-US;q=0.9,en;q=0.8',
      'Cookie': `messagesUtk=dad66ddf6d594140b54cbbe4678eef55; Device=PC; CORPFLG=0; EnglishFlg=0; ${bigIpKeyValueJoinWithEqual}; _gcl_au=1.1.917971311.1631708291; _ts_yjad=1631708290847; _ga=GA1.3.1559874281.1631708291; _gid=GA1.3.1993766697.1631708291; __lt__cid=38e8cc09-742e-4538-9c6c-bc49fee5feb4; __pp_uid=SHFtpAIkqmxTX88JrIoENmmmbOPMstvo; _fbp=fb.1.1631708292261.768616441; __lt__sid=246715d5-cf6e8b95; _gat_UA-17291882-2=1; SKSESSION=${skSession}`,
    }
  }

  changeReferer(headers, newReferer) {
    headers.Referer = newReferer
    return headers
  }

}