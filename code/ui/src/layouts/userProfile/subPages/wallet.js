import React,{useState,useEffect} from 'react';
import { ethers } from "ethers";
import {masteraddress,masterABI} from '../../../assets/keys/master';
import {REACT_APP_NODE_ENDPOINT,REACT_APP_NODE_USERNAME,REACT_APP_NODE_PASSWORD} from '../../../assets/keys/nodeRPC';
import Modal from 'react-bootstrap/Modal';

const Wallet =({data})=>{    

    // states and function for the modal    
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //for trigger refresh
    const [refresh, setRefresh] = useState(false);

    //for page
    const [walletState, setWalletState] = useState(null);
    const [walletData,setWalletData] = useState(null);

    const [modalSelecter,setModalSelecter] = useState(0);
    //for addmoney
    const [value, setValue] = useState("");
    //for withdraw money
    const [value2, setValue2] = useState("");
    //useEffect for the user wallet present on the contract- for page status.
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
                    setWalletState(false);
                }else{
                    setWalletState(true);
                    setWalletData(res);
                }
            })
        })()              
    }, [refresh])

    const addMoney=async(event)=>{
        event.preventDefault();
        const timestamp = ""+Date.now();
        let provider =new ethers.providers.Web3Provider(window.ethereum)  
        const signer=provider.getSigner();                              
        const contract =await new ethers.Contract(masteraddress, masterABI, signer);
        const options = {value: ethers.utils.parseUnits(value, "ether")};        
        const data=await contract.AddMoney(window.sessionStorage.getItem("userID"),timestamp,options).then((res)=>{
                console.log(res)           
                handleClose();
                setValue("");
                setValue("");                
                setRefresh(res?!refresh:!refresh);                        
        })
    }

    const withdraw=async(event)=>{
        event.preventDefault();
        const timestamp = ""+Date.now();
        let provider =new ethers.providers.Web3Provider(window.ethereum)  
        const signer=provider.getSigner();                              
        const contract =await new ethers.Contract(masteraddress, masterABI, signer);
        // const options = {value: ethers.utils.parseUnits(value2, "ether")};
        const data=await contract.withdraw(window.sessionStorage.getItem("userID"),ethers.utils.parseUnits(value2, "ether"),timestamp).then((res)=>{
            console.log(res)           
            handleClose();
            setValue("");
            setValue("");                
            setRefresh(res?!refresh:!refresh);                      
    })
    }
    
    return(
        <div className='p-4 mb-5'>
            {walletState && walletState!==null?
                <div  className=''>
                    <h4 className='text-secondary pb-2'>Wallet :</h4>
                    <hr/>
                    <table className='table font-3'>
                        <tbody>
                            <tr>
                                <td className="pe-3">User ID  </td>
                                <td className='text-primary'>{walletData?walletData[0]:null}</td>
                            </tr>
                            <tr>
                                <td className="pe-3">Linked wallet </td>
                                <td className='text-primary'>{walletData?walletData[1]:null}</td>
                            </tr>
                            {/* <tr>
                                <td>Name  </td>
                                <td className='text-primary'>{walletData?walletData[2]:null}</td>
                            </tr> */}
                            <tr>
                                <td>Balance  </td>
                                <td className='text-primary'>{walletData?ethers.utils.formatEther(walletData[3]):0 } ETH</td>
                            </tr>
                        </tbody>
                    </table>
                    <button 
                        className='btn btn-primary me-3 shadow fw-bold'
                        onClick={()=>{
                            handleShow()
                            setModalSelecter(0);
                        }}
                        >Add ETH</button>
                    <button 
                        className='btn  btn-outline-primary shadow fw-bold'
                        onClick={()=>{
                            handleShow()
                            setModalSelecter(1);
                        }}
                        >Withdraw ETH</button>
                </div>
                :
                <div>
                    <div className="alert alert-warning alert-dismissible  fade show" role="alert">
                        You need to create a wallet on the network!
                    </div>                   
                    <button 
                        className='btn btn-success font-4 fw-bold px-4'
                        onClick={async()=>{
                            if(window.sessionStorage.getItem("wallet")==="coinbase"){
                                //for coinbase
                                const provider =new ethers.providers.Web3Provider(window.ethereum.providers.find((x) => x.isCoinbaseWallet))                                       
                                const signer =await provider.getSigner();                                                                
                                const contract =await new ethers.Contract(masteraddress, masterABI, signer);                            
                                let statusUser=await contract.createAccount(window.sessionStorage.getItem("userID"),window.sessionStorage.getItem("userName")).then((result)=>{
                                    console.log(result)
                                    if(result==="success"){
                                        //user created
                                        // alert("ok");
                                        setWalletState(true);
                                    }else{
                                        // alert("Error in creating the wallet. try after sometime.");
                                    }
                                })                                                                
                            }else{
                                //for metamask                                
                                const provider =new ethers.providers.Web3Provider(window.ethereum.providers.find((x) => x.isMetaMask))                                
                                const signer =await provider.getSigner();                                
                                const contract =await new ethers.Contract(masteraddress, masterABI, signer);                                                                                             
                                let statusUser=await contract.createAccount(window.sessionStorage.getItem("userID"),window.sessionStorage.getItem("userName"),{gasLimit: 50000}).then((result)=>{
                                    console.log(result)
                                    if(result==="success"){
                                        //user created
                                        // alert("ok");
                                        setWalletState(true);
                                    }else{
                                        // alert("Error in creating the wallet. try after sometime.");
                                    }
                                })
                            }
                        }}
                        >Create wallet</button>
                </div>
            }


            {/* popup */}
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="dynamic"
                keyboard={false}
                centered
                >
                <Modal.Header>
                <Modal.Title><span className='text-primary font-1 display-4'>Easy Charge</span></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalSelecter===0?
                        <form className="py-2" onSubmit={addMoney}>
                            <div className="form-group">                                        
                                <label htmlFor="n1" className='text-secondary font-4 fw-normal mb-2'>Enter the amount of ETH :</label>
                                <input 
                                    type="number"
                                    step="0.0000001"
                                    name="n1" 
                                    id="n1"
                                    required 
                                    autoFocus
                                    className="form-control text-dark fw-bold" 
                                    placeholder="ETH"
                                    value={value}
                                    onChange={(e)=>{setValue(e.target.value)}}
                                    />
                            </div>
                            <div className='row mt-3'>
                                <div className='col-6'>
                                    <button type="button" className='btn btn-outline-danger wid-100 fw-bold' onClick={()=>{handleClose();setValue("");}}>Close</button>
                                </div>
                                <div className='col-6'>
                                    <button type="submit" className='btn btn-primary wid-100  shadow fw-bold' onClick={()=>{}}>PAY</button>
                                </div>                                
                            </div> 
                        </form>
                    :null}
                    {modalSelecter===1?
                        <form className="py-2" onSubmit={withdraw}>
                            <div className="form-group">                                        
                                <label htmlFor="n2" className='text-secondary font-4 fw-normal mb-2'>Enter the amount of ETH :</label>
                                <input 
                                    type="number"
                                    step="0.0000001"
                                    name="n2" 
                                    required 
                                    autoFocus
                                    className="form-control text-dark fw-bold" 
                                    placeholder="ETH"
                                    value={value2}
                                    onChange={(e)=>{setValue2(e.target.value)}}
                                    />
                            </div>
                            <div className='row mt-3'>
                                <div className='col-6'>
                                    <button type="button" className='btn btn-outline-danger wid-100 fw-bold' onClick={()=>{handleClose(); setValue2("");}}>Close</button>
                                </div>
                                <div className='col-6'>
                                    <button type="submit" className='btn btn-primary wid-100  shadow fw-bold' onClick={()=>{}}>WITHDRAW</button>
                                </div>                                
                            </div> 
                        </form>
                    :null}                                                    
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>

            
        </div>
    )
}
export default React.memo(Wallet);