import bcrypt from 'bcrypt';

const password = 'benchmark-password';

for (let cost = 5; cost <= 15; cost++) {
    console.time(`cost ${cost}`);

    await bcrypt.hash(password, cost);

    console.timeEnd(`cost ${cost}`);
}