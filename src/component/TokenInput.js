import React, { useState } from 'react';
import LoaderComponent from './LoaderComponent';
import { getWeb3Contract } from '../hooks/contractHelper';
import tokenAbi from '../json/token.json';
import { getWeb3 } from '../hooks/connectors';
import { useWeb3React } from "@web3-react/core";
import { contract } from '../hooks/constant';
import managerAbi from '../json/poolManager.json';


export default function TokenInput(props) {
  const context = useWeb3React();
  const { chainId, account } = context;
  let { setValue, value } = props;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');



  const handleInput = async (e) => {
    try {
      // e.preventDefault();
      let web3 = getWeb3(chainId);
      let checkAddress = await web3.utils.isAddress(e.target.value);
      if (checkAddress) {
        let checkSumaddress = await web3.utils.toChecksumAddress(e.target.value)
        let isCode = await web3.eth.getCode(e.target.value);
        if (!checkSumaddress || isCode === '0x') {
          setError('Please Enter Valid Address !');
        }
        else {
          let managerAddress = contract[chainId] ? contract[chainId].poolmanager : contract['default'].poolmanager;
          let poolContract = await getWeb3Contract(managerAbi, managerAddress, chainId);
          let poolForToken = await poolContract.methods.poolForToken(e.target.value).call();
          
          if (poolForToken === '0x0000000000000000000000000000000000000000') {
            let tokenContract = await getWeb3Contract(tokenAbi, e.target.value, chainId);
            let tokenName = await tokenContract.methods.name().call();
            let tokenDecimal = await tokenContract.methods.decimals().call();
            let tokenSymbol = await tokenContract.methods.symbol().call();
            let checkApprove = account ? await tokenContract.methods.allowance(
              account,
              contract[chainId] ? contract[chainId].poolfactory : contract['default'].poolfactory
            ).call() : false;
            if (tokenDecimal > 0) {
              let isApprove = checkApprove ? (checkApprove / Math.pow(10, tokenDecimal) > 10000000000000000000) ? true : false : false;
              setValue({ ...value, ispoolExist : false ,"tokenAddress": e.target.value, tokenName, tokenDecimal, tokenSymbol, isApprove });
              setError('');
            }
            else {
              setValue({ ...value, ispoolExist : false ,"tokenAddress": e.target.value, tokenName: "", tokenDecimal: "", tokenSymbol: "", isApprove: false });
              setError('Please Enter Valid token address !');
            }
          }
          else{
            setValue({ ...value,ispoolExist : true ,"tokenAddress": e.target.value, tokenName: "", tokenDecimal: "", tokenSymbol: "", isApprove: false });
            setError('This Token pool already exists.!');
          }
        }
      }
      else {
        setValue({ ...value, ispoolExist : false , "tokenAddress": e.target.value, tokenName: "", tokenDecimal: "", tokenSymbol: "", isApprove: false });
        setError('Please Enter Valid Address !');
      }
    }
    catch (err) {
      setError(err.reason);
    }
    setIsLoading((prev) => !prev);
    return false;
  }

  return (
    <React.Fragment>
      <div className="col-md-12">
        <div className="form-group">
          <label>Token address <span className='text-danger'>*</span></label>
          <input className="form-control" type="text" name="name" placeholder="" onChange={(e) => { handleInput(e); setIsLoading(true); }} />
          <small className='text-danger'>{error}</small>
        </div>

        {isLoading === true ? (<LoaderComponent status={isLoading} />) : (
          value.tokenName !== '' && value.tokenDecimal && value.tokenSymbol && value.tokenAddress &&
          <React.Fragment>
            <div className='mt-3 d-flex justify-content-between card-span'>
              <span>Name</span>
              <span>{value.tokenName}</span>
            </div>
            <div className='mt-2 d-flex justify-content-between card-span'>
              <span>Symbol</span>
              <span>{value.tokenSymbol}</span>
            </div>
            <div className='mt-2 d-flex justify-content-between card-span'>
              <span>Decimal</span>
              <span>{value.tokenDecimal}</span>
            </div>
          </React.Fragment>
        )}
      </div>
    </React.Fragment>
  )
}
