import React,{useState,useEffect} from 'react'
import { useNavigate } from "react-router-dom";
import {useParams} from "react-router-dom";
import Modal from 'react-bootstrap/Modal';
import { ethers } from "ethers";
import {masteraddress,masterABI,clientContract} from '../../assets/keys/master';
import {REACT_APP_NODE_ENDPOINT,REACT_APP_NODE_USERNAME,REACT_APP_NODE_PASSWORD} from '../../assets/keys/nodeRPC';
import Map from "mapmyindia-react";
import axios from 'axios';
import './dashboard.css';

// import { ScriptLoader } from 'react-use-scripts';

const Dash=()=>{
    
    let navigate = useNavigate();
    let {email}=useParams();
    
    // states and function for the modal    
    const [show, setShow] = useState(true);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    //states for the storage of the user data...
    const [manager, setmanager] = useState(null);
    const [signer,setSigner]=useState(null);

    //state for the city capture
    const [city, setCity] = useState("0");
    //charger data complete..
    const [chargerData, setChargerData] = useState(null);
    //charger data from contract..
    const [chargerContractData, setChargerContractData] = useState(null);
    //charger data-data for the map
    const [cData, setCData] = useState(null);
    const [displayMap,setDisplayMap] = useState(false);

    //lat and long for the center of the map... setting the first location on list as center
    const [lat, setLat] = useState("")
    const [long, setLong] = useState("")

    useEffect(() => {        
        if(window.sessionStorage.getItem("manager")){             
             handleClose();
        }              
     }, [])

    useEffect(() => {      
        setDisplayMap(false);          
        const config  = {headers: {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
        }}
        if(city!=="0" && city!==""){
            axios.post('http://localhost:3001/getchargerz', JSON.stringify({city:city}),config).then(function (response) {              
            if(response.data.status==="success"){
                console.log(response.data.message); 
                setChargerData(response.data.message); 
                let filterData=[];
                try{
                    for(var i=0;i<response.data.message.length;i++){
                        if(i==0){
                            setLat(response.data.message[i].loc.lat);
                            setLong(response.data.message[i].loc.lon);
                        }
                        filterData.push({position:[response.data.message[i].loc.lat,response.data.message[i].loc.lon],title: "marker"+i})
                    }
                setCData(filterData);
                setTimeout(()=>{                    
                    setDisplayMap(true);
                },500);

                }catch{
                    console.log("for error");
                }
                                          
            }else{
                console.log("failed");
            }
            })
            .catch(function (error) {
                alert("error ");
            });
        }else{
            setChargerContractData(null);
            setChargerData(null);
            setCData([{position: [11.228694749852345,76.95922885090114],title: "home location",}]);
            setTimeout(()=>{ 
                setDisplayMap(true);
            },500);
        }                             
    }, [city])

    useEffect(() => {
        (async()=>{
            var data2=[];
            if(chargerData!==null){   
                // const provider =new ethers.providers.Web3Provider(window.ethereum)             
                let provider = new ethers.providers.JsonRpcProvider({
                    url: REACT_APP_NODE_ENDPOINT,
                    user: REACT_APP_NODE_USERNAME,
                    password: REACT_APP_NODE_PASSWORD,                    
                }); 
                // headers:{
                    //     "Access-Control-Allow-Origin" : "http://localhost:3000" ,                       
                    //     "Access-Control-Allow-Methods":  "GET,PUT,POST,DELETE,PATCH,OPTIONS",
                    //     'Content-Type': 'application/json; charset=utf-8',
                    //     'Accept': 'application/json',
                    //     'Accept-Encoding': 'gzip, deflate, br',
                    //     'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
                    //     'referer': 'https://xxxxx.com/'
                    // }
                // console.log(provider);
                // provider.connection.headers = {
                    // 'Content-Type': 'application/json; charset=utf-8',
                    // 'Accept': 'application/json',
                    // 'Accept-Encoding': 'gzip, deflate, br',
                    // 'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
                    // 'referer': 'https://xxxxx.com/,
                    // "Access-Control-Allow-Origin": "*",
                    // "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                // }
                for(var i=0;i<chargerData.length;i++){                    
                    console.log(chargerData[i].contractAddress);
                    const contract =await new ethers.Contract(chargerData[i].contractAddress, clientContract, provider); 
                    const data=await contract.getSpecificCharger1(chargerData[i].indexLocation).then((res)=>{  
                        console.log(res);
                        data2.push(res);
                    })

                    // const config  = {headers: {
                    //     'Content-Type': 'application/json',
                    //     "Access-Control-Allow-Origin": "*",
                    //     "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
                    // }}
                    // axios.post('http://localhost:3001/getchargerdata', JSON.stringify({contractAddress:chargerData[i].contractAddress,indexLocation:chargerData[i].indexLocation}),config).then(function (response) {              
                    //     if(response.data.status==="success"){
                    //        console.log(response.data);                                                                                 
                    //     }else{
                    //         console.log("failed");
                    //     }
                    //     })

                }     
                setChargerContractData(data2);            
            }            
        })();
    }, [chargerData])

    const getLocation=(lat,lng)=>{
        let url='https://apis.mapmyindia.com/advancedmaps/v1/c5251a63db5287924d354708595b947e/rev_geocode?lat='+lat+'&lng='+lng
        axios.get(url, {})
          .then(function (response) {
            // console.log(response.data);
            setToast(response.data);
          })
    }

    const [toast,setToast] = useState(null);

    const walletStatus=()=>{
        handleClose();        
    }


    return(
        <div>
            <nav className="navbar navbar-primary bg-primary py-2 px-3 mb-0"  style={{borderBottom:"1px solid #eee"}}>
                <h1 className="font-1 text-light">Easy Charge</h1>
                <div className='ml-auto font-3'>                       
                    {/* <span 
                        className=" text-light fw-bold"
                        
                        >help</span> */}
                        <span 
                            className="text-light fw-bold mx-4"
                            onClick={()=>{
                                navigate("/user/"+email)
                            }}
                        >Profile</span>                        
                    <button className='btn btn-dark font-3 fw-bold me-3' disabled><img src="https://img.icons8.com/color/25/null/ethereum.png"/>{window.sessionStorage.getItem("manager")?window.sessionStorage.getItem("manager").slice(0, 7)+"...":null}</button>                 
                    <button 
                        className='btn btn-light fw-bold badge-pill px-3'
                        onClick={()=>{navigate("/")}}
                        >Signout</button>
                </div>
            </nav>
            
            <div className="mt-0 ">
                {/* <div className='py-5'>
                    <div className='container'>
                    <div className='row'>
                        <div className='col-sm-7 p-0' >
                        <h1 className='font-2 text-light pt-5'>India's First<br/> Public EV Charging Network on Blockchain</h1>                        
                        <h5 className='font-3 text-dark fw-bold mt-3 mb-5'>Fueled by Coinbase & Ethereum</h5>
                        <h5 className='font-4 text-light fw-bold'>Of the people, by the people, for the people </h5>

                        </div>
                        <div className='col-sm-5 p-0'>
                            <img className='side-img p-5' src={Wallpaper} widht="100%" />
                        </div>
                    </div>
                    </div>
                </div> */}

                
                <div className='mx-3 mt-3'>
                    <h2 className='text-center font-3 my-4 text-muted'>Search for nearby Chargers</h2>
                    <div className='row m-0'>  

                        <div className='col-md-7 p-0'>                            
                            {/* <p>{toast}</p>            */}
                            <div className='px-2'>
                                {chargerContractData && chargerData?                                    
                                    <div>
                                        {chargerContractData && chargerContractData.map((entry,index)=>{
                                            return(
                                                <div className='card  p-1 mx-0 my-2' key={index}>
                                                    <div className='row'>
                                                        <div className="col-2 text-center">
                                                            <button 
                                                                className='btn  '
                                                                onClick={()=>{
                                                                    window.sessionStorage.setItem('cAddress', chargerData[index].contractAddress);
                                                                    window.sessionStorage.setItem('cIndex', chargerData[index].indexLocation);
                                                                    navigate("/simulator/"+chargerData[index].contractAddress)
                                                                }}
                                                                >
                                                                <img className='mt-2' style={{margin:"auto"}} src="https://img.icons8.com/external-xnimrodx-blue-xnimrodx/64/null/external-charger-smart-city-xnimrodx-blue-xnimrodx.png"/>
                                                            </button>                                                            
                                                        </div>
                                                        <div className="col-8">
                                                            <h5 className='mb-1'>{entry[1]}</h5>
                                                            <p className='my-1 text-muted '>{entry[2].split("&&")[2]}</p>
                                                            <p className='my-1'>chargers: {ethers.BigNumber.from(entry[4]).toNumber()}/{ethers.BigNumber.from(entry[3]).toNumber()}</p>
                                                        </div>
                                                        <div className='col-2'>
                                                            <p className='my-1 font-4 fw-bold'>₹{ethers.BigNumber.from(entry[5]).toNumber()} / Kwh</p>
                                                            {entry[7]?
                                                                <p className='bg-success text-center font-3 fw-bold text-light m-0 ps-2' style={{position:"absolute",bottom:"0px",right:"0px"}}>Active</p>
                                                            :
                                                                <p className='bg-dark text-center font-3 fw-bold text-light m-0 ps-2' style={{position:"absolute",bottom:"0px",right:"0px"}}>Maintanance</p>
                                                            }
                                                            
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })                                        
                                        }                                                                                
                                    </div>
                                :
                                <div>
                                    <p className='alert alert-primary text-center font-3'>select an city to view available chargers</p>
                                </div>
                                }
                            </div>
                        </div>

                        <div className='col-md-5 p-0 '>
                            {!show?
                                <div className='floater-search card bg-grey shadow p-2'>
                                    {/* <h5 className='font-3  text-center text-secondary'>connected to </h5> */}
                                    <select 
                                        className="form-select font-3 text-dark bg-grey input-floater"
                                        onChange={(e)=>{
                                            setCity(e.target.value);
                                        }}
                                        value={city}
                                        >
                                        <option selected className='text-center' value="0">- - Search nearby chargers - -</option>
                                        <option value="Coimbatore">Coimbatore</option>
                                        <option value="Chennai">Chennai</option>
                                        <option value="Bengaluru">Bengaluru</option>
                                    </select>                                    
                                </div> 
                            :null}
                            
                            <div className='card shadow map-card'>                                
                                
                                {displayMap ?
                                     <Map
                                        search={false}
                                        location={true}
                                        zoomControl={true}
                                        // 11.228694749852345,76.95922885090114
                                        center={[lat,long]}
                                        zoom={12}
                                        markers={cData}
                                    />
                                    :
                                    null                                    
                                }
                                
                            </div>
                            
                        </div>                        
                    </div>
                </div>
                


              
                



            
            <footer className="bg-primary py-5 mt-5">
                <div className="container">
                    <p className='text-center font-3 text-light'>Made with ❤️ in INDIA</p>
                    <div className="small text-center text-light font-4">Copyright © Then, Now & Forever - Easy Charge</div>
                </div>
            </footer>

            {/* popup */}
              <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
                className='my-modal-01'
                >
                <Modal.Header>
                <Modal.Title><span className='text-primary font-1 display-4'>Easy Charge</span></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h5 className='font-3 mb-3 text-center'>Connect your wallet to explore!</h5>
                    <button 
                        className='btn-full-width btn btn-lg btn-primary mt-4 font-weight-bold font-3 fw-bold'
                        onClick={async()=>{
                            const provider =new ethers.providers.Web3Provider(window.ethereum.providers.find((x) => x.isCoinbaseWallet))
                            await provider.send("eth_requestAccounts",[])                            
                            const signer =await provider.getSigner()   
                            await setSigner(signer);                          
                            window.sessionStorage.setItem('signer',signer);   
                            const manager=await signer.getAddress()
                            await setmanager(manager); 
                            window.sessionStorage.setItem('manager',manager);
                            window.sessionStorage.setItem('wallet','coinbase');
                            if(signer !== null){                                    
                                walletStatus();
                            }  
                        }}>
                        Coinbase Wallet <img className=" image-icon" src="https://play-lh.googleusercontent.com/wrgUujbq5kbn4Wd4tzyhQnxOXkjiGqq39N4zBvCHmxpIiKcZw_Pb065KTWWlnoejsg"/>
                    </button>
                    <button 
                        className='btn-full-width btn btn-lg btn-outline-dark mt-4 font-weight-bold font-3 fw-bold'
                        onClick={async()=>{
                            const provider =new ethers.providers.Web3Provider(window.ethereum.providers.find((x) => x.isMetaMask))
                            await provider.send("eth_requestAccounts",[])                            
                            const signer =await provider.getSigner()   
                            await setSigner(signer);                          
                            window.sessionStorage.setItem('signer',signer);   
                            const manager=await signer.getAddress()
                            await setmanager(manager); 
                            window.sessionStorage.setItem('manager',manager);
                            window.sessionStorage.setItem('wallet','metamask');
                            if(signer !== null){                                    
                                walletStatus();
                            }  
                        }}
                    >Metamask Wallet<img className="image-icon" src="https://img.icons8.com/color/64/000000/metamask-logo.png"/>
                </button>
                    
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>

            </div>
        </div>
    )
}
export default React.memo(Dash);