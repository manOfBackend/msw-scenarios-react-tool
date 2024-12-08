import { http } from 'msw-scenarios'
import { HttpResponse } from 'msw'
import { extendHandlers } from 'msw-scenarios'
// 사용자 가능 대출 종류 조회
const userLoanTypesHandler = http
  .get('/api/loans/available-types', () => {
    return HttpResponse.json({ types: [] })
  })
  .presets(
    {
      label: '모든대출가능',
      status: 200,
      response: {
        types: ['PERSONAL', 'MORTGAGE', 'JEONSEE'],
      },
    },
    {
      label: '신용대출만가능',
      status: 200,
      response: {
        types: ['PERSONAL'],
      },
    }
  )

// 신용대출 핸들러
const personalLoansHandler = http
  .get('/api/loans/personal', () => {
    return HttpResponse.json({ loans: [] })
  })
  .presets({
    label: '대출목록',
    status: 200,
    response: {
      loans: [
        {
          id: 'PL1',
          name: '직장인 신용대출',
          bank: '우리은행',
          maxAmount: 50000000,
          rate: 4.5,
        },
        {
          id: 'PL2',
          name: 'SOL 신용대출',
          bank: '신한은행',
          maxAmount: 30000000,
          rate: 5.0,
        },
      ],
    },
  })

const personalLoanDetailHandler = http
  .get('/api/loans/personal/:id', () => {
    return HttpResponse.json({})
  })
  .presets({
    label: '상품상세',
    status: 200,
    response: {
      id: 'PL1',
      name: '직장인 신용대출',
      bank: '우리은행',
      rate: 4.5,
      maxAmount: 50000000,
      term: 60,
      requirements: ['재직증명서', '소득증빙'],
    },
  })

const personalLoanApplyHandler = http
  .post('/api/loans/personal/apply', () => {
    return HttpResponse.json({})
  })
  .presets(
    {
      label: '신청성공',
      status: 200,
      response: {
        applicationId: 'APP123',
        status: 'APPROVED',
        amount: 30000000,
        rate: 4.5,
      },
    },
    {
      label: '신청거절',
      status: 200,
      response: {
        applicationId: 'APP124',
        status: 'REJECTED',
        reason: '신용점수 기준 미달',
        recommendProducts: [
          { name: '새희망홀씨', maxAmount: 30000000, rate: 8.5 },
        ],
      },
    },
    {
      label: '한도초과',
      status: 200,
      response: {
        applicationId: 'APP125',
        status: 'LIMIT_EXCEEDED',
        requestedAmount: 50000000,
        availableAmount: 30000000,
        message: '소득 대비 대출한도를 초과하였습니다.',
      },
    },
    {
      label: '심사중',
      status: 200,
      response: {
        applicationId: 'APP126',
        status: 'IN_PROGRESS',
        message: '심사가 진행중입니다. (예상 소요시간: 1시간)',
        submittedAt: '2024-12-03T10:00:00Z',
      },
    }
  )

// 주택담보대출 핸들러
const mortgageLoansHandler = http
  .get('/api/loans/mortgage', () => {
    return HttpResponse.json({ loans: [] })
  })
  .presets({
    label: '대출목록',
    status: 200,
    response: {
      loans: [
        {
          id: 'ML1',
          name: '내집마련대출',
          bank: '국민은행',
          maxLtv: 70,
          rate: 3.8,
        },
        {
          id: 'ML2',
          name: '주택담보대출',
          bank: '우리은행',
          maxLtv: 60,
          rate: 4.0,
        },
      ],
    },
  })

const mortgageLoanDetailHandler = http
  .get('/api/loans/mortgage/:id', () => {
    return HttpResponse.json({})
  })
  .presets({
    label: '상품상세',
    status: 200,
    response: {
      id: 'ML1',
      name: '내집마련대출',
      bank: '국민은행',
      rate: 3.8,
      maxLtv: 70,
      term: 360,
      requirements: ['등기부등본', '재직증명서', '소득증빙'],
    },
  })

const mortgageLoanApplyHandler = http
  .post('/api/loans/mortgage/apply', () => {
    return HttpResponse.json({})
  })
  .presets({
    label: '신청성공',
    status: 200,
    response: {
      applicationId: 'APP456',
      status: 'APPROVED',
      amount: 200000000,
      rate: 3.8,
    },
  })

// 전세대출 핸들러
const jeonseeLoansHandler = http
  .get('/api/loans/jeonsee', () => {
    return HttpResponse.json({ loans: [] })
  })
  .presets({
    label: '대출목록',
    status: 200,
    response: {
      loans: [
        {
          id: 'JL1',
          name: '청년전세대출',
          bank: 'KB국민은행',
          maxAmount: 200000000,
          rate: 3.5,
        },
        {
          id: 'JL2',
          name: '전세자금대출',
          bank: '우리은행',
          maxAmount: 150000000,
          rate: 3.7,
        },
      ],
    },
  })

const jeonseeLoanDetailHandler = http
  .get('/api/loans/jeonsee/:id', () => {
    return HttpResponse.json({})
  })
  .presets({
    label: '상품상세',
    status: 200,
    response: {
      id: 'JL1',
      name: '청년전세대출',
      bank: 'KB국민은행',
      rate: 3.5,
      maxAmount: 200000000,
      term: 120,
      requirements: ['임대차계약서', '재직증명서', '소득증빙'],
    },
  })

const jeonseeLoanApplyHandler = http
  .post('/api/loans/jeonsee/apply', () => {
    return HttpResponse.json({})
  })
  .presets({
    label: '신청성공',
    status: 200,
    response: {
      applicationId: 'APP789',
      status: 'APPROVED',
      amount: 150000000,
      rate: 3.5,
    },
  })

// export handlers 설정
export const handlers = extendHandlers(
  userLoanTypesHandler,
  personalLoansHandler,
  personalLoanDetailHandler,
  personalLoanApplyHandler,
  mortgageLoansHandler,
  mortgageLoanDetailHandler,
  mortgageLoanApplyHandler,
  jeonseeLoansHandler,
  jeonseeLoanDetailHandler,
  jeonseeLoanApplyHandler
)
export const profiles = handlers.createMockProfiles(
  {
    name: '신용대출 신청',
    actions: ({ useMock }) => {
      useMock({
        method: 'get',
        path: '/api/loans/available-types',
        preset: '신용대출만가능',
      })
      useMock({
        method: 'get',
        path: '/api/loans/personal',
        preset: '대출목록',
      })
      useMock({
        method: 'get',
        path: '/api/loans/personal/:id',
        preset: '상품상세',
      })
      useMock({
        method: 'post',
        path: '/api/loans/personal/apply',
        preset: '신청성공',
      })
    },
  },
  {
    name: '주택담보대출 신청',
    actions: ({ useMock }) => {
      useMock({
        method: 'get',
        path: '/api/loans/available-types',
        preset: '모든대출가능',
      })
      useMock({
        method: 'get',
        path: '/api/loans/mortgage',
        preset: '대출목록',
      })
      useMock({
        method: 'get',
        path: '/api/loans/mortgage/:id',
        preset: '상품상세',
      })
      useMock({
        method: 'post',
        path: '/api/loans/mortgage/apply',
        preset: '신청성공',
      })
    },
  },
  {
    name: '전세대출 신청',
    actions: ({ useMock }) => {
      useMock({
        method: 'get',
        path: '/api/loans/available-types',
        preset: '모든대출가능',
      })
      useMock({
        method: 'get',
        path: '/api/loans/jeonsee',
        preset: '대출목록',
      })
      useMock({
        method: 'get',
        path: '/api/loans/jeonsee/:id',
        preset: '상품상세',
      })
      useMock({
        method: 'post',
        path: '/api/loans/jeonsee/apply',
        preset: '신청성공',
      })
    },
  },
  {
    name: '대출 거절',
    actions: ({ useMock }) => {
      useMock({
        method: 'post',
        path: '/api/loans/personal/apply',
        preset: '신청거절',
      })
    },
  },
  {
    name: '한도 초과',
    actions: ({ useMock }) => {
      useMock({
        method: 'post',
        path: '/api/loans/personal/apply',
        preset: '한도초과',
      })
    },
  },
  {
    name: '심사 진행중',
    actions: ({ useMock }) => {
      useMock({
        method: 'post',
        path: '/api/loans/personal/apply',
        preset: '심사중',
      })
    },
  }
)
