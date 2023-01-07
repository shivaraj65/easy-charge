import React,{useState,useEffect} from  'react';
import { useNavigate } from "react-router-dom";
import {useParams} from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import { ethers } from "ethers";
import {masteraddress,masterABI,clientContract} from '../../assets/keys/master';
import {REACT_APP_NODE_ENDPOINT,REACT_APP_NODE_USERNAME,REACT_APP_NODE_PASSWORD} from '../../assets/keys/nodeRPC';
import axios from 'axios'
import { Line } from 'rc-progress';
import './simulator.css';


const Simulator=()=>{
     
    let navigate = useNavigate();
    let {email}=useParams();

    const [walletData,setWalletData] = useState(null);
    const [contData, setContData] = useState(null);
    //states for the RTS
    const [vehType, setVehType] = useState("");
    const [charPercent, setCharPercent] = useState("");

    //states for the quick sim
    const [quickPage, setQuickPage] = useState(1);
    const [mId, setMId] = useState(null);
    const [vehicleType, setVehicleType] = useState("");
    const [carData, setCarData] = useState(null)
    const [initialCharge, setInitialCharge] = useState(null)
    const [percentageChargeLimit, setPercentageChargeLimit] = useState("");
    const [coinValue, setCoinValue] = useState(null);
    //holds the quick charging control information
    const [chargingMaster, setChargingMaster] = useState(null)
    //states for the quick validation.
    const [cashonWalletINR, setCashonWalletINR] = useState(null);


    const [currentChargeLevel, setCurrentChargeLevel] = useState(null);
    const [valueChargeLimit, setValueChargeLimit] = useState("");

    useEffect(() => {
        (async()=>{                        
                // const provider =new ethers.providers.Web3Provider(window.ethereum)             
                let provider = new ethers.providers.JsonRpcProvider({
                    url: REACT_APP_NODE_ENDPOINT,
                    user: REACT_APP_NODE_USERNAME,
                    password: REACT_APP_NODE_PASSWORD,                    
                }); 
                const contract =await new ethers.Contract(window.sessionStorage.getItem("cAddress"), clientContract, provider); 
                const data=await contract.getSpecificCharger1(window.sessionStorage.getItem("cIndex")).then((res)=>{  
                    // console.log(res);    
                    setContData(res);                
                })  
                const details=await contract.getDetails().then((res)=>{
                    setMId(res[3]);
                })  
                const contract2 =await new ethers.Contract(masteraddress, masterABI, provider); 
                const data2=await contract2.viewUser(window.sessionStorage.getItem("userID")).then((res)=>{
                    // console.log(res)
                    if(res[1]==="0x0000000000000000000000000000000000000000"){
                        setWalletData(res);
                    }else{                        
                        setWalletData(res);
                        
                    }
                })
                const config  = {headers: {
                    'Content-Type': 'application/json',
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                }}
                axios.get('https://api.coingecko.com/api/v3/coins/markets?vs_currency=inr&ids=ethereum&order=market_cap_desc&per_page=100&page=1&sparkline=false',config)
                .then(function (response) {                         
                        console.log(response.data[0].current_price);    
                        setCoinValue(response.data[0].current_price);                
                })
                .catch(function (error) {
                    alert("error");
                });

        })();
    }, [])

    const handlerQuickSim=async(event)=>{
        event.preventDefault();
        let data;
        //set random initial charge percentage...
        const initial =Math.floor(Math.random() * (parseInt(percentageChargeLimit)-20 - 20 + 1) + 20);        
        setInitialCharge(initial);
        setCurrentChargeLevel(initial);
        console.log(initial);
        
        //calculating INR on wallet
        console.log("INR in wallet: "+ethers.utils.formatEther(walletData[3])*coinValue);                
        setCashonWalletINR(ethers.utils.formatEther(walletData[3])*coinValue);

        //calculating the maximum possible kwh chargeable..


        //calculating maximum kwH needed to charge..
        let neededCharge = ( parseInt(percentageChargeLimit)-initial )* carData.battery /100;
        console.log(neededCharge);
        //check for charging with amount/charge
        if(neededCharge*ethers.BigNumber.from(contData[5]).toNumber() <= ethers.utils.formatEther(walletData[3])*coinValue){
            console.log("chargeable"+neededCharge*ethers.BigNumber.from(contData[5]).toNumber() );    
            
            //set the master control data prop
            data={
                quick:true,
                fullCharge: true,
                chargingUnits: neededCharge,
                chargeableAmount: neededCharge*ethers.BigNumber.from(contData[5]).toNumber(),
                chargeableinEth: neededCharge*ethers.BigNumber.from(contData[5]).toNumber() /coinValue,
                startingPercentage:initial,
                stopPercentage:parseInt(percentageChargeLimit)
            }            
            console.log(data);
            setChargingMaster(data);

        }else{
            //charge till possible
            let limitChargeKwH= ethers.utils.formatEther(walletData[3])*coinValue / ethers.BigNumber.from(contData[5]).toNumber();
            let initialKwH=initial /100 * carData.battery;
            let finalPercentage= limitChargeKwH  + initialKwH;

            //set the master control data prop
            data={
                quick:true,
                fullCharge: false,
                chargingUnits: limitChargeKwH,
                chargeableAmount: ethers.utils.formatEther(walletData[3])*coinValue,
                chargeableinEth: ethers.utils.formatEther(walletData[3]),
                startingPercentage:initial,
                stopPercentage:finalPercentage        
            }
            console.log(data);
            setChargingMaster(data);
        }
        setQuickPage(2);
        const myTimeout = setTimeout(function(){simulate("quick",data)}, 3000);
        
    }

    const simulate=async(type,data)=>{        
        let chargeLevel=data.startingPercentage;
        if(type==="quick"){      
            const provider =new ethers.providers.Web3Provider(window.ethereum) 
            const signer=provider.getSigner();  
            const contract2 =await new ethers.Contract(masteraddress, masterABI, signer); 
            const data2=await contract2.ActivateCharger(window.sessionStorage.getItem("userID"),window.sessionStorage.getItem("cAddress"),window.sessionStorage.getItem("cIndex"),1).then((res)=>{
                    for(var i=0;i<(data.stopPercentage - data.startingPercentage);i++){
                        setTimeout(function() {
                            chargeLevel+=1;
                            setCurrentChargeLevel(chargeLevel);       
                            // console.log(chargeLevel);       
        
                            if(chargeLevel == data.stopPercentage){
                                console.log("completed");
                                // start billing here
                                initiateBill(data);
                              }      
        
                          }, 2000*i);                                    
                    }
                })
                                   
        }else{

        }
    }
    const initiateBill=async(data)=>{     
        const timestamp = ""+Date.now();               
        const provider =new ethers.providers.Web3Provider(window.ethereum) 
        const signer=provider.getSigner();  
        const contract2 =await new ethers.Contract(masteraddress, masterABI, signer);
        const data2=await contract2.DeactivateCharger(window.sessionStorage.getItem("userID"),mId,window.sessionStorage.getItem("cAddress"),window.sessionStorage.getItem("cIndex"),ethers.utils.parseUnits(""+data.chargeableinEth, "ether"),timestamp).then((res)=>{
            alert("payment is being processed");
            setQuickPage(1);
        })
        //yet to be completed...

    }

    const setCar=(val)=>{          
        var data;     
            if(val==="1"){
                data={
                    car:" Tata Nexon EV",
                    battery:30
                }
            }else if(val==="2"){
                data={
                    car:" Hyundai Kona EV",
                    battery:39
                }
            }else if(val=="3"){
                data={
                    car:" KIA EV6",
                    battery:77
                }
            }else if(val==="4"){
                data={
                    car:" Volvo XC40",
                    battery:78
                }
            }else if(val=="0"){
                data={
                    car:" -",
                    battery:0
                }
            }       
        setCarData(data);                                      
    }

    return(
        <div>
            <nav className="navbar navbar-primary bg-primary py-2 px-3 mb-0"  style={{borderBottom:"1px solid #eee"}}>
                <h1 className="font-1 text-light">Easy Charge</h1>
                <div className='ml-auto font-3'>                       
                    <span 
                        className=" text-light fw-bold"
                        
                        >Home</span>
                        <span 
                            className="text-light fw-bold mx-4"
                            onClick={()=>{
                                navigate("/user/"+window.sessionStorage.getItem("userEmail"))
                            }}
                        >Profile</span>                        
                    <button className='btn btn-dark font-3 fw-bold me-3' disabled><img src="https://img.icons8.com/color/25/null/ethereum.png"/>{window.sessionStorage.getItem("manager")?window.sessionStorage.getItem("manager").slice(0, 7)+"...":null}</button>                 
                    <button 
                        className='btn btn-light fw-bold badge-pill px-3'
                        onClick={()=>{navigate("/signup")}}
                        >Signout</button>
                </div>
            </nav>

            <div className='mt-3 px-3'>
                <h1 className='text-center font-2 text-secondary'>Charging Simulation</h1>
                <hr/>                
                <div>
                    {contData?
                        <div className='my-4'>
                            <p className='font-4 text-dark mb-0'>Charger Contract Address : {window.sessionStorage.getItem("cAddress")}</p>
                            <p className='font-4 text-dark'>Name : {contData[0]}</p>
                        </div>                    
                    :null}                    
                </div>
                <hr/>
                <div className='overflw-x mt-4'>
                    <h3 className='text-center text-success font-3 fw-bold mb-3'>RTS -   Real Time Simulator</h3>
                    <p className='text-center text-secondary font-4'>This simulates individual chargers in the Grid.</p>
                    {
                        contData?
                            <div className='text-center mt-2'>
                                <div className='row mb-3 mx-5'>
                                    <div className='col-6'>
                                        <div className="form-group">                                        
                                                <label className='text-dark font-4 fw-normal'>Select vehicle type :</label>
                                                <select 
                                                    className="form-select text-dark fw-bold"
                                                    onChange={(e)=>{
                                                        setVehType(e.target.value);
                                                        setCar(e.target.value);
                                                    }}
                                                    value={vehType}
                                                    >
                                                    <option selected className='text-center' value="0">- - Select - -</option>
                                                    <option value="1">Tata Nexon EV</option>
                                                    <option value="2">Hyundai Kona EV</option>
                                                    <option value="3">KIA EV6</option>
                                                    <option value="4">Volvo XC40</option>
                                                </select> 
                                            </div>
                                    </div>
                                    <div className='col-6'>
                                        <div className="form-group  ">                                        
                                                <label className='text-dark font-4 fw-normal '>Enter the limit to charge </label>
                                                <input 
                                                    type="number"                                                                   
                                                    required                                         
                                                    className="form-control text-dark fw-bold" 
                                                    placeholder="enter in percentage"
                                                    value={charPercent}
                                                    onChange={(e)=>{setCharPercent(e.target.value)}}
                                                    />
                                            </div> 
                                    </div>

                                </div>
                                {                                    
                                    Array.apply(null, { length: ethers.BigNumber.from(contData[3]).toNumber() -  ethers.BigNumber.from(contData[4]).toNumber()   }).map((e, i) => (                                                                                
                                            <span className="card-custom-x card p-2 m-1 bg-dark shadow text-center" key={i}>
                                                <p className='text-secondary fw-bold'>Charger Occupied</p>        
                                                <p className='font-4 text-light m-0'>Speed :{ethers.BigNumber.from(contData[6]).toNumber()} KwH</p>
                                                <p className='font-3 mb-2 text-secondary'>₹/kWh : ₹{ethers.BigNumber.from(contData[5]).toNumber()} </p>                                        
                                                <button className='btn btn-success fw-bold font-3 ' disabled>Simulate Charging</button>
                                            </span>                                                                            
                                        
                                        ))                                        
                                }
                                {
                                    Array.apply(null, { length: ethers.BigNumber.from(contData[4]).toNumber()  }).map((e, i) => (                                                                                
                                        <span className="card-custom-x card p-2 m-1 bg-light shadow text-center" key={i}>
                                            <p className='font-3 text-primary fw-bold'>Charger Available</p>
                                            <p className='font-4 m-0'>Speed :{ethers.BigNumber.from(contData[6]).toNumber()} KwH</p>
                                            <p className='font-3 mb-2 text-secondary'>₹/kWh : ₹{ethers.BigNumber.from(contData[5]).toNumber()} </p>
                                            <button className='btn btn-outline-success fw-bold font-3 '>Simulate Charging</button>
                                        </span>                                                                            
                                    
                                    ))
                                }
                                
                            </div>
                        :null
                    }
                </div>
                <hr/>
                <div className='text-center mt-4'>
                    <h3 className='text-success font-3 fw-bold mb-3'>Quick Simulator</h3>
                    <div className='card card-custom-x-1 px-3 shadow'>
                        {quickPage===1?
                             <form className="py-2" onSubmit={handlerQuickSim}>  
                                <div className="form-group">                                        
                                    <label className='text-dark font-4 fw-normal mb-2'>Select vehicle type :</label>
                                    <select 
                                        className="form-select text-dark fw-bold"
                                        onChange={(e)=>{
                                            setVehicleType(e.target.value);
                                            setCar(e.target.value);
                                        }}
                                        value={vehicleType}
                                        >
                                        <option selected className='text-center' value="0">- - Select - -</option>
                                        <option value="1">Tata Nexon EV</option>
                                        <option value="2">Hyundai Kona EV</option>
                                        <option value="3">KIA EV6</option>
                                        <option value="4">Volvo XC40</option>
                                    </select> 
                                </div>                   
                                <div className="form-group mb-3">                                        
                                    <label className='text-dark font-4 fw-normal '>Enter the limit to charge </label>
                                    <input 
                                        type="number"                                                                   
                                        required                                         
                                        className="form-control text-dark fw-bold" 
                                        placeholder="enter in percentage"
                                        value={percentageChargeLimit}
                                        onChange={(e)=>{setPercentageChargeLimit(e.target.value)}}
                                        />
                                </div>                                                                                      
                                <button 
                                    className="btn btn-outline-success font-3 fw-bold my-3 signup-button" 
                                    type="submit"
                                    style={{letterSpacing: "4px"}}
                                    >START SIM</button>                            
                            </form>                        
                        :null}
                        {quickPage==2?
                            <div className='p-2'>
                                <p className='font-3 fw-bold'>Charging</p>
                                <p className='font-3 text-secondary mb-0'>Car : {carData.car}</p>
                                <p  className='font-3 text-secondary'>Max capacity : {carData.battery} KwH</p>
                                <p>Current Charge level : {currentChargeLevel}%</p>

                                <Line percent={currentChargeLevel} strokeWidth={2} strokeColor="#0d6efd" />

                            </div>
                        :null}
                    </div>
                </div>                                    
                
            </div>
            <footer className="bg-primary py-5 mt-5">
                <div className="container">
                    <p className='text-center font-3 text-light'>Made with ❤️ in INDIA</p>
                    <div className="small text-center text-light font-4">Copyright © Then, Now & Forever - Easy Charge</div>
                </div>
            </footer>
                            
        </div>
    )
};

export default React.memo(Simulator);