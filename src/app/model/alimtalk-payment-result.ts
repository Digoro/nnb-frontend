export class AlimtalkPaymentResult {
    constructor(
        public receiver_1: string,
        public recvname_1: string,
        public nickname: string,
        public orderNumber: string,
        public price: number,
        public paymentDate: string,
        public meetingName: string,
        public meetingOption: string,
        public meetingDate: string,
        public meetingId: number,
    ) { }
}