import {Component, OnInit, OnChanges, SimpleChange, Input, Output, EventEmitter} from '@angular/core';
@Component({
	selector: 'pager',
	templateUrl: './pager.component.html'
})
export class PagerComponent implements OnInit, OnChanges {

	@Input() itemsPerPage = 20;
	@Input() itemsInTotal: number;
	@Input() currentPage = 1;

	@Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

	public pages;

	constructor() {}

	ngOnInit() {
		this.getPages();
		this.pageChange.emit(this.currentPage);
	}

	ngOnChanges(changes) {
		this.getPages();
		this.pageChange.emit(this.currentPage);
	}

	public getPages() {
		this.pages = new Array();
		const numberOfPages = Math.ceil(this.itemsInTotal / this.itemsPerPage);
		for (let i = 0; i < numberOfPages; i++) {
			this.pages.push(i);
		}
	}

	public selectPage(pageNumber: number) {
		this.currentPage = pageNumber + 1;
		this.pageChange.emit(this.currentPage);
	}
}
