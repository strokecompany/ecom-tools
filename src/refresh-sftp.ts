import axios from 'axios';
import puppeteer from 'puppeteer';

const main = async () => {
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();

  const credentials = {
    id: process.env.MALL_ID || '',
    password: process.env.USER_PASSWORD || '',
  };

  // 관리자 로그인 페이지
  await page.goto('https://eclogin.cafe24.com/Shop/');
  await page.type('#mall_id', credentials.id);
  await page.type('#userpasswd', credentials.password);

  await page.click('button.btnStrong.large');

  // 페이지 이동 대기하기
  await page.waitForNavigation();

  if (page.url().includes('comLogin/?action=comForce')) {
    // 비밀번호 변경 요청 페이지
    await page.goto(
      'https://user.cafe24.com/comLogin/?action=comForce&req=hosting',
      {
        timeout: 0,
        waitUntil: 'domcontentloaded',
      },
    );

    // 다음에 변경하기 (`#iptBtnEm` 클릭)
    await page.waitForSelector('#iptBtnEm');
    await page.click('#iptBtnEm');

    // 페이지 이동 대기하기
    await page.waitForNavigation();
  }

  // 상점 주소 저장하기
  const storeUrl = page.url();
  console.log({ storeUrl });

  // 쿠키 값 가져오기
  const cookies = await page.cookies();
  // console.log(cookies);

  const response = await axios.post(
    // FIXME:
    `https://${credentials.id}.cafe24.com/exec/admin/skin/SftpRegist`,
    new URLSearchParams({
      username: credentials.id,
      password: credentials.password,

      // FIXME:
      start_datetime: '2024-05-25T15:00:00Z',
      expire_datetime: '2024-06-01T14:59:59Z',
    }),
    {
      headers: {
        accept: 'application/json, text/javascript, */*; q=0.01',
        'accept-language': 'ko,en;q=0.9,ko-KR;q=0.8,ja;q=0.7',
        'cache-control': 'no-cache',
        'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        cookie: cookies
          .map((cookie) => `${cookie.name}=${cookie.value}`)
          .join('; '),
        origin: `https://${credentials.id}.cafe24.com`,
        pragma: 'no-cache',
        priority: 'u=1, i',
        referer: `https://${credentials.id}.cafe24.com/disp/admin/shop1/skin/sftp`,
        'sec-ch-ua':
          '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'x-requested-with': 'XMLHttpRequest',
      },
    },
  );

  console.log(response.data);

  await page.close();
};

main().catch((err) => console.error(err));
