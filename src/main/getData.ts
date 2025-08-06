import axios from 'axios'
import * as cheerio from 'cheerio'

interface ItrafficInfo {
  today?: string
  last?: string
  left?: string
}

let cookie

const headers = (): Record<string, string> => ({
  Cookie: cookie || '',
  Referer: 'https://w2.v2free.top/auth/login',
  'User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0'
})

async function login(email, passwd): Promise<void> {
  const res = await axios.post(
    'https://w2.v2free.top/auth/login',
    {
      email,
      passwd
    },
    { withCredentials: true }
  )

  cookie = res.headers['set-cookie']?.map((c) => c.split(';')[0]).join('; ')
}

// 检查页面是否被重定向回登录页（表示 cookie 失效）
function isLoggedOut(html: string): boolean {
  const $ = cheerio.load(html)
  return $('button[id="login"]').text().includes('登录')
}

export default async function getTrafficWithAutoLogin(optins: {
  email: string
  passwd: string
}): Promise<ItrafficInfo | null> {
  const { email, passwd } = optins
  async function fetchTraffic(): Promise<ItrafficInfo | null> {
    const res = await axios.request({
      url: 'https://w2.v2free.top/user',
      method: 'GET',
      headers: headers()
    })

    if (isLoggedOut(res.data)) return null
    const $ = cheerio.load(res.data)
    return {
      today: $('li:contains("今日已用:") > a').text().trim(),
      last: $('li:contains("过去已用:") > a').text().trim(),
      left: $('div:contains("剩余流量:") > a').text().trim()
    }
  }

  let traffic = await fetchTraffic()
  if (!traffic) {
    console.log('Cookie 失效，尝试重新登录...')
    await login(email, passwd)
    traffic = await fetchTraffic()
  }

  return traffic
}
