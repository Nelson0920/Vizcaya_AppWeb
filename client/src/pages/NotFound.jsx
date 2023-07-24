import React from 'react'
import "@styles/NotFound.scss"
//import "./404.js"

const NotFound = () => {
    const visual = document.getElementById("visual")
    const events = ['resize', 'load']

    events.forEach(function (e) {
        window.addEventListener(e, function () {
            const width = window.innerWidth
            const height = window.innerHeight
            const ratio = 45 / (width / height)
            visual.style.transform = "translate(-50%, -50%) rotate(-" + ratio + "deg)"
        });
    });

    return (
        <div className='body404'>
            <a href="/home" className='exit404'>
                <svg height="0.8em" width="0.8em" viewBox="0 0 2 1" preserveAspectRatio="none">
                    <polyline
                        fill="none"
                        stroke="#777777"
                        stroke-width="0.1"
                        points="0.9,0.1 0.1,0.5 0.9,0.9"
                    />
                </svg> Inicio
            </a>
            <div className="background-wrapper">
                <h1 id="visual" className='title404'>Err:404</h1>
            </div>
            <p className='text404'>Pagina o ruta no encontrada</p>
        </div>
    )
}
export default NotFound