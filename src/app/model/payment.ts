export class PaymentResult {
    constructor(
        public pid: number,
        public phone: string,
        public PCD_PAY_RST: string,
        public PCD_PAY_MSG: string,
        public PCD_AUTH_KEY: string,
        public PCD_PAY_REQKEY: string,
        public PCD_PAY_COFURL: string,
        public PCD_PAY_OID: string,
        public PCD_PAY_TYPE: string,
        public PCD_PAY_WORK: string,
        public PCD_PAYER_ID: string,
        public PCD_PAYER_NO: string,
        public PCD_REGULER_FLAG: string,
        public PCD_PAY_YEAR: string,
        public PCD_PAY_MONTH: string,
        public PCD_PAY_GOODS: string,
        public PCD_PAY_TOTAL: string,
        public PCD_PAY_ISTAX: string,
        public PCD_PAY_TAXTOTAL: string,
        public PCD_PAY_BANK: string,
        public PCD_PAY_BANKNAME: string,
        public PCD_PAY_BANKNUM: string,
        public PCD_PAY_TIME: string,
        public PCD_TAXSAVE_FLAG: string,
        public PCD_TAXSAVE_RST: string,
        public PCD_TAXSAVE_MGTNUM: string,
        public mid: number,
        public uid: number,
        public couponId?: number,
        public options?: any[]
    ) { }
}

export class PaymentOptionMap {
    constructor(
        public pomid: number,
        public payment: number,
        public option: number,
        public count: number
    ) { }
}

export enum PaymentResultMsg {
    CLOSE = "close",
    OK_PAYMENT = "결제완료",
    OK_REFUND = "환불완료",
    OK_DELETE_PAYMENT_METHOD = "해지완료",
    OK_GET_USER = "회원조회 성공",
    OK_PAYMENT_RESULT = "조회완료"
}