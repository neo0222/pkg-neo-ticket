import axios from "axios";
import { Session } from "../../domain/model/session/Session";
import { ICrawlingInvoker } from "../../gateway/ICrawlingInvoker";
import { CommonUtil } from "../../util/CommonUtil";
import htmlToJson from "html-to-json";

export class CrawlingInvoker implements ICrawlingInvoker {
  async getSession(): Promise<Session> {
    const topPageRes = await axios.get(
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

  async getYearAndMonthList(session: Session): Promise<string[]> {
    await axios.post(
      `https://tickets.shiki.jp/ticket/RY101002.do?koenCode=1011&edaban=00&koenKi=6&allJapan=0`,
      {},
      {
        headers: session.headersForPost,
      })
    console.log(`[SUCCESS]selected performance.`)
  
    const selectDatePageRes = await axios.post(
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

  async getAvailabledatetimeList(): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async getAvailableSeatList(): Promise<void> {
    throw new Error("Method not implemented.");
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

}