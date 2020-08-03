import { Category } from './category';

export class Meeting {
    constructor(
        public mid: number,
        public title: string,
        public subTitle: string,
        public desc: string,
        public address: string,
        public detailed_address: string,
        public lat: number,
        public lon: number,
        public host: number,
        public _from: string,
        public _to: string,
        public categories: Category[],
        public limitPerson: number,
        public file: string,
        public price: number,
        public likes: number,
        public refund_policy: string,
        public notice: string,
        public check_list: string,
        public include: string,
        public exclude: string,
        public order: number,
        public options?: MeetingOption[]
    ) { }
}

export class MeetingOption {
    constructor(
        public oid: number,
        public meeting: number,
        public optionTitle: string,
        public optionPrice: number,
        public optionTo: string,
        public optionFrom: string,
        public isOld: boolean
    ) { }
}