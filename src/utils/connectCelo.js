
import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";


let kit;

export const connectCeloWallet = async () => {
    if (window.celo) {
        try {
            await window.celo.enable(); //request account access
            const web3 = new Web3(window.celo);
            kit = newKitFromWeb3(web3);
            const accounts = await kit.web3.eth.getAccounts();
            kit.defaultAccount = accounts[0];
            return accounts[0];
        } catch (error) {
            console.error("Failed to connect to celo wallet", error);
        }
    } else {
        console.log("PLease install the Celo ExtensionWallet");
    }
}

