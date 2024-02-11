import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate} from "react-router-dom";
import axios from "axios";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { updateUserDetails } from "../../redux-elements/userDetails";
import pair from "../../redux-elements/pair";

const CallLobby = () => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const [connected, setConnected] = useState('Waiting for remote to join.')
  const [locales, setLocales] = useState([]);
  const [loading, setLoading] = useState(false);
  const userData = JSON.parse(sessionStorage.getItem('userData'));

  const AZURE_SUBSCRIPTION_KEY = "dead98ba198948f59a91b61987e616d6";
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          // Request parameters
        };

        const response = await axios.get(
          "https://eastus.api.cognitive.microsoft.com/speechtotext/v3.0/endpoints/locales",
          {
            params: params,
            headers: {
              // Replace "{subscription key}" with your actual subscription key
              "Ocp-Apim-Subscription-Key": `${AZURE_SUBSCRIPTION_KEY}`,
            },
          }
        );

        console.log("Success:", response.data);
        setLocales(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Error occured loading Locales");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs once on mount

  // check remote connection
  useEffect(()=> {
    const intervalId = setInterval(async ()=>{
      const response = await axios.post("https://api.nde.bendwidth.com");
      console.log(response)
    }, 5000)
    return ()=>clearInterval(intervalId);
  }, [])

  // redirect user to call
  const joinCall = async () => {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    if (userData && userData.translatingFrom && userData.hearingIn) {
        console.log(userData.translatingFrom)
        console.log(userData.hearingIn)
        if (userData.isRespondent === true) {
          navigateTo('/join-video')
          return;
        }
        if (connected !== `Waiting for remote to join.`) {
          navigateTo('/join-video')
        } else {
          alert("Please wait for remote to join before leaving the lobby.")
        }
 
    } else {
        alert("Please fill in the language fields.")
    }
    
  };

  useEffect(()=> {
    const intervalId = setInterval(async ()=>{
      const uuid = JSON.parse(sessionStorage.getItem('userData'))["uuid"];
      const response = await axios.get(`https://localhost:9000/check-respondent/?uuid=${uuid}`)
      if (response.data.joined) {
        const name = response.data.name
        setConnected(`${name} joined the call. Please join when you're ready.`)
      }
    }, 5000)
    return ()=>clearInterval(intervalId)
  }, [])

  const setTranslationLanguage = (event, value) => {
    const userData = JSON.parse(sessionStorage.getItem('userData'));
    userData.translatingFrom = value;
    userData.localB47 = value;
    sessionStorage.setItem('userData', JSON.stringify(userData));
    dispatch(updateUserDetails(pair("translatingFrom", value)));
    dispatch(updateUserDetails(pair("localB47", value)));
    console.log(sessionStorage.getItem('userData'))
  }

  const setHearingLanguage = (event, value) => {
   const userData = JSON.parse(sessionStorage.getItem('userData'));
   userData.hearingIn = value;
   userData.languageCode = value
   sessionStorage.setItem('userData', JSON.stringify(userData));
   dispatch(updateUserDetails(pair("hearingIn", value)));
   dispatch(updateUserDetails(pair("languageCode", value)))
   console.log(sessionStorage.getItem('userData'))
  }
  

  return (
    <div className="lobby-wrapper">
      <div className="lobby-title">
        <i className="fa fa-headset"></i>
        <h1>{userData.isRespondent ? "Join the call when you're ready" : connected !== "Waiting for remote to join." ? "The call has started" : "Your call starts in a few minutes." }</h1>
      </div>
      <div className="lobby-connnected">
        <h4>{userData.isRespondent ? "Ready, set, go!!": connected}</h4>
      </div>
      <Autocomplete
        disablePortal
        className="locales_autocomplete"
        options={locales}
        onChange={(event, value) => setTranslationLanguage(event, value)}
        renderInput={(params) => (
          <TextField {...params} label="You will be speaking in what language?"/>
        )}
      />
      <Autocomplete
        disablePortal
        className="locales_autocomplete"
        onChange={(event, value) => setHearingLanguage(event, value)}
        options={[...new Set(locales.map((locale) => locale.split("-")[0]))]}
        renderInput={(params) => (
          <TextField {...params} label="You want the subtitles to be in what language?"/>
        )}
      />

      <button className="lobby-join" onClick={joinCall}>
        Join Call
      </button>
    </div>
  );
};
export default CallLobby;
