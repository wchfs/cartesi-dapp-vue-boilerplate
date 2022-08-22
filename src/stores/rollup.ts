import { defineStore } from 'pinia';
import { ethers } from 'ethers';
import type { ContractReceipt, ContractTransaction } from 'ethers';
import type { InputFacet, OutputFacet, RollupsFacet, } from '@/generated/rollups';
import { InputFacet__factory, OutputFacet__factory, RollupsFacet__factory } from '@/generated/rollups';
import gql from 'graphql-tag';
import type { ApolloQueryResult } from 'apollo-client';
import type { NoticeKeys } from '@/generated/graphql';
import type { InputAddedEvent } from '@/generated/rollups/contracts/facets/InputFacet';
import type { OnboardComposable } from '@web3-onboard/vue/dist/types';


export interface RollupsContracts {
    rollupsContract: RollupsFacet;
    inputContract: InputFacet;
    outputContract: OutputFacet;
}

export interface RollupState {
    rollupsAddress: Record<string, any>,
    contracts: RollupsContracts | null,
}

export interface ContractTransactionResponse {
    transaction: ContractTransaction,
    receipt: ContractReceipt,
    response: Promise<any>,
}

export const useRollupStore = defineStore('rollup', {
    state: (): RollupState => {
        return {
            rollupsAddress: {
                "0x7a69": import.meta.env.VITE_APP_DAPP_ADDRESS, // local hardhat
            },
            contracts: null,
        }
    },
    getters: {
        // ...
    },
    actions: {
        setup(onboard: OnboardComposable) {
            if (this.contracts !== null) {
                return;
            }

            const connectedWallet = onboard.connectedWallet.value;

            if (connectedWallet === null) {
                throw new Error('Please connect any wallet');
            }

            const provider = new ethers.providers.Web3Provider(
                connectedWallet.provider
            );

            const connectedChain = onboard.connectedChain.value;

            if (connectedChain === null) {
                throw new Error('Please connect any chain');
            }

            const address = this.rollupsAddress[connectedChain.id];

            // rollups contract
            const rollupsContract = RollupsFacet__factory.connect(
                address,
                provider.getSigner()
            );

            // input contract
            const inputContract = InputFacet__factory.connect(
                address,
                provider.getSigner()
            );

            // output contract
            const outputContract = OutputFacet__factory.connect(
                address,
                provider.getSigner()
            );

            this.contracts = {
                rollupsContract,
                inputContract,
                outputContract,
            };
        },
        addInput: async function (input: string): Promise<ContractTransactionResponse> {
            if (this.contracts === null) {
                throw new Error('Please run rollups setup first');
            }

            const transaction = await this.contracts.inputContract.addInput(
                ethers.utils.toUtf8Bytes(input)
            );

            const receipt = await transaction.wait(1);

            return new Promise<ContractTransactionResponse>((resolve) => {
                resolve({
                    transaction,
                    receipt,
                    response: new Promise<any>(async (resolve) => {
                        const keys = this.findNoticeKeys(receipt);

                        let result: ApolloQueryResult<any> | null = null;

                        const intervalId = setInterval(async () => {
                            result = await this.apolloClient.query({
                                fetchPolicy: 'no-cache',
                                query: gql`
                                    query getNoticeByInputIndex(
                                        $inputIndex: String,
                                        $epochIndex: String,
                                    ) {
                                        GetNotice(query: {
                                            input_index: $inputIndex,
                                            epoch_index: $epochIndex,
                                        }) {
                                            payload,
                                            session_id,
                                            notice_index,
                                        }
                                    }
                                `,
                                variables: {
                                    inputIndex: keys.input_index,
                                    epochIndex: keys.epoch_index,
                                },
                            });

                            if (result?.data?.GetNotice?.length > 0) {
                                clearInterval(intervalId);
                                resolve(
                                    ethers.utils.toUtf8String(`0x${result.data.GetNotice[0].payload}`)
                                );
                            }
                        }, 1000);
                    }),
                });
            });
        },
        findNoticeKeys: function (receipt: ContractReceipt): NoticeKeys {
            const event = receipt.events?.find((event) => event.event === "InputAdded");

            if (!event) {
                throw new Error(
                    `InputAdded event not found in receipt of transaction ${receipt.transactionHash}`
                );
            }

            const inputAdded = event as InputAddedEvent;

            return {
                epoch_index: inputAdded.args.epochNumber.toString(),
                input_index: inputAdded.args.inputIndex.toString(),
            };
        },
    },
});
