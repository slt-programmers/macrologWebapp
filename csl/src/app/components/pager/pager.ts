import {Component, OnInit, OnChanges, SimpleChanges, Input, Output, EventEmitter} from '@angular/core';
@Component({
	selector: 'pager',
	templateUrl: './pager.html'
})
export class Pager implements OnInit, OnChanges {

	@Input() itemsPerPage: number = 20;
	@Input() listSize: number;
	@Input() page: number;

	@Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

	public pages = new Array();

	constructor() {}

	ngOnInit() {
		this.getPages();
	}

	ngOnChanges(changes: SimpleChanges) {
		this.getPages();
	}

	getPages() {
		this.pages = new Array();
		let numberOfPages = Math.ceil(this.listSize / this.itemsPerPage);
		for (let i = 0; i < numberOfPages; i++) {
			this.pages.push(i);
		}
	}

	selectPage(pageNumber: number) {
		console.log('select page');
		this.page = pageNumber + 1;
		this.pageChange.emit(pageNumber + 1);
	}

}