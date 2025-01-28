import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type LingMineConfig = {
    jetton_minter_code : Cell,
    data: Cell,
    owner_address: Address
};

export function lingMineConfigToCell(config: LingMineConfig): Cell {
    return beginCell()
        .storeRef(
            beginCell()
                .storeRef(config.jetton_minter_code)
                .storeRef(config.data)
            .endCell()
            )
        .storeUint(0,64)
        .storeUint(0,64)
        .storeAddress(config.owner_address)
        .endCell();
}

export class LingMine implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new LingMine(address);
    }

    static createFromConfig(config: LingMineConfig, code: Cell, workchain = 0) {
        const data = lingMineConfigToCell(config);
        const init = { code, data };
        return new LingMine(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }

    async sendTx(provider: ContractProvider, via: Sender, value: bigint,query_id: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(0x1574b1ba,32).storeUint(query_id, 64).endCell(),
        });
    }
    async sendWithdraw(provider: ContractProvider, via: Sender, value: bigint, query_id: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().storeUint(0,32).storeUint(query_id,64).endCell(),
        })
    }

    async getCounters(provider: ContractProvider) {
        let { stack } = await provider.get("get_counters", []);
        return [stack.readBigNumber(), stack.readBigNumber()];
    }
    async getOwner(provider: ContractProvider) {
        let { stack } = await provider.get("get_owner", []);
        return stack.readAddress();
    }
}
