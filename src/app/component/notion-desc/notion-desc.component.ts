import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'notion-desc',
  templateUrl: './notion-desc.component.html',
  styleUrls: ['./notion-desc.component.scss'],
})
export class NotionDescComponent implements OnInit {
  @Input() description: { title: string, descList: string[], moreDescList?: string[], link?: string, image?: string };

  constructor() { }

  ngOnInit() { }

}
