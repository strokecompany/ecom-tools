import axios, { AxiosError } from 'axios';

export type ReviewsQueryPagesResponse = {
  contents: Array<{
    id: number;
    reviewType: string;
    reviewServiceType: string;
    reviewContentClassType: string;
    reviewScore: number;
    reviewContent: string;
    contentsStatusType: string;
    createDate: string;
    freeTrial: boolean;
    repurchase: boolean;
    reviewRankingScore: number;
    writerId: string;
    maskedWriterId: string;
    writerIdNo: string;
    writerMemberNo: number;
    writerProfileImageUrl: string;
    storeType: string;
    storeNo: number;
    checkoutMerchantId: string;
    checkoutMerchantNo: number;
    orderNo: string;
    productOrderNo: string;
    productNo: string;
    productName: string;
    productUrl: string;
    largeCategorizeCategoryId: string;
    middleCategorizeCategoryId: string;
    smallCategorizeCategoryId: string;
    detailCategorizeCategoryId: string;
    productOptionContentNoDisplay: boolean;
    productOptionContent: string;
    knowledgeShoppingMallProductId: string;
    originProductNo: number;
    standardPurchaseConditionText: string;
    reviewAttaches: Array<{
      id: number;
      reviewAttachmentType: string;
      attachUrl: string;
      attachWidth: number;
      attachHeight: number;
      attachPath: string;
      attachSize: number;
      attachDescription: string;
      sortOrder: number;
      blind: boolean;
      attachName: string;
      attachDirectoryName: string;
    }>;
    reviewEvaluationValueIds: Array<any>;
    reviewTopics?: Array<{
      topicCode: string;
      topicCodeName: string;
      patternStartNo: number;
      patternEndNo: number;
    }>;
    eventTitle: string;
    profileImageSourceType: string;
    repThumbnailAttach?: {
      id: number;
      reviewAttachmentType: string;
      attachUrl: string;
      attachWidth: number;
      attachHeight: number;
      attachPath: string;
      attachSize: number;
      attachDescription: string;
      sortOrder: number;
      blind: boolean;
      attachName: string;
      attachDirectoryName: string;
    };
    repThumbnailTagNameDescription: {};
    isMyReview: boolean;
    parentReviewId?: number;
  }>;
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  sort: {
    sorted: boolean;
    fields: Array<{
      name: string;
      direction: string;
    }>;
  };
  first: boolean;
  last: boolean;
};

// https://smartstore.naver.com/i/v1/contents/reviews/gallery-attaches/10332242902?checkoutMerchantNo=511851007&searchSortType=REVIEW_RANKING&page=1&pageSize=100
// ^ 보면 originProductNo 구할 수 있는 듯?
const SMARTSTORE = {
  id: process.env.SMARTSTORE_ID || '',
  originProductNo: process.env.SMARTSTORE_ORIGIN_PRODUCT_NO || '',
  productNo: process.env.SMARTSTORE_PRODUCT_NO || '',
  merchantNo: process.env.SMARTSTORE_MERCHANT_NO || '',
};
const main = async () => {
  console.log(SMARTSTORE);

  try {
    const response = await axios.post<ReviewsQueryPagesResponse>(
      'https://smartstore.naver.com/i/v1/contents/reviews/query-pages',
      {
        checkoutMerchantNo: SMARTSTORE.merchantNo,
        originProductNo: SMARTSTORE.originProductNo,
        page: 1,
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
          'x-client-version': '20250512212438',
        },
      },
    );
    const { contents, ...data } = response.data;

    // {"page":1,"size":20,"totalElements":90,"totalPages":5,"sort":{"sorted":true,"fields":[{"name":"reviewRankingScore","direction":"desc"},{"name":"createDate","direction":"desc"}]},"first":true,"last":false}
    console.log(JSON.stringify(data));
  } catch (error) {
    console.error(error);
    console.log((error as AxiosError).response?.status);
  }
};

main();
