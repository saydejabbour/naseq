import bcrypt from "bcryptjs";

const password = "123456";

async function run() {
  const hash = await bcrypt.hash(password, 10);
  console.log(hash);
}

run();