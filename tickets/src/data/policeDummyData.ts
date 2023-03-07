import { AppError } from "../middlewares/error.middleware";
import { IPoliceDummyData } from "../utils/types";

export const policeData: IPoliceDummyData[] = [
	{
		fullName: "Rufai Dongo",
		WIP: "A90123223",
		phoneNumber: "08167423109",
		state: "lagos",
	},
	{
		fullName: "Olawale Adekuti",
		WIP: "A90123561",
		phoneNumber: "08167452389",
		state: "Ibadan",
	},
	{
		fullName: "Jacob Nwosu",
		WIP: "E92123009",
		phoneNumber: "07023234889",
		state: "Kano",
	},
	{
		fullName: "Sunday Bello",
		WIP: "A87239012",
		phoneNumber: "08034234539",
		state: "Delta",
	},
	{
		fullName: "Ibrahim Musa",
		WIP: "A98745679",
		phoneNumber: "09011234523",
		state: "Abuja",
	},
];

export function getPoliceDetails(WIP: string) {
	const policeDetails: Array<IPoliceDummyData> = policeData.filter(
		(police: IPoliceDummyData) => police.WIP === WIP
	);
	return !policeDetails[0]
		? { error: "Police ID does not exist" }
		: policeDetails[0];
}
