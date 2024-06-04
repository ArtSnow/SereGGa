import './App.css';
import React, {useEffect, useState, useRef} from 'react'
import * as qrc from './qrcode'
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import { loadSlim } from "@tsparticles/slim";
import { useCallback } from "react";
import beerImage from './beer.png'
import beerHatImage from './beerHat.png'
import fac0 from './fac0.png'
import fac1 from './fac1.png'
import fac2 from './fac2.png'
import fac3 from './fac3.png'


function App() {
  const ref = useRef();
  const [data, setData] = useState()
  const [facData, setFacData] = useState([0, 0, 0, 0])
  const [profileData, setProfileData] = useState(['',''])
  const urlParams = new URLSearchParams(window.location.search);
  let pass = urlParams.get('pass')
  const facPhotos = [fac0, fac1, fac2, fac3]
  const [ init, setInit ] = useState(false);
  
  const uploadFacData = (index, count) => {
    fetch("http://127.0.0.1:5000/api/setFacData", 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({"pass": pass, index, count})
      }).then(res => res.json()).then(data => {
        setFacData(data.facs)})
  }

  useEffect(() => {
    initParticlesEngine(async (engine) => {
        await loadSlim(engine);
    }).then(() => {
        setInit(true);
    });
}, []);
  const particlesLoaded = (container) => {
  };
  

  useEffect(() => {
    
    if(!pass) {
      pass = localStorage.getItem('pass')
    } else {
      localStorage.setItem('pass', pass)
    }

    if (urlParams.get('gen')) {
      fetch("http://127.0.0.1:5000/api/getqr", 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify({"pass": pass})
      }).then(res => res.json()).then(data => {
        setData(data.url)})
        return
    }
    fetch("http://127.0.0.1:5000/api/getProfile", 
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({"pass": pass})
    }).then(res => res.json()).then(data => {
      setProfileData([data.fac, data.name])
    })
    fetch("http://127.0.0.1:5000/api/getFacData").then(res => res.json()).then(data => {setFacData(data.facs)})
    
  }, [])

  useEffect(() => {
    if (!data) return
    var qrcode = new qrc.QRCode(ref.current, {
      text: data,
      width: 256,
      height: 256,
      colorDark : "#000000",
      colorLight : "#ffffff"
  });
  }, [data])
  
  if (urlParams.get('gen')) {
    return (<div className="App">
    <div className="App-header">
      <div className="Arb">
        <img src={beerHatImage}></img>
        <div ref={ref}></div>
        <p>Добро пожаловать на сходку!</p>
        <p>Пивная шляпа выберет тебе факультет!</p>
      </div>
    </div>
    <Particles
        id="tsparticles"
        init={init}
        loaded={particlesLoaded}
        options={{
          //  background: {
          //      color: {
          //          value: "#0d47a1",
          //      },
          //  },
          fpsLimit: 120, //FPS limit must be low to save resources
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              }, // click - it will push more emojis
              onHover: {
                enable: true,
                mode: "repulse",
              }, // it will repulse the emojis
              resize: true, // enable resizing the emojis
            },
            modes: {
              push: {
                quantity: 4, //push 4 emojis on each click
              },
              repulse: {
                //repulse properties
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            links: { //link properties
              color: "#ffffff",
              distance: 100,
              enable: true,
              opacity: 0.5,
              width: 2,
            },
            collisions: {
              enable: true,
            },
            move: {
              directions: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              speed: 6,
            },
            number: {
              value: 10, // total emojis initially
            },
            opacity: {
              value: 1,
            },
            shape: {
              type: "image",
              options: {
                image: {
                  "src": beerImage,
                  "width": 100,
                  "height": 100,
                  "replaceColor" : true
                }
              }
              
            },
            size: {
              value: { min: 15, max: 55 },
            },
          },
        }}
      />
  </div>)
  } else if ((urlParams.get('admin'))) {
    return (
      <div className="App">
        <div className="App-header">
          <div className="Arb">
            <div className='facs'>
              <div>
                <div>
                  <div className='buttonsHolder'>
                    <div>
                      <button onClick={() => uploadFacData(0, -10)}>-10</button>
                      <button onClick={() => uploadFacData(0, -26)}>-25</button>
                      <button onClick={() => uploadFacData(0, -100)}>-100</button>
                    </div>
                    <div>
                    <img src={facPhotos[0]} width={102*1.5} height={126*1.5}></img>
                    <p>{facData[0]}</p>
                    </div>
                    <div>
                      <button onClick={() => uploadFacData(0, +10)}>+10</button>
                      <button onClick={() => uploadFacData(0, +25)}>+25</button>
                      <button onClick={() => uploadFacData(0, +100)}>+100</button>
                    </div>
                  </div>
                </div>
                <div>
                  <div className='buttonsHolder'>
                    <div>
                      <button onClick={() => uploadFacData(1, -10)}>-10</button>
                      <button onClick={() => uploadFacData(1, -25)}>-25</button>
                      <button onClick={() => uploadFacData(1, -100)}>-100</button>
                    </div>
                    <div>
                    <img src={facPhotos[1]} width={102*1.5} height={126*1.5}></img>
                    <p>{facData[1]}</p>
                    </div>
                    <div>
                      <button onClick={() => uploadFacData(1, +10)}>+10</button>
                      <button onClick={() => uploadFacData(1, +25)}>+25</button>
                      <button onClick={() => uploadFacData(1, +100)}>+100</button>
                    </div>
                  </div>
                </div>
                <div>
                <div className='buttonsHolder'>
                    <div>
                      <button onClick={() => uploadFacData(2, -10)}>-10</button>
                      <button onClick={() => uploadFacData(2, -25)}>-25</button>
                      <button onClick={() => uploadFacData(2, -100)}>-100</button>
                    </div>
                    <div>
                    <img src={facPhotos[2]} width={102*1.5} height={126*1.5}></img>
                    <p>{facData[2]}</p>
                    </div>
                    <div>
                      <button onClick={() => uploadFacData(2, +10)}>+10</button>
                      <button onClick={() => uploadFacData(2, +25)}>+25</button>
                      <button onClick={() => uploadFacData(2, +100)}>+100</button>
                    </div>
                  </div>
                </div>
                <div>
                <div className='buttonsHolder'>
                    <div>
                      <button onClick={() => uploadFacData(3, -10)}>-10</button>
                      <button onClick={() => uploadFacData(3, -25)}>-25</button>
                      <button onClick={() => uploadFacData(3, -100)}>-100</button>
                    </div>
                    <div>
                    <img src={facPhotos[3]} width={102*1.5} height={126*1.5}></img>
                    <p>{facData[3]}</p>
                    </div>
                    <div>
                      <button onClick={() => uploadFacData(3, +10)}>+10</button>
                      <button onClick={() => uploadFacData(3, +25)}>+25</button>
                      <button onClick={() => uploadFacData(3, +100)}>+100</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
    
  }
  else {
    return (<div className="App">
    <div className="App-header">
      <div className="Arb">
        <p>{profileData[1]}</p>
        <div className='facs'>
          <div>
            <img src={facPhotos[(parseInt(profileData[0]) + 1) % 4]} width={102*1.25} height={126*1.25}></img>
            <p>{facData[(parseInt(profileData[0]) + 1) % 4]}</p>
          </div>
          <div>
            <img src={facPhotos[(parseInt(profileData[0]) + 2) % 4]} width={102*1.25} height={126*1.25}></img>
            <p>{facData[(parseInt(profileData[0]) + 2) % 4]}</p>
          </div>
          <div>
            <img src={facPhotos[(parseInt(profileData[0]) + 3) % 4]} width={102*1.25} height={126*1.25}></img>
            <p>{facData[(parseInt(profileData[0]) + 3) % 4]}</p>
          </div>
        </div>
        <div>
          <img src={facPhotos[parseInt(profileData[0])]} width={102*3} height={126*3}></img>
          <p>{facData[parseInt(profileData[0])]}</p>
        </div>
        
      </div>
    </div>
    <Particles
        id="tsparticles"
        init={init}
        loaded={particlesLoaded}
        options={{
          //  background: {
          //      color: {
          //          value: "#0d47a1",
          //      },
          //  },
          fpsLimit: 120, //FPS limit must be low to save resources
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              }, // click - it will push more emojis
              onHover: {
                enable: true,
                mode: "repulse",
              }, // it will repulse the emojis
              resize: true, // enable resizing the emojis
            },
            modes: {
              push: {
                quantity: 4, //push 4 emojis on each click
              },
              repulse: {
                //repulse properties
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            links: { //link properties
              color: "#ffffff",
              distance: 100,
              enable: true,
              opacity: 0.5,
              width: 2,
            },
            collisions: {
              enable: true,
            },
            move: {
              directions: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              speed: 6,
            },
            number: {
              value: 10, // total emojis initially
            },
            opacity: {
              value: 1,
            },
            shape: {
              type: "image",
              options: {
                image: {
                  "src": beerImage,
                  "width": 100,
                  "height": 100,
                  "replaceColor" : true
                }
              }
              
            },
            size: {
              value: { min: 15, max: 55 },
            },
          },
        }}
      />
  </div>
    
)
  }
}

export default App;
