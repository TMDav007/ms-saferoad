import { NINDummyData } from "../utils/types";

export const offenderData: Array<NINDummyData> = [
  {
    fullName: "Romoke Peter",
    NIN: "12383AB93",
    email: "afolabitoluwalase16@gmail.com",
    phoneNumber: "080132348932",
    plateNumber: "AS234BSJ",
  },
  {
    fullName: "John Adamu",
    NIN: "23783AX91",
    email: "john23@yahoo.com",
    phoneNumber: "09043762389",
    plateNumber: "XY234OPB",
  },
];

export function getOffendersDetails(NIN: string) {
  const offenderDetails: Array<NINDummyData> = offenderData.filter(
    (offender: NINDummyData) => offender.NIN === NIN
  );

  return !offenderDetails[0]
    ? { error: "NIN does not exist" }
    : offenderDetails[0];
}
