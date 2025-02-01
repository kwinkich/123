import { TonConnectButton } from "@tonconnect/ui-react";
import { useState } from "react";
import "./App.css";
import { useContract } from "./useContracts";

function App() {
	const [count, _] = useState(0);
	const { mint } = useContract();

	return (
		<>
			<div className="card">
				<TonConnectButton />
				<button
					style={{ height: "100px", width: "200px", borderRadius: "24px" }}
					onClick={() => mint()}
				>
					НАЕБАЛ
				</button>
			</div>
		</>
	);
}

export default App;
