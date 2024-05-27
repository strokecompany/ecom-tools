import axios from 'axios';

const SMARTSTORE = {
  id: 'muzii',
  originProductNo: 9744839793,
  productNo: 9791503929, // FIXME: UNUSED
  merchantNo: 511005182,
};
const main = async () => {
  const response = await axios.post(
    'https://smartstore.naver.com/i/v1/contents/reviews/query-pages',
    {
      checkoutMerchantNo: SMARTSTORE.merchantNo,
      originProductNo: SMARTSTORE.originProductNo,
      page: 2,
      pageSize: 20,
      reviewSearchSortType: 'REVIEW_RANKING',
    },
    {
      headers: {
        'accept-language': 'ko,en;q=0.9,ko-KR;q=0.8,ja;q=0.7',
        'cache-control': 'no-cache',
        origin: 'https://smartstore.naver.com',
        pragma: 'no-cache',
        priority: 'u=1, i',
        referer: `https://smartstore.naver.com/${SMARTSTORE.id}/products/${SMARTSTORE.productNo}`, // ?
        'sec-ch-ua':
          '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"macOS"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'user-agent':
          'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
        'x-client-version': '20240522102041',
      },
    },
  );
  console.log(JSON.stringify(response.data));
};

main();
