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
        public link: string,
        public onClick: Callable,
        public badge = 0,
        public badgeIcon = 'badge-secondary',
        public isBadge = false,
        public disable = false
    ) { }
}