import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { updateWholeUserObject } from "../../redux-elements/userDetails";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";

const CallLobby = () => {
  const dispatch = useDispatch();
  const navigateTo = useNavigate();
  const [locales, setLocales] = useState([]);
  const [loading, setLoading] = useState(false);

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

    // fetchData();
  }, []); // Empty dependency array means this effect runs once on mount

  // redirect user to call
  const joinCall = () => {
    navigateTo("/join-video");
  };

  return (
    <div className="lobby-wrapper">
      <div className="lobby-title">
        <i className="fa fa-headset"></i>
        <h1>Your call starts in 10 minutes.</h1>
      </div>
      <div className="lobby-connnected">
        <h4>Nicole is in this call</h4>
      </div>
      <Autocomplete
        disablePortal
        className="locales_autocomplete"
        options={locales}
        renderInput={(params) => (
          <TextField {...params} label="Language you will be speaking in" />
        )}
      />
      <Autocomplete
        disablePortal
        className="locales_autocomplete"
        options={[...new Set(locales.map((locale) => locale.split("-")[0]))]}
        renderInput={(params) => (
          <TextField {...params} label="Language you want to hear" />
        )}
      />

      <button className="lobby-join" onClick={joinCall}>
        Join Call
      </button>
    </div>
  );
};
export default CallLobby;
