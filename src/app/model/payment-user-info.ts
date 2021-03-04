export interface UserPaymentInfo {
    PCD_PAY_RST: string;
    PCD_PAY_CODE: string;
    PCD_PAY_MSG: string;
    PCD_PAY_TYPE: string;
    PCD_PAY_BANKACCTYPE: string;
    PCD_PAYER_ID: string;
    PCD_PAYER_NAME: string;
    PCD_PAYER_HP: string;
}

export class UserBandkPaymentInfo implements UserPaymentInfo {
    constructor(
        public PCD_PAY_RST: string,
        public PCD_PAY_CODE: string,
        public PCD_PAY_MSG: string,
        public PCD_PAY_TYPE: string,
        public PCD_PAY_BANKACCTYPE: string,
        public PCD_PAYER_ID: string,
        public PCD_PAYER_NAME: string,
        public PCD_PAYER_HP: string,
        public PCD_PAY_BANK: string,
        public PCD_PAY_BANKNAME: string,
        public PCD_PAY_BANKNUM: string,
    ) { }
}

export class UserCardPaymentInfo implements UserPaymentInfo {
    constructor(
        public PCD_PAY_RST: string,
        public PCD_PAY_CODE: string,
        public PCD_PAY_MSG: string,
        public PCD_PAY_TYPE: string,
        public PCD_PAY_BANKACCTYPE: string,
        public PCD_PAYER_ID: string,
        public PCD_PAYER_NAME: string,
        public PCD_PAYER_HP: string,
        public PCD_PAY_CARD: string,
        public PCD_PAY_CARDNAME: string,
        public PCD_PAY_CARDNUM: string,
    ) { }
}