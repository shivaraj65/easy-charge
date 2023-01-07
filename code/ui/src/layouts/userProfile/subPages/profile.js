import React from 'react';

const ProfileS =({data})=>{
    return(
        <div className='p-4 mb-5'>  
            <h4 className='text-secondary pb-2'>User Profile :</h4>
            <hr/>       
            <table className='table font-3'>
                <tbody>
                    <tr>
                        <td className="pe-3">User ID  </td>
                        <td className='text-primary'>{data.userID}</td>
                    </tr>
                    <tr>
                        <td className="pe-3">Name  </td>
                        <td className='text-primary'>{data.name}</td>
                    </tr>
                    <tr>
                        <td>Email  </td>
                        <td className='text-primary'>{data._id}</td>
                    </tr>
                    <tr>
                        <td>Verification Status  </td>
                        <td>{data.verified?<img src="https://img.icons8.com/color/24/null/verified-badge.png"/>:<img src="https://img.icons8.com/fluency/24/null/nothing-found.png"/>}</td>
                    </tr>
                </tbody>
            </table>            
        </div>
    )
}
export default React.memo(ProfileS);