import { provider } from "../config/init-pact";
import { Matchers } from "@pact-foundation/pact";
import { AnimalController } from "../../../controllers";

describe('Animal Service', () => {
	beforeAll(async () => {
		await provider.setup();
	});

	describe("When a request to list all animals is made", () => {
		beforeEach(async () => {
			await provider.addInteraction({
				uponReceiving: "a request to list all animals",
				state: "has animals",
				withRequest: {
					method: "GET",
					path: "/animals",
				},
				willRespondWith: {
					status: 200,
					body: Matchers.eachLike({
						name: Matchers.like("manchas"),
						breed: Matchers.like("Bengali"),
						gender: Matchers.like("Female"),
						vaccinated: Matchers.boolean(true),
					}),
				},
			});
		});
		test("should return the correct data", async () => {
			const response = await AnimalController.list();
			expect(response.data).toMatchSnapshot();
			await provider.verify();
		});
	});

	describe("When a request to get an animal is made", () => {
		beforeEach(async () => {
			await provider.addInteraction({
				uponReceiving: "a request to get an animal",
				state: "has an animal",
				withRequest: {
					method: "GET",
					path: "/animals/Kiara",
				},
				willRespondWith: {
					status: 200,
					body: {
						name: Matchers.like("Kiara"),
						breed: Matchers.like("Bengali"),
						gender: Matchers.like("Female"),
						vaccinated: Matchers.boolean(true),
					},
				},
			});
		});
		test("should return the correct data", async () => {
			const response = await AnimalController.getAnimal("Kiara");
			expect(response.data).toMatchSnapshot();
			await provider.verify();
		});
	});

	describe("When a request to add an animal is made", () => {
		let testBody = {
			name: "Kiara",
			breed: "Criolla",
			gender: "Female",
			vaccinated: false,
		}
		beforeEach(async () => {
			await provider.addInteraction({
				uponReceiving: "a request to add an animal",
				state: "has an animal to update",
				withRequest: {
					method: "POST",
					path: "/animals",
					body: testBody
				},
				willRespondWith: {
					status: 201,
					body: testBody
				},
			});
		});
		test("should return the correct data", async () => {
			const response = await AnimalController.register(testBody);
			expect(response.data).toMatchSnapshot();
			await provider.verify();
		});
	});

	describe("When a request to update an animal is made", () => {
		let testBody = {
			name: "Kiara",
			breed: "Criolla",
			gender: "Female",
			vaccinated: true,
			vaccines: ["Polio","Rabia"]
		}
		beforeEach(async () => {
			await provider.addInteraction({
				uponReceiving: "a request to update an animal",
				state: "has an animal to update",
				withRequest: {
					method: "PUT",
					path: "/animals/Kiara",
					body: testBody
				},
				willRespondWith: {
					status: 200,
					body: {
						id: Matchers.like(6),
						name: Matchers.like("Kiara"),
						breed: Matchers.like("Criolla"),
						gender: Matchers.like("Female"),
						vaccinated: Matchers.boolean(true),
						vaccines: Matchers.like(["Polio", "Rabia"])
					}
				},
			});
		});
		test("should return the correct data", async () => {
			const response = await AnimalController.updateAnimal("Kiara",testBody);
			expect(response.data).toMatchSnapshot();
			await provider.verify();
		});
	});

	
	afterAll(() => provider.finalize());
});