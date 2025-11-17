import { TestBed } from "@angular/core/testing";
import { DateStore } from "./date.store";
import { formatDate } from "@angular/common";

describe("DateStore", () => {
	let store: any;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [DateStore],
		});

		store = TestBed.inject(DateStore);
	});

	it("should store displayed date of diary", () => {
		const newDate = formatDate(new Date(), "yyyy-MM-dd", "en-NL");
		let result = store.displayDate();
		expect(result).toEqual(newDate);
		store.setDisplayDate("2020-01-01");
		result = store.displayDate();
		expect(result).toEqual("2020-01-01");
	});
});
