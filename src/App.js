import { useEffect, useState } from "react";
import "./App.css"
import { initializeApp } from "firebase/app";
import { getDatabase, onValue, ref, set } from "firebase/database";
// import { CronJob } from "cron";

function App() {

  const [jasmine, setJasmine] = useState(0);
  const [jasmineNumBus, setJasmineNumBus] = useState(0);
  const [james, setJames] = useState(0);
  const [jamesNumBus, setJamesNumBus] = useState(0);

  // const job = new CronJob(
  //   '0 0 * * *', () => {
  //     set(ref(realtime_db, 'score/jasmine/numBus'), 0);
  //     set(ref(realtime_db, 'score/james/numBus'), 0);
  //   },
  //   null,
  //   true,
  //   'America/New_York'
  // );

  const firebaseConfig = {
    apiKey: process.env.REACT_APP_FB_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
    databaseURL: process.env.REACT_APP_REALTIME_DB_URL
  };


  const app = initializeApp(firebaseConfig);
  const realtime_db = getDatabase(app);


  const handleUpClick = (name) => {
    if(name === "jas") {

      set(ref(realtime_db, 'score/jasmine/score'), jasmine + 1);
      setJasmine(jasmine + 1);
    }
    if(name === "jam") {
      set(ref(realtime_db, 'score/james/score'), james + 1);
      setJames(james + 1);
    }
  }

  const handleDownClick = (name) => {

    if(name === "jas") {
      set(ref(realtime_db, 'score/jasmine/score'), jasmine - 1);
      setJasmine(jasmine - 1);
    }
    if(name === "jam") {
      set(ref(realtime_db, 'score/james/score'), james - 1);
      setJames(james - 1);
    }
  }

  const handleUpClickBus = (name) => {
    if(name === "jas" && jasmineNumBus < 3) {
      set(ref(realtime_db, 'score/jasmine/score'), jasmine + 1);
      set(ref(realtime_db, 'score/jasmine/numBus'), jasmineNumBus + 1);
      setJasmine(jasmine + 1);
      setJasmineNumBus(jasmineNumBus + 1);
    }

    if(name === "jam" && jamesNumBus < 3) {
      set(ref(realtime_db, 'score/james/score'), james + 1);
      set(ref(realtime_db, 'score/james/numBus'), jamesNumBus + 1);
      setJames(james + 1);
      setJamesNumBus(jamesNumBus + 1);
    }
  }

  const handleDownClickBus = (name) => {
    if(name === "jas" && jasmineNumBus > 0) {
      set(ref(realtime_db, 'score/jasmine/score'), jasmine - 1);
      set(ref(realtime_db, 'score/jasmine/numBus'), jasmineNumBus - 1);
      setJasmine(jasmine - 1);
      setJasmineNumBus(jasmineNumBus - 1);
    }

    if(name === "jam" && jamesNumBus > 0) {
      set(ref(realtime_db, 'score/james/score'), james - 1);
      set(ref(realtime_db, 'score/james/numBus'), jamesNumBus - 1);
      setJames(james - 1);
      setJamesNumBus(jamesNumBus - 1);
    }
  }


  useEffect(() => {
    const retrieveCounts = () => {
      const jasmineRef = ref(realtime_db, 'score/jasmine/score');
      const jamesRef = ref(realtime_db, 'score/james/score');
      const jasmineNumBusRef = ref(realtime_db, 'score/jasmine/numBus');
      const jamesNumBusRef = ref(realtime_db, 'score/james/numBus');

      onValue(jasmineRef, (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
          setJasmine(data);
        }
      });

      onValue(jamesRef, (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
          setJames(data);
        }
      });

      onValue(jasmineNumBusRef, (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
          setJasmineNumBus(data);
        }
      });
      onValue(jamesNumBusRef, (snapshot) => {
        const data = snapshot.val();
        if (data !== null) {
          setJamesNumBus(data);
        }
      });


    }

    retrieveCounts();
  });

  const resetBusCounts = () => {
    set(ref(realtime_db, 'score/jasmine/numBus'), 0);
    set(ref(realtime_db, 'score/james/numBus'), 0);
    setJasmineNumBus(0);
    setJamesNumBus(0);
  }

  return (
    <div className="global">
      <div className="test">
        <div className="jas">
          <button onClick={() => handleUpClick("jas")}>
            <p>Jasmine Up (Car)</p>
          </button>
          <button onClick={() => handleUpClickBus("jas")}>
            <p>Jasmine Up (Bus)</p>
          </button>
          <button onClick={() => handleDownClick("jas")}>
            <p>Jasmine Down (Car)</p>
          </button>
          <button onClick={() => handleDownClickBus("jas")}>
            <p>Jasmine Down (Bus)</p>
          </button>
          <p>Jasmine Score: {jasmine} ({jasmineNumBus} busses)</p>

        </div>
        <div className="jas">
          <button onClick={() => handleUpClick("jam")}>
            <p>James Up (Car)</p>
          </button>
          <button onClick={() => handleUpClickBus("jam")}>
            <p>James Up (Bus)</p>
          </button>
          <button onClick={() => handleDownClick("jam")}>
            <p>James Down (Car)</p>
          </button>
          <button onClick={() => handleDownClickBus("jam")}>
            <p>James Down (Bus)</p>
          </button>
          <p>James Score: {james} ({jamesNumBus} busses)</p>

        </div>
      
      </div>
      <div className="score">
        <button onClick={resetBusCounts}>
          <p>Reset Bus Counts</p>
        </button>
      </div>
    </div>
  );
}

export default App;
