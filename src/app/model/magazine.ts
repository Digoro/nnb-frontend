import { User } from 'src/app/model/user';

export class Magazine {
    constructor(
        public id: number,
        public title: string,
        public catchphrase: string,
        public representationPhoto: string,
        public contents: string,
        public createdAt: Date,
        public updatedAt: Date,
        public author: User
    ) { }
}