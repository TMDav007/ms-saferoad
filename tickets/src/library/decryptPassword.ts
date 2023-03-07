import bcrypt from "bcryptjs";

export async function decryptPass(
	password: string,
	hashedPassword: string
): Promise<boolean> {
	const decrypted = await bcrypt.compare(password, hashedPassword);

	return decrypted;
}
