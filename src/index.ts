import puppeteer from 'puppeteer';

const main = async () => {
  const browser = await puppeteer.launch({
    headless: false,
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

  // 쿠키 값 가져오기
  const cookies = await page.cookies();
  console.log(cookies);
};

main().catch((err) => console.error(err));
