import pair from "../../redux-elements/pair";
import  { updateUserDetails } from "../../redux-elements/userDetails";
import axios from "axios";

const submitCredentials = async (dispatch, email, password) => {
      try {
        const response = await axios.post("https://api.drf.bendwidth.com/login/",{
        email,
        password,
        })
        console.log(response)
        if (response.status === 200) {
          console.log(response.data.user_id)
          dispatch(updateUserDetails(pair("isLoggedIn", true)));
          dispatch(updateUserDetails(pair("userName", response.data.full_name)));
          dispatch(updateUserDetails(pair("userId", response.data.user_id)));
            dispatch(updateUserDetails(pair("userEmail", email)));
            dispatch(updateUserDetails(pair("collegeName", response.data.college_name)));
            dispatch(updateUserDetails(pair("gradDate", response.data.grad_date)))
            dispatch(updateUserDetails(pair("preferredLanguage", response.data.preferred_language)));
          return {"fullName": response.data.full_name}
        }
        return false
      } catch (error) {
        return error
      }
}
    
export default submitCredentials;