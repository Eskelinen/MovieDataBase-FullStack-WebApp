import React, { useState, useRef } from "react";
import './App.css';

function App() {
//Muuttujien alustusta
  const titleRef = useRef();
  const yearRef = useRef();

  const [query, setQuery] = useState();
  const [results, setResults] = useState([]);
  const [year, setYear] = useState();
  const [title, setTitle] = useState();

  //Funktio yhden elokuvan hakemista varten
  const HaeYksiLeffa = (event) => {
    event.preventDefault();
    console.log("Haetaan elokuva " + query);
    //Tyhjennetään edelliset tulokset, jotta uudet mahtuvat tilalle.
    setResults(['']);
    //Lähetetään GET-mallinen pyyntö.
    fetch("https://fullstack-project2.onrender.com/api/hae/"+query)
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log(data);
      //Saatu data siirtyy YksiLeffa-nimiseen funktioon.
      YksiLeffa(data);
    }) //Virheen nappaus ja logitus.
    .catch((error) => {
      console.log(error);
    });
  };

  //Funktio kaikkien leffojen hakemista varten. API rajoittaa haun kymmeneen olioon.
  const HaeLeffaData = () => {
    //Yhden elokuvan haun mahdollisesti näkyvissä olevat elementit piilotetaan.
    document.getElementById("yksiPoster").style.visibility="hidden";
    document.getElementById("yksi").style.visibility="hidden";
    console.log("Haetaan elokuvia...");
    //GET pyyntö
    fetch("https://fullstack-project2.onrender.com/api/leffat")
      .then((results) => {
        return results.json();
      })
      .then((data) => {
        console.log(data);
        setResults(data)
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const LeffaArray = (data) => {
    //Tietokannan leffaolioista otetaan otsikko ja nimi käyttöön. Mukana virheellisen kuvan korjaus.
    if(data.poster === undefined || data.poster === null) {
      <>
      {/* eslint-disable-next-line*/}
      <img id="juliste" src={"https://thumbs.dreamstime.com/b/movie-film-roll-12772692.jpg"}/>
      <p id="nimi">{data.title}</p>
      <hr/>
      </>
    } else {
     return (
      <>
        {/* eslint-disable-next-line*/}
        <img id="juliste" src={data.poster} onError={(e) => { e.target.onerror = null; e.target.src = "https://thumbs.dreamstime.com/b/movie-film-roll-12772692.jpg";}}/>
        <p id="nimi">{data.title}</p>
        <hr/>
      </>
     )
    }
  }
  //Funktio yhden elokuvan haun datan käsittelyä varten.
  const YksiLeffa = (data) => {
    //Kaivetaan datasta elokuvan nimi ja juliste.
    const nimi = data.title;
    const juliste = data.poster;
    document.getElementById("yksi").innerHTML=nimi;
    //Virheentarkistus julisteen varalle.
    if (juliste === null || juliste === undefined) {
    document.getElementById("yksiPoster").src="https://thumbs.dreamstime.com/b/movie-film-roll-12772692.jpg";
    } else {
    document.getElementById("yksiPoster").src=juliste;
    }
    //Yhden elokuvan hakua varten olevat elementit ovat piilossa ennen kuin haku tehdään.
    document.getElementById("yksiPoster").style.visibility="visible";
    document.getElementById("yksi").style.visibility="visible";
  }

  //Funktio elokuvan lisäämistä varten.
  const ElokuvanLisaaja = (event) => {
    event.preventDefault();
    //Otetaan käyttäjän antamat arvot käyttöön.
    const formData = new URLSearchParams();
    formData.append('title', title);
    formData.append('year', year);
    //Lähetetään POST-mallinen pyyntö.
    fetch("https://fullstack-project2.onrender.com/api/lisaa", {
      method: 'POST',
      headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    //Käyttäjän antamat arvot kulkeutuvat pyynnön bodyssa.
    body: formData.toString()
  })
     .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
   })
   .catch((error) => {
    console.log(error);
  })
    console.log("Lisätään elokuva: " + title + " vuodelta " + year);

  }

  //Funktio elokuvan muokkaamista varten.
  const ElokuvanMuokkaaja = (event) => {
    event.preventDefault();
    const formData = new URLSearchParams();
    formData.append('title', title);
    formData.append('year', year);
    //Lähetetään PUT-mallinen pyyntö.
    fetch("https://fullstack-project2.onrender.com/api/muokkaa/" + query, {
      method: 'PUT',
      headers: {
      'Content-type': 'application/x-www-form-urlencoded'
    },
    body: formData.toString()
  })
     .then((response) => {
      return response.json();
    })
    .then((data) => {
      console.log(data);
   })
   .catch((error) => {
    console.log(error);
  })
    console.log("Muokataan elokuvaa " + query + ": Uudet arvot ovat " + title + " ja " + year);

  }

  //Funktio elokuvan poistoa varten.
  const ElokuvanPoistaja = (event) => {
    event.preventDefault();
    console.log("Poistetaan elokuva " + query);
    //Lähetetään DELETE-mallinen pyyntö.
    fetch("https://fullstack-project2.onrender.com/api/poista/"+query, {
      method: "DELETE"
    })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log(data);
      YksiLeffa(data);
    })
    .catch((error) => {
      console.log(error);
    });
  };
//Käyttäjän antamat tiedot otetaan lomakkeista. Funktiot laukeavat nappeja painamalla.
  return (
    <div>
      <div className="container">
      <div className="row align-items-start">
      <div className="col">
      <h1>Leffa sovellus</h1>
      <button type="button" className="btn btn-primary" onClick={HaeLeffaData}>
        Hae kaikki leffat
      </button>
      <br/><br/>
      <form onSubmit={HaeYksiLeffa}>
        <label>Hae elokuva id:llä</label>
        <input value={query} type="text" onChange={(event) => setQuery(event.target.value)}/>
        <br/>
        <button type="submit" className="btn btn-secondary">
          Hae yksi leffa
        </button>
      </form>
      <br/>
      <form onSubmit={ElokuvanLisaaja}>
        <label>Anna vuosi</label>
        <input ref={yearRef} onChange={(event) => setYear(event.target.value)} type="text"/>
        <label>Anna nimi</label>
        <input ref={titleRef} onChange={(event) => setTitle(event.target.value)} type="text"/>
        <br/>
        <button type="submit" className="btn btn-success">
          Luo uusi leffa
        </button>
      </form>
      <br/>
      <form onSubmit={ElokuvanMuokkaaja}>
      <label>Hae elokuva id:llä</label>
        <input value={query} type="text" onChange={(event) => setQuery(event.target.value)}/>
        <br/>
        <label>Anna vuosi</label>
        <input ref={yearRef} onChange={(event) => setYear(event.target.value)} type="text"/>
        <label>Anna nimi</label>
        <input ref={titleRef} onChange={(event) => setTitle(event.target.value)} type="text"/>
        <br/>
        <button type="submit" className="btn btn-warning">
          Muokkaa leffaa
        </button>
      </form>
      <br/>
      <form onSubmit={ElokuvanPoistaja}>
        <label>Hae elokuva id:llä</label>
        <input value={query} type="text" onChange={(event) => setQuery(event.target.value)}/>
        <br/>
        <button type="submit" className="btn btn-danger">
          Poista leffa
        </button>
      </form>
      </div>
      <div className="col">
      {results.map((data, index) => <LeffaArray title={data.title} poster={data.poster} />)}

        {/* eslint-disable-next-line*/}
        <img id="yksiPoster" src="" style={{visibility: "hidden"}} />
        <div id="yksi" style={{visibility: "hidden"}}></div>
        </div>
      </div>
      </div>
    </div>
  );
}

export default App;
