export class FoodEntry {
	constructor(
		public food: string,
		public unit: string,
		public unitName: string,
		public unitGrams: number,
		public protein: number,
		public fat: number,
		public carbs: number,
		public portions: Portion[]
	) {}
}
