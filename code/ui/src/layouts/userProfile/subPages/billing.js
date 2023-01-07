import React,{useState,useEffect} from 'react';
import { ethers } from "ethers";
import {masteraddress,masterABI} from '../../../assets/keys/master';
import {REACT_APP_NODE_ENDPOINT,REACT_APP_NODE_USERNAME,REACT_APP_NODE_PASSWORD} from '../../../assets/keys/nodeRPC';

const Billing =()=>{

    const [walletData,setWalletData] = useState(null);

    const [transaction, setTransaction] = useState(null);

    useEffect(() => {
        (async()=>{
            const provider = new ethers.providers.JsonRpcProvider({
                url: REACT_APP_NODE_ENDPOINT,
                user: REACT_APP_NODE_USERNAME,
                password: REACT_APP_NODE_PASSWORD,
             });                              
            const contract =await new ethers.Contract(masteraddress, masterABI, provider); 
            const data=await contract.viewUser(window.sessionStorage.getItem("userID")).then((res)=>{
                console.log(res)
                if(res[1]==="0x0000000000000000000000000000000000000000"){
                    
                }else{
                    setWalletData(res);
                    fetchData();
                }
            })
        })()              
    }, [])

    const fetchData=async()=>{        
        const provider = new ethers.providers.JsonRpcProvider({
            url: REACT_APP_NODE_ENDPOINT,
            user: REACT_APP_NODE_USERNAME,
            password: REACT_APP_NODE_PASSWORD,
         }); 
        const contract =await new ethers.Contract(masteraddress, masterABI, provider); 
        const data=await contract.getRechargeData(window.sessionStorage.getItem("userID")).then((res)=>{
            // console.log(res)
            var tempRes=[...res];
            if(res.length>=1){
                //manupulate timestamp
                
                for(var i=0;i<res.length;i++){
                    let t2=[... tempRes[i]];
                    // console.log(t2);
                    // console.log(t2[i][3]);
                    let dateR= new Date(parseInt(t2[3]));
                    t2[3]=dateR.toLocaleString ( );

                    tempRes[i]=t2;
                }
                setTransaction(tempRes);
            }
        })
    }

    return(
        <div className='p-4 mb-5'>
            <h4 className='text-secondary pb-2'>Transactions:</h4>
            <hr/>
            <table className='table table-hover table-sm table-striped table-responsive-md'>
                <thead className="font-4">
                    {/* <td></td> */}
                    <td>Type</td>
                    <td>Receiver</td>
                    <td>Amount</td>
                    <td>Timestamp</td>                    
                </thead>
                <tbody className='font-3'>
                    {
                         transaction && transaction.map((entry,index)=>{
                            return(
                                <tr key={index}>
                                    {/* <td className="text-center">{ethers.BigNumber.from(entry[4])==1?<img src="https://img.icons8.com/fluency/30/null/request-money.png"/>:null}</td> */}
                                    <td>{entry[0]}</td>
                                    <td>{entry[1]}</td>
                                    <td>{ethers.utils.formatEther(entry[2])} <img src="https://img.icons8.com/color/25/null/ethereum.png"/></td>
                                    <td>{entry[3]}</td>
                                    
                                </tr>
                            )                            
                         })
                    }

                                                            
                </tbody>
            </table>
        </div>
    )
}
export default React.memo(Billing);