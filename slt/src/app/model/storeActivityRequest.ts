export class StoreActivityRequest {

	public id: number;
	public name: string;
	public calories: number;
	public day: string;
	public syncedWith?: string;
	public syncedId?: number;

	constructor() {
	}
}
