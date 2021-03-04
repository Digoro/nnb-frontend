export enum CategoryType {
    TRAVEL = "여행",
    HOBBY = "취미",
    EXERCISE = "운동",
    MEETING = "모임",
    EDUCATION = "교육",
    SOCIAL = "사회공헌"
}

export class Category {
    constructor(
        public id: number,
        public name: CategoryType,
    ) { }
}