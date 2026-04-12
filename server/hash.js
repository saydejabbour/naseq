import bcrypt from "bcryptjs";

const password = "123456789";

const hash = await bcrypt.hash(password, 10);

console.log(hash);