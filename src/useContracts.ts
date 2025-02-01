import { OpenedContract } from "@ton/core";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useEffect, useState } from "react";
import { Address, Sender, SenderArguments } from "ton-core";
import { LingMine } from "./wrappers/LingMine";

import { toNano } from "@ton/core";
import { useTonClient } from "./useTonClient";

export function useContract() {
	const { client } = useTonClient();
	const [tonConnectUI] = useTonConnectUI();

	const [contract, setContract] = useState<OpenedContract<LingMine> | null>(
		null
	);
	// const [jettonWallet, setJettonWallet] = useState<OpenedContract<JettonWallet> | null>(null);

	const [sender, setSender] = useState<Sender>();

	useEffect(() => {
		if (!client) return;

		const loadContract = async () => {
			try {
				const contr = LingMine.createFromAddress(
					Address.parse("kQBLnE_2HHOBSHUpcWWWzyBC7SAjGVhHrVUXEpnWx9JWPlXL")
				);
				// @ts-ignore
				const openedContract = client.open(
					contr
				) as unknown as OpenedContract<LingMine>;
				console.log("opened contr", openedContract);

				setContract(openedContract);
			} catch (error) {
				console.error("Failed to load contract:", error);
			}
		};

		loadContract();
	}, [client]);

	// useEffect(() => {
	//     if (!contract || !tonConnectUI.account?.address) return;

	//     const loadJettonWallet = async () => {
	//         try {
	// 						// @ts-ignore
	//             const jtAddr = await contract.getWalletAddress(
	//                 Address.parse(tonConnectUI.account?.address || "")
	//             );
	//             const openedJettonWallet = client?.open(
	//                 JettonWallet.createFromAddress(jtAddr)
	//             ) as OpenedContract<JettonWallet>;
	//             setJettonWallet(openedJettonWallet);
	//         } catch (error) {
	//             console.error("Failed to load Jetton Wallet:", error);
	//         }
	//     };

	//     loadJettonWallet();
	// }, [contract, tonConnectUI.account?.address]);

	useEffect(() => {
		let sender: Sender = {
			address: Address.parse(
				tonConnectUI.account?.address ||
					"kQBLnE_2HHOBSHUpcWWWzyBC7SAjGVhHrVUXEpnWx9JWPlXL"
			), // Здесь исправлено на Address.parse
			send: async (args: SenderArguments) => {
				tonConnectUI.sendTransaction({
					messages: [
						{
							address: args.to.toString(),
							amount: args.value.toString(),
							payload: args.body?.toBoc().toString("base64"),
						},
					],
					validUntil: Date.now() + 5 * 60 * 1000,
				});
			},
		};

		setSender(sender);
	}, [tonConnectUI]);

	const to = Address.parse("0QD1JmW0OlSk5Nmz9ZhzF0sgQU4C9LRt8GjwjgoVEbwXkJWy"); // Исправлено на Address.parse

	return {
		// jettonWalletAddress: jettonWallet?.address.toString(),
		// @ts-ignore
		mint: () => contract?.sendTx(sender, toNano("0.55"), 1234n),
	};
}
