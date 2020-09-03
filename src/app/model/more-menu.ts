import { Callable } from './callable';

export class MoreMenuGroup {
    constructor(
        public label: string,
        public items: MoreMenuItem[],
    ) { }
}

export class MoreMenuItem {
    constructor(
        public label: string,
        public onClick: Callable,
        public icon: string,
        public badge = 0,
        public isBadge = false,
        public disable = false,
        public isShow = true
    ) { }
}