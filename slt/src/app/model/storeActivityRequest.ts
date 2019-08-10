export class StoreActivityRequest {

	public id: number;
	public day: string;
	public name: string;
	public calories: number;
	public syncedWith?: string;
	public syncedId?: number;

	constructor() {
	}
}
