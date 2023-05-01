import { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { MulticallContractWeb3 } from "../../../hooks/useContracts";
import { getWeb3 } from "../../../hooks/connectors";
import { toast } from "react-toastify";
import { contract } from "../../../hooks/constant";
import { currencies } from "../../../hooks/currencies";
import managerAbi from "../../../json/poolManager.json";

export const usePadStatus = (updater) => {
  const context = useWeb3React();
  const { chainId, account } = context;

  let web3 = getWeb3(chainId);

  let managerAddress = contract[chainId]
    ? contract[chainId].poolmanager
    : contract["default"].poolmanager;

  const [stats, setStats] = useState({
    totalLiquidityRaised: 0,
    totalProjects: 0,
    totalParticipants: 0,
    totalValueLocked: 0,
  });

  const mc = MulticallContractWeb3(chainId);
  let pmc = new web3.eth.Contract(managerAbi, managerAddress);

  useEffect(() => {
    const fetch = async () => {
      try {
        const methods = [
          pmc.methods.getETHPrice(),
          pmc.methods.totalParticipants(),
          pmc.methods.getTotalNumberOfPools(),
        ];

        currencies["default"].forEach((element) => {
          methods.push(pmc.methods.totalValueLocked(element["address"]));
          methods.push(pmc.methods.totalLiquidityRaised(element["address"]));
        });

        const data = await mc.aggregate(methods);

        let tvl = data[3] * data[0];
        let tlr = data[4] * data[0];

        for (let i = 5; i < data.length; i += 2) {
          tvl += data[i] * 10 ** 18;
          tlr += data[i + 1] * 10 ** 18;
        }

        setStats({
          totalLiquidityRaised: (tlr / 10 ** 36).toFixed(2),
          totalProjects: data[2],
          totalParticipants: data[1],
          totalValueLocked: (tvl / 10 ** 36).toFixed(2),
        });
      } catch (err) {
        toast.error(err.reason);
      }
    };

    if (mc) {
      fetch();
    } else {
      setStats({
        totalLiquidityRaised: 0,
        totalProjects: 0,
        totalParticipants: 0,
        totalValueLocked: 0,
      });
    }
    // eslint-disable-next-line
  }, [updater, chainId]);

  return stats;
};
