import { ethers } from "hardhat";

export async function main() {
    const hre = require("hardhat");

    const Library_Factory = await ethers.getContractFactory("Library");
    const library = await Library_Factory.deploy();
    await library.deployed();

    await hre.run('print', { message: `The Library contract is deployed to ${library.address}` })

    const sleep = (ms: number | undefined) =>
        new Promise(r => setTimeout(r, ms));

    let sleepDuration = 5000;
        
    for (let attempt = 1; attempt <= 10; attempt++) {
        try {
            await hre.run("verify:verify", {
                address: library.address
            });

            await hre.run('print', { message: `Verified!` });
            break;
        }
        catch (err) {
            console.log("Error!");
            await sleep(sleepDuration);
            sleepDuration = sleepDuration * 2;
        }
    }
}