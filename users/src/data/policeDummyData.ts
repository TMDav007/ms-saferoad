// import { AppError } from "../../../common/middlewares/error.middleware";
import { IPoliceDummyData } from "../utils/types";

export const policeData: IPoliceDummyData[] = [
  {
    fullName: "Rufai Dongo",
    WID: "A90123223",
    phoneNumber: "08167423109",
    state: "lagos",
  },
  {
    fullName: "Olawale Adekuti",
    WID: "A90123561",
    phoneNumber: "08167452389",
    state: "Ibadan",
  },
  {
    fullName: "Jacob Nwosu",
    WID: "E92123009",
    phoneNumber: "07023234889",
    state: "Kano",
  },
  {
    fullName: "Sunday Bello",
    WID: "A87239012",
    phoneNumber: "08034234539",
    state: "Delta",
  },
  {
    fullName: "Ibrahim Musa",
    WID: "A98745679",
    phoneNumber: "09011234523",
    state: "Abuja",
  },
];

export function getPoliceDetails(WID: string) {
  const policeDetails: Array<IPoliceDummyData> = policeData.filter(
    (police: IPoliceDummyData) => police.WID === WID
  );
  return !policeDetails[0]
    ? { error: "Police ID does not exist" }
    : policeDetails[0];
}
