import bcrypt from "bcryptjs";

export async function encryptPassword(password: string) {
	const salt = await bcrypt.genSalt(10);
	const hashed = await bcrypt.hash(password, salt);

	return hashed;
}