import { createContext, useContext, useState } from "react";
import { ThirdwebSDK } from "@3rdweb/sdk";
import { ethers } from "ethers";
import { useWeb3 } from "@3rdweb/hooks";
import { jsonParser } from "../utils";
import { useSafeLayoutEffect } from "@chakra-ui/react";

const sdk = new ThirdwebSDK("rinkeby");
const bundleDropModule = sdk.getBundleDropModule(process.env.REACT_APP_BUNDLE_DROP_ADDRESS);
const tokenModule = sdk.getTokenModule(process.env.REACT_APP_TOKEN_ADDRESS);
const voteModule = sdk.getVoteModule(process.env.REACT_APP_VOTE_MODULE_ADDRESS);

export const DAOContext = createContext({
  sdk,
  bundleDropModule,
  tokenModule,
  voteModule,
  propopsals: [],
  actions: {}
});

export const DAOProvider = (props) => {
  const [proposals, setProposals] = useState([]);
  const { address: walletAddress } = useWeb3();

  const [error, setError] = useState(null);
  const [xState, setXState] = useState('init');

  const addProposalVote = async ({ link, genre }) => {
    setXState('loading')
    try {
      const amount = 1_000;
      const response = await voteModule.propose(
        JSON.stringify({ link, amount, genre }),
        [
          {
            nativeTokenValue: 0,
            transactionData: tokenModule.contract.interface.encodeFunctionData(
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
      fetchProposals()
      console.log(
        "✅ Successfully created proposal to reward ourselves from the treasury, let's hope people vote for it!", { response }
      );
    } catch (error) {
      console.error("failed to create second proposal", error);
      setError(error)
      setXState('error')
    }
  }
  // const resetActionState = () => {
  //   setXState('init')
  //   setError(null)
  // }

  const fetchProposals = () => {
    voteModule
      .getAll()
      .then((response) => {
        setProposals(response.map((proposal) => {
          const { amount, link, genre } = jsonParser(proposal.description)
          return ({ ...proposal, amount, link, genre })
        }).reverse());
      })
      .catch((err) => {
        console.error("failed to get proposals", err);
      });
  }

  useSafeLayoutEffect(() => {
    fetchProposals()
  }, []);

  return <DAOContext.Provider value={ {
    sdk,
    bundleDropModule,
    tokenModule,
    voteModule,
    proposals,
    actions: { fetchProposals, addProposalVote, state: xState, error }
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
  const { voteModule, proposals, actions } = useContext(DAOContext)

  return { voteModule, proposals, actions }
}
