import { Coupon } from 'src/app/model/coupon';
import { Product } from 'src/app/model/product';
import { ProductOption } from './product';
import { User } from './user';

export class PaymentResult {
    constructor(
        public pid: number,
        public mid: number,
        public id: number,
        public phoneNumber: string,
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
        public PCD_PAYER_NAME: string,
        public PCD_RST_URL: string,
        public PCD_PAYER_EMAIL: string,
        public PCD_PAY_CARDNAME: string,
        public PCD_PAY_CARDNUM: string,
        public PCD_PAY_CARDTRADENUM: string,
        public PCD_PAY_CARDAUTHNO: string,
        public PCD_PAY_CARDRECEIPT: string,
        public PCD_CARD_VER: string,
        public PCD_PAYER_HP: string,
        public PCD_PAY_BANKACCTYPE: string,
        public couponId?: number,
        public options?: any[]
    ) { }
}

export class PaymentOptionMap {
    constructor(
        public pomid: number,
        public payment: PaymentResult | number,
        public option: ProductOption | number,
        public count: number,
        public PCD_PAY_REFUND_CARDRECEIPT: string = "",
        public PCD_REFUND_TOTAL: number = 0,
        public isRefund: boolean = false,
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

export class PaymentCreateDto {
    constructor(
        public order: OrderCreateDto,
        public pgName: PG,
        public pgOrderId: string,
        public payAt: Date,
        public totalPrice: number,
        public payMethod: PayMethod,
        public payPrice: number,
        public payCommissionPrice: number,
        public result: boolean,
        public resultMessage: string,
        public cardName?: string,
        public cardNum?: string,
        public cardReceipt?: string,
        public bankName?: string,
        public bankNum?: string,
        public createdAt?: Date,
        public updatedAt?: Date,
    ) { }
}

export class OrderCreateDto {
    constructor(
        public userId: number,
        public productId: number,
        public couponId: number,
        public point: number,
        public orderAt: Date,
        public orderItems: OrderItemCreateDto[],
    ) { }
}

export class OrderItemCreateDto {
    constructor(
        public productOptionId: number,
        public count: number,
    ) { }
}

export class Payment {
    id: number;
    order: Order;
    pgName: PG;
    pgOrderId: string;
    payAt: Date;
    totalPrice: number;
    payMethod: PayMethod;
    payPrice: number;
    payCommissionPrice: number;
    result: boolean;
    resultMessage: string;
    cardName: string;
    cardNum: string;
    cardReceipt: string;
    bankName: string;
    bankNum: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Order {
    id: number;
    user: User;
    product: Product;
    coupon: Coupon;
    point: number;
    orderAt: Date;
    orderItems: OrderItem[];
}

export interface OrderItem {
    id: number;
    order: Order;
    productOption: ProductOption;
    count: number;
}

export enum PG {
    NAVER = "NAVER",
    KAKAO = "KAKAO",
    PAYPLE = "PAYPLE"
}

export enum PayMethod {
    BANKBOOK = "BANKBOOK",
    POINT = "POINT",
    CARD = "CARD",
    TRANSFER = "TRANSFER",
    DIRECT = "DIRECT",
    FREE = "FREE"
}

export interface PaymentSearchDto {
    page?: number;
    limit?: number;
}