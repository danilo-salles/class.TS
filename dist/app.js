export default async function main(envs) {
    console.log(envs.PORT);
}
await main(process.env);
