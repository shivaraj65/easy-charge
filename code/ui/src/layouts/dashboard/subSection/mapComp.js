import React,{useState,useEffect} from 'react';
import Map from "mapmyindia-react";

const MapComp=(data)=>{

    // const [data,setData]=useState(null);

    const [markers,setMarkers] = useState([]);
    const [displayMap,setDisplayMap] = useState(false);

    useEffect(() => {  
        // setDisplayMap(true);
        // if(data && data.data){            
            // console.log(data);      
            // let res =[];
            // try{
                // for(var i=0;i<data.data.length;i++){
                //     console.log(data.data[i].loc.lon);
                //     console.log(data.data[i].loc.lat);
                //     res.push({position:[data.data[i].loc.lat,data.data[i].loc.lon],title: "marker"  })
                // }  
            // }catch{
            //     console.log("some error");
            // }           
            // console.log(res);
            // setMarkers(res);
           
            
        // }     
        console.log(data);
        setTimeout(()=>{
            setDisplayMap(true);
        },400);

     }, [])

    return(
        <div>
           
             <Map
             search={false}
             location={true}
             zoomControl={true}
            //  center={[11.228694749852345,76.95922885090114]}
             zoom={7}     
             markers={[
                {
                    position: [18.5314, 73.845],                    
                    title: "Marker 1"
                },
                {
                    position: [11.228694749852345, 76.95922885090114],                    
                    title: "Marker 2"
                }
              ]}         
         />
        </div>
    )
}
export default React.memo(MapComp);


 {/* {displayMap===true? */}
            //      <Map
            //      search={false}
            //      location={true}
            //      zoomControl={true}
            //      center={[11.228694749852345,76.95922885090114]}
            //      zoom={8}
            //      markers={data}
            //  />
            // :
             
             {/* }  */}