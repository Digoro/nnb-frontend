
export class Comment {
    constructor(
        public cid: number,
        public meeting: number,
        public writer: {
            image: string,
            name: string,
            nickName: string,
            sid: number,
            uid: number
        } | number,
        public star: number,
        public comment: string,
        public createDT: string,
        public parentCid?: number,
        public children?: Comment[],
        public canDelete = false
    ) { }
}