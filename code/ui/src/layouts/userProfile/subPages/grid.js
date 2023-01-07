import React,{useState,useEffect} from 'react';
import { useNavigate } from "react-router-dom";
import { ethers } from "ethers";
import {masteraddress,masterABI,clientContract} from '../../../assets/keys/master';
import {REACT_APP_NODE_ENDPOINT,REACT_APP_NODE_USERNAME,REACT_APP_NODE_PASSWORD} from '../../../assets/keys/nodeRPC';
import Modal from 'react-bootstrap/Modal';
import Map from "mapmyindia-react";
import axios from 'axios';

const Grid =()=>{
    let navigate = useNavigate();

    const [page, setPage] = useState(0);
    const [page2, setPage2] = useState(1);

    // states and function for the modal    
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // states and function for the modal    
    const [show1, setShow1] = useState(false);
    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => setShow1(true);

    // states and function for the modal    
    const [show2, setShow2] = useState(false);
    const handleClose2 = () => setShow2(false);
    const handleShow2 = () => setShow2(true);

    //for trigger refresh
    const [refresh, setRefresh] = useState(false);
    //user data
    const [walletData,setWalletData] = useState(null);

    //station address
    const [Stationaddress, setStationAddress] = useState(null);
    //chargers data
    const [chargers, setChargers] = useState(null);
    //station data
    const [stationData, setStationData] = useState(null);
    //index-count
    const [indexCount,setIndexCount] = useState(null);

    //prefill data
    const [prefillIndex, setPrefillIndex] = useState(null);
    const [prefillTotalC, setPrefillTotalC] = useState(null);
    const [prefillActiveC, setPrefillActiveC] = useState(null);
    const [prefillCost, setPrefillCost] = useState(null);
    const [prefillStatus,setPrefillStatus] = useState(null);

    //fields for the dataCollection
    const [name,setName]=useState("");
    const [address, setAddress] = useState("");
    const [contact, setContact] = useState("");
    const [email,setEmail] = useState("");
    
    //states for the launchcharger form
    // const [id, setId] = useState("");
    const [cName, setCName] = useState("");
    const [lat, setLat] = useState(11.228694749852345);
    const [long, setLong] = useState(76.95922885090114);
    const [chargerCount, setChargerCount] = useState("");
    const [watt, setWatt] = useState("");
    const [chargerActive, setChargerActive] = useState("");
    const [chargePerUnit, setChargePerUnit] = useState("");
    const [pinAddress , setPinAddress] = useState("");
    //state for map refresh trigger
    const [mapFixer, setMapFixer] = useState(false);

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
                    // alert("lets create a wallet first and we can proceed further.");
                    setPage(0);
                }else{                    
                    setWalletData(res);
                    if(ethers.BigNumber.from(res[4])== -1){
                        setPage(1);
                    }else{                        
                        setPage(2);
                        getStationAddress(ethers.BigNumber.from(res[4]));
                    }
                }
            })
        })()              
    }, [refresh])

    useEffect(() => {
        (async()=>{
            await setTimeout(()=>{setMapFixer(false)}, 10);  
            await setTimeout(()=>{setMapFixer(true)}, 60);   
            getLocation(lat,long);       
        })();
    }, [lat])
    

    const getStationAddress=async(ind)=>{
        const provider = new ethers.providers.JsonRpcProvider({
            url: REACT_APP_NODE_ENDPOINT,
            user: REACT_APP_NODE_USERNAME,
            password: REACT_APP_NODE_PASSWORD,
         });                              
        const contract =await new ethers.Contract(masteraddress, masterABI, provider); 
        const data=await contract.getContract(window.sessionStorage.getItem("userID"),ind).then((res)=>{            
            setStationAddress(res);
            getChargersData(res);
            getStationDetails(res);
        })
    }

    const getStationDetails=async(res)=>{
        const providerC = new ethers.providers.JsonRpcProvider({
            url: "https://goerli.ethereum.coinbasecloud.net",
            user: "SE5K55ZYPKAOXUWHB7HB",
            password: "KZS3DQQLOLPKILSYJTR3VENZQVNUYHJ73QIWILZF"
         });                             
        const contract =await new ethers.Contract(res, clientContract, providerC); 
        const data=await contract.getDetails().then((res)=>{  
            // console.log(res);
            setStationData(res);
        })
    }

    const getChargersData=async(res)=>{
        const providerC = new ethers.providers.JsonRpcProvider({
            url: "https://goerli.ethereum.coinbasecloud.net",
            user: "SE5K55ZYPKAOXUWHB7HB",
            password: "KZS3DQQLOLPKILSYJTR3VENZQVNUYHJ73QIWILZF"
         });                             
        const contract =await new ethers.Contract(res, clientContract, providerC); 
        const data=await contract.getChargers().then((res)=>{  
            // console.log(res);
            setChargers(res);
            setIndexCount(res.length);   
            // console.log(res.length);         
            // console.log(ethers.BigNumber.from(res[0][3]).toNumber())
        })
    }

    const getLocation=(lat,long)=>{
        let url='https://apis.mapmyindia.com/advancedmaps/v1/c5251a63db5287924d354708595b947e/rev_geocode?lat='+lat+'&lng='+long
        axios.get(url, {})
          .then(function (response) {
            console.log(response);
            // console.log(response.data.results[0].street);
            // console.log(response.data.results[0].district);
            // console.log(response.data.results[0].state);
            // console.log(response.data.results[0].area);
            setPinAddress(response.data.results[0].street+","+response.data.results[0].city+','+response.data.results[0].state+','+response.data.results[0].area)
          })
          

    }

    const gridInit=async(event)=>{
        event.preventDefault();
        const concatContact= email+"&&"+address+"&&"+contact;        
        const provider =new ethers.providers.Web3Provider(window.ethereum);                                
        const signer =await provider.getSigner();                                
        const contract =await new ethers.Contract(masteraddress, masterABI, signer);
        const data=await contract.deployChargingStation(window.sessionStorage.getItem("userID"),name,concatContact).then((res)=>{
            // console.log(res[0])                                      
            setName("");
            setAddress("");
            setContact("");
            setEmail("");
            handleClose();                               
        })
    }

    const launchCharger=async(event)=>{
        event.preventDefault();
        const provider =new ethers.providers.Web3Provider(window.ethereum);                                
        const signer =await provider.getSigner();                                
        const contract =await new ethers.Contract(Stationaddress, clientContract, signer);
        const locationConcat=lat+"&&"+long+"&&"+pinAddress;
        const data=await contract.addChargers(cName,cName,locationConcat,chargerCount,chargerActive,chargePerUnit, parseInt(watt)).then((res)=>{
            const config  = {headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
            }}
            const json={
                contractAddress:Stationaddress,
                index:indexCount,
                location:pinAddress,
                city:pinAddress.split(',')[1],
                state:pinAddress.split(',')[2],
                status:true,
                lon:long,
                lat:lat
            }
            // console.log(json);
            axios.post('http://localhost:3001/setcharger', JSON.stringify(json),config).then(function (response) {              
                if(response.data.status==="success"){
                    console.log("ok");              
                }else{
                    console.log("not ok");
                }
                })
                .catch(function (error) {
                    alert("error ");
                });

            setCName("");
             setChargerCount("");
             setChargerActive("");
             setChargePerUnit("");                         
            
            setPage2(1);
            handleClose1();                               
        })
        
    }

    const updater=async(event)=>{
        event.preventDefault();
        const provider =new ethers.providers.Web3Provider(window.ethereum);                                
        const signer =await provider.getSigner();                                
        const contract =await new ethers.Contract(Stationaddress, clientContract, signer);
        let tx=await contract.update(prefillIndex,prefillTotalC,prefillCost,prefillActiveC).then((res)=>{                                   
            // const data=tx.wait();
            console.log(res);
            handleClose2();
            // setRefresh(!refresh);
       })
    //    const data=await tx.wait();  
    //    console.log(data);     
       
    }

    const statusUpdater=async(status)=>{
        // event.preventDefault();
        const provider =new ethers.providers.Web3Provider(window.ethereum);                                
        const signer =await provider.getSigner();                                
        const contract =await new ethers.Contract(Stationaddress, clientContract, signer);
        let tx=await contract.setWorkingStatus(prefillIndex,status).then((res)=>{                       
            //save the data to the database...      
            const config  = {headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
            }}
            const json={
                contractAddress:Stationaddress,
                index:prefillIndex,
                status :status
            }
            axios.post('http://localhost:3001/setcstatus', JSON.stringify(json),config).then(function (response) {              
                if(response.data.status==="success"){
                    console.log("ok");              
                }else{
                    console.log("not ok");
                }
                })
                .catch(function (error) {
                    alert("error");
                });
            

             console.log(res);
             handleClose2();
        })
    }
    
    return(
        <div className='p-4'>
            <h4 className='text-secondary pb-2'>My Charging Grid :</h4>
            <hr/>
            {page===1?
                <div className='text-center py-4'>
                    <h4 className='font-4 text-warning fw-bold mb-3'>Get your charging station on the grid with few easy steps.</h4>
                    <button 
                        className='btn btn-dark shadow fw-bold font-3 mb-5'
                        onClick={()=>{
                            handleShow()
                        }}
                        >Get started!</button>
                    <hr/>
                    <p className=' font-4 fw-bold text-dark'>Getting started is as <span className='text-primary'>EASY</span> as</p>
                    <p className=' font-3 fw-bold text-secondary'>1. Create an service provider contract with the system.</p>
                    <p className='font-3 fw-bold text-secondary '>2. Add your charging station to the GRID. </p>
                    <p className='font-3 fw-bold text-secondary '>Start earning with the GRID.</p>
                </div>
                
                :null
            }
            {page===2?
                <div>                    
                    <table className='font-4 mb-2'>
                        <tr>
                            <td className='text-muted'> Station Name </td>
                            <td>{stationData?": "+stationData[0]:null}</td>                                                                                  
                        </tr>
                        <tr>
                            <td className='text-muted'>Grid Contract Address </td>
                            <td>{stationData?": "+stationData[1]:null}</td>
                        </tr>                        
                        <tr>
                            <td className='text-muted'>Registered Address</td>
                            <td>{stationData?": "+ stationData[2].split('&&')[1]:null}</td>
                        </tr>
                        <tr>
                            <td className='text-muted'>Email </td>
                            <td>{stationData?": "+stationData[2].split('&&')[0]:null}</td>
                        </tr>
                        <tr>
                            <td className='text-muted'>Contact:</td>
                            <td>{stationData?": "+stationData[2].split('&&')[2]:null}</td>
                        </tr>
                    </table>
                    <button 
                        className='btn btn-sm btn-success p-0 px-2 shadow font-4 badge-pill mb-4'
                        onClick={()=>{
                            handleShow1();
                        }}
                    ><span className='fw-bold'>+</span>&nbsp; new charging station</button>
                    <h5 className='font-4 text-dark'>Charging stations on Grid</h5>
                    <div class="table-responsive-md">
                        <table className='table table-hover table-sm table-striped table-responsive-md'>
                            <thead className='font-3'> 
                                <tr>
                                    <th>Name</th>
                                    <th>Location</th>
                                    <th>Total chargers</th>
                                    <th>Active chargers</th>
                                    <th>₹/KWh</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody className='font-3'>
                                {
                                     chargers && chargers.map((entry,index)=>{
                                        return(
                                            <tr key={index}>
                                                <td>{entry[1]}</td>
                                                <td>{entry[2].split('&&')[2]}</td>
                                                <td>{ethers.BigNumber.from(entry[3]).toNumber()}</td>
                                                <td>{ethers.BigNumber.from(entry[4]).toNumber()}</td>
                                                <td>{ethers.BigNumber.from(entry[5]).toNumber()}</td>
                                                <td>{entry[7]===true?"Active":"Inactive"}</td>
                                                <td>
                                                    <button 
                                                        className='btn m-0 p-0'
                                                        onClick={()=>{
                                                            handleShow2();
                                                            setPrefillIndex(index);
                                                            setPrefillTotalC(ethers.BigNumber.from(entry[3]).toNumber());
                                                            setPrefillActiveC(ethers.BigNumber.from(entry[4]).toNumber());
                                                            setPrefillCost(ethers.BigNumber.from(entry[5]).toNumber());
                                                            setPrefillStatus(entry[7]);
                                                        }}
                                                        ><img src="https://img.icons8.com/fluency/30/null/window-other.png"/>
                                                    </button>
                                                </td>
                                            </tr>
                                        )
                                     })
                                }
                                
                                
                                
                            </tbody>
                        </table>
                    </div>
                </div>
            :null}  


            {/* popup */}
            <Modal
                size="lg"
                show={show}
                onHide={handleClose}
                backdrop="static"
                keyboard={false}
                centered
                >
                <Modal.Header>
                <Modal.Title><span className='text-primary font-1 display-4'>Easy Charge</span></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="py-2" onSubmit={gridInit}>                      
                        <div>                 
                        <div className="form-group">                                        
                            <label htmlFor="n1" className='text-dark font-4 fw-normal mb-2'>Name of your charging network on the GRID :</label>
                            <input 
                                type="text"
                                name="n1" 
                                required 
                                autoFocus
                                className="form-control text-dark fw-bold" 
                                placeholder="Network Name"
                                value={name}
                                onChange={(e)=>{setName(e.target.value)}}
                                />
                                <small className='font-4 text-secondary'>This name will be shown as the service provider name to the users. </small>
                        </div>
                        <div className="form-group my-3">                                        
                            <label htmlFor="n2" className='text-dark font-4 fw-normal mb-2'>Address :</label>
                            <input 
                                type="text"
                                name="n2" 
                                required 
                                className="form-control text-dark fw-bold" 
                                placeholder=""
                                value={address}
                                onChange={(e)=>{setAddress(e.target.value)}}
                                />
                                <small className='font-4 text-secondary'>Your Personal / official address. </small>
                        </div>
                       
                        <div className='row'>
                            <div className='col-6'>
                                <div className="form-group my-3">                                        
                                    <label htmlFor="n3" className='text-dark font-4 fw-normal mb-2'>Email Address :</label>
                                    <input 
                                        type="email"
                                        name="n3" 
                                        required 
                                        className="form-control text-dark fw-bold" 
                                        placeholder=""
                                        value={email}
                                        onChange={(e)=>{setEmail(e.target.value)}}
                                        />
                                        {/* <small className='font-4 text-secondary'>Your Personal / official address. (* this wont be shown to clients) </small> */}
                                </div>
                            </div>  
                            <div className='col-6'>
                                <div className="form-group my-3">                                        
                                    <label htmlFor="n4" className='text-dark font-4 fw-normal mb-2'>Contact number :</label>
                                    <input 
                                        type="number"
                                        name="n4" 
                                        required 
                                        className="form-control text-dark fw-bold" 
                                        placeholder="   "
                                        value={contact}
                                        onChange={(e)=>{setContact(e.target.value)}}
                                        />
                                        <small className='font-4 text-secondary'>Your Business Number.  </small>
                                </div>
                            </div>                                                       
                        </div>
                        
                            <div className='row mt-3'>
                                <div className='col-6'>
                                    <button type="button" className='btn btn-outline-danger wid-100 fw-bold' onClick={()=>{handleClose()}}>Close</button>
                                </div>
                                <div className='col-6'>
                                    <button type="submit" className='btn btn-primary wid-100  shadow fw-bold'>PROCESS</button>
                                </div>                            
                            </div> 
                        </div>                 
                    </form>                                
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>    

            {/* popup - for the deploy chargerging stations */}
            <Modal
                show={show1}
                onHide={handleClose1}
                backdrop="dynamic"
                keyboard={false}
                centered
                >
                <Modal.Header>
                <Modal.Title><span className='text-primary font-1 display-4'>Easy Charge</span></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="py-2 " onSubmit={launchCharger}>
                        {page2===1?
                        <div>
                        <div className="form-group">                                        
                            <label htmlFor="n1" className='text-secondary font-4 fw-normal mb-2'>Charging Station name :</label>
                            <input 
                                type="text"
                                name="n1" 
                                required 
                                autoFocus
                                className="form-control text-dark fw-bold"                              
                                value={cName}
                                onChange={(e)=>{setCName(e.target.value)}}
                                />
                        </div>
                        <div className="form-group my-2">                                        
                            <label htmlFor="n3" className='text-secondary font-4 fw-normal mb-2'>Total No of Chargers Available :</label>
                            <input 
                                type="number"
                                name="n2" 
                                required 
                                className="form-control text-dark fw-bold"                                 
                                value={chargerCount}
                                onChange={(e)=>{setChargerCount(e.target.value)}}
                                />
                        </div>
                        <div className="form-group">                                        
                            <label htmlFor="n3" className='text-secondary font-4 fw-normal mb-2'>No of chargers Active :</label>
                            <input 
                                type="number"
                                name="n2" 
                                required 
                                className="form-control text-dark fw-bold"  
                                value={chargerActive}
                                onChange={(e)=>{setChargerActive(e.target.value)}}
                                />
                        </div>
                        <div className="form-group">                                        
                            <label className='text-secondary font-4 fw-normal mb-2'>No of chargers Active :</label>
                            <select 
                                        className="form-select font-3 text-dark"
                                        onChange={(e)=>{
                                            setWatt(e.target.value);
                                        }}
                                        value={watt}
                                        >
                                        <option selected className='text-center' value="0">- - Select - -</option>
                                        <option value="15">15 KwH</option>
                                        <option value="30">30 KwH</option>
                                        <option value="4">4 KwH</option>
                                    </select> 
                        </div>
                       
                        <div className="form-group my-2">                                        
                            <label htmlFor="n4" className='text-secondary font-4 fw-normal mb-2'>Charge / Kwh (*in Rupee) :</label>
                            <input 
                                type="number"
                                name="n4"
                                required 
                                className="form-control text-dark fw-bold"  
                                value={chargePerUnit}
                                onChange={(e)=>{setChargePerUnit(e.target.value)}}
                                />
                        </div>
                        <div className='row mt-3'>
                            <div className='col-6'>
                                <button type="button" className='btn btn-outline-danger wid-100 fw-bold' onClick={()=>{handleClose1()}}>Close</button>
                            </div>
                            <div className='col-6'>
                                <button type="button" className='btn btn-primary wid-100  shadow fw-bold' onClick={()=>{setPage2(2)}}>NEXT</button>
                            </div>                            
                        </div> 
                        </div>
                        :null}
                        {page2===2 && lat?
                            <div className=''>                                                                
                                {mapFixer? 
                                <Map
                                    search={true}
                                    // location={true}
                                    zoomControl={true}
                                    center={[11.228694749852345,76.95922885090114]}
                                    zoom={8}
                                    onClick={(e)=>{
                                        // console.log(e)
                                        // console.log(e.latlng);
                                        // setLat(e.latlng.lat);   
                                        // setLong(e.latlng.lng);                                        
                                    }}
                                    
                                    markers={ [
                                        {
                                            position: [lat,long],
                                            draggable: true,
                                            title: "selected location",
                                            onClick: e => {
                                                // console.log(e.latlng.lat);
                                                // console.log(e.latlng.lng);
                                                // getLocation(e.latlng.lat,e.latlng.lng);
                                            },
                                            onDragend: e => {                                        
                                                console.log(e.target._latlng);
                                                setLat(e.target._latlng.lat)
                                                setLong(e.target._latlng.lng)
                                            
                                            }
                                        }
                                    ]}
                                />:null}
                                <p className="font-4 mb-0">Selected Location :</p>
                                <table className='ms-2'>
                                    <tbody>
                                        <tr>
                                            <td>lattitude</td>
                                            <td>: {lat ?lat:null}</td>
                                        </tr>
                                        <tr>
                                            <td>longitude</td>
                                            <td>: {long?long:null}</td>
                                        </tr>
                                        <tr>
                                            <td>Address</td>
                                            <td>: {pinAddress?pinAddress:null}</td>
                                        </tr>
                                    </tbody>
                                </table>

                                <div className='row mt-3'>
                            <div className='col-6'>
                                <button type="button" className='btn btn-outline-danger wid-100 fw-bold' onClick={()=>{handleClose1()}}>Close</button>
                            </div>
                            <div className='col-6'>
                                <button type="submit" className='btn btn-primary wid-100  shadow fw-bold'>PROCESS</button>
                            </div>                            
                        </div>
                            </div>
                        :null
                        }
                    </form>                                
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>  

            {/* popup -3*/}
            <Modal
                size="lg"
                show={show2}
                onHide={handleClose2}
                backdrop="dynamic"
                keyboard={false}
                centered
                >
                <Modal.Header>
                <Modal.Title><span className='text-primary font-1 display-4'>Easy Charge</span></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="py-2" onSubmit={updater}>                       
                        <div className='row'>
                            <div className='col-6'>
                                <div className="form-group my-3">                                        
                                    <label htmlFor="n3" className='text-dark font-4 fw-normal mb-2'>Total No of chargers :</label>
                                    <input 
                                        type="number"
                                        name="n3" 
                                        required 
                                        className="form-control text-dark fw-bold" 
                                        placeholder=""
                                        value={prefillTotalC}
                                        onChange={(e)=>{setPrefillTotalC(e.target.value)}}
                                        />                                        
                                </div>
                            </div>  
                            <div className='col-6'>
                                <div className="form-group my-3">                                        
                                    <label htmlFor="n4" className='text-dark font-4 fw-normal mb-2'>Active number of Chargers :</label>
                                    <input 
                                        type="number"
                                        name="n4" 
                                        required 
                                        className="form-control text-dark fw-bold" 
                                        placeholder="   "
                                        value={prefillActiveC}
                                        onChange={(e)=>{setPrefillActiveC(e.target.value)}}
                                        />                                        
                                </div>
                            </div> 
                            <div className='col-6'>
                                <div className="form-group my-3">                                        
                                    <label htmlFor="n4" className='text-dark font-4 fw-normal mb-2'>Charge / Kwh (*in Rupee) :</label>
                                    <input 
                                        type="number"
                                        name="n4" 
                                        required 
                                        className="form-control text-dark fw-bold" 
                                        placeholder="   "
                                        value={prefillCost}
                                        onChange={(e)=>{setPrefillCost(e.target.value)}}
                                        />                                        
                                </div>
                            </div>                                                      
                        </div>
                        <hr/>
                        <div>
                            <p clasName="font-4">Maintanance Mode :</p>
                            {prefillStatus===true?
                                <button 
                                    type="button" 
                                    className="btn btn-warning shadow font-3 fw-bold mb-3"
                                    onClick={()=>{
                                        statusUpdater(false);
                                    }}
                                    >Activate Maintanance Mode</button>
                                :
                                <button 
                                    type="button" 
                                    className="btn btn-dark shadow font-3 fw-bold  mb-3"
                                    onClick={()=>{
                                        statusUpdater(true);
                                    }}
                                    >Deactivate Maintanance Mode</button>
                            }
                        </div>
                        
                            <div className='row mt-3'>
                                <div className='col-6'>
                                    <button type="button" className='btn btn-outline-danger wid-100 fw-bold' onClick={()=>{handleClose2()}}>Close</button>
                                </div>
                                <div className='col-6'>
                                    <button type="submit" className='btn btn-primary wid-100  shadow fw-bold'>PROCESS</button>
                                </div>                            
                            </div> 
                                         
                    </form>                                
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>

        </div>
    )
}
export default React.memo(Grid);





 