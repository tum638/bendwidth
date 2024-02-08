import axios from "axios";

export default function Test() {
    
    const sendCall = async () => {
        try {
          const response = await axios.post(
            "http://localhost:8000/connect_matches/",{"data":1}
          );
          console.log(response);
        } catch (error) {
          console.error(error);
        }
      };

    return (
        
        <div>
            <button onClick={sendCall}> Send Request </button>
        </div>
    )
}