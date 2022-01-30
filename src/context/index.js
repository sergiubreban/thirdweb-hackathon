import { createContext, useContext, useState } from "react";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { ethers } from "ethers";
import { useWeb3 } from "@3rdweb/hooks";

const sdk = new ThirdwebSDK("rinkeby");
const bundleDropModule = sdk.getBundleDropModule(process.env.REACT_APP_BUNDLE_DROP_ADDRESS);
const tokenModule = sdk.getTokenModule(process.env.REACT_APP_TOKEN_ADDRESS);
const voteModule = sdk.getVoteModule(process.env.REACT_APP_VOTE_MODULE_ADDRESS);

export const DAOContext = createContext({
  sdk,
  bundleDropModule,
  tokenModule,
  voteModule
});

export const DAOProvider = (props) => {

  return <DAOContext.Provider value={ {
    sdk,
    bundleDropModule,
    tokenModule,
    voteModule
  } }>{ props.children }</DAOContext.Provider>
}

export const useSdk = () => {
  return useContext(DAOContext).sdk
}
export const useBundleDropModule = () => {
  return useContext(DAOContext).bundleDropModule
}
export const useTokenModule = () => {
  return useContext(DAOContext).tokenModule
}
export const useVoteModule = () => {
  return useContext(DAOContext).voteModule
}

export const useVoteModuleActions = () => {
  const { address: walletAddress } = useWeb3();

  const [error, setError] = useState(null);
  const [xState, setXState] = useState('init');

  const addProposalVote = async ({ link, genre }) => {
    setXState('loading')
    try {
      const amount = 1_000;
      await voteModule.propose(
        JSON.stringify({ link, amount, genre }),
        // `Should the DAO transfer ${amount} tokens from the treasury to the Proposer for Posting awesome song link?${awesomeSeparator}${link}`,
        [
          {
            nativeTokenValue: 0,
            transactionData: tokenModule.contract.interface.encodeFunctionData(
              // We're doing a transfer from the treasury to our wallet.
              "transfer",
              [
                walletAddress,
                ethers.utils.parseUnits(amount.toString(), 18),
              ]
            ),

            toAddress: tokenModule.address,
          },
        ]
      );

      setXState('success')
      console.log(
        "✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!"
      );
    } catch (error) {
      console.error("failed to create second proposal", error);
      setError(error)
      setXState('error')
    }
  }
  const reset = () => {
    setXState('init')
    setError(null)
  }
  return { error, addProposalVote, state: xState, reset }
}