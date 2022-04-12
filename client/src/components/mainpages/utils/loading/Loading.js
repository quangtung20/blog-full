import React from 'react'
import './loading.css'

function Loading() {
    return (
        // <div className="load-page">
        //     <div className="loader">
        //         <div>
        //             <div>
        //                 <div>
        //                     <div>
        //                         <div>
        //                             <div>
        //                                 <div>
        //                                     <div></div>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <div className="position-fixed w-200 h-200 text-center loading"
    style={{background: '#0007', color: "white", top: 0, left: 0, zIndex: 99}}>
      <svg width="205" height="250" viewBox="0 0 40 50">
        <polygon stroke="#fff" strokeWidth="1" fill="none"
        points="20,1 40,40 1,40" />
        <text fill="#fff" x="5" y="47">Loading</text>
      </svg>
    </div>
    )
}

export default Loading
