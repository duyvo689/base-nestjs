import { customAlphabet } from 'nanoid';
import { ACADEMY_ID, DENTAL_ID } from 'src/constant';
export const nanoid = customAlphabet('1234567890', 4);

export function getPrefixId(clinicId: string) {
  let f = 'KH';
  if (DENTAL_ID == clinicId) {
    f = 'NK';
  } else if (ACADEMY_ID == clinicId) {
    f = 'DT';
  } else if (clinicId) {
    f = 'TM';
  }
  return f;
}
