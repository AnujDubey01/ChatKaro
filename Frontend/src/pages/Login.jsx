import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../../redux/userSlice';

const Login = () => {
      let navigate = useNavigate();
  const [show, setshow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState();
  const dispatch = useDispatch();
  // const {userData} = useSelector(state=>state.user);
  const LoginUrl = import.meta.env.VITE_BACKEND_URL || "";



  const handleLogin = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      let result = await axios.post(
                        `${LoginUrl}/api/v1/auth/login`,
                        { email, password },
                        { withCredentials: true }
                    );
                    // console.log(result.data);
                    dispatch(setUserData(result.data.user));
                    setEmail("");
                    setPassword("");
                    setLoading(false);
    } catch (error) {
    console.error(error.response?.data || error.message);
    setLoading(false);
    setErr(error.response?.data?.message || "An error occurred");
}
  }
  return (
    <div className="w-full h-[100vh] bg-slate-200 flex justify-center items-center">
      <div className="w-full max-w-[500px] h-[600px] bg-white rounded-lg shadow-gray-400 shadow-lg">
        <div className="w-full h-[200px] bg-[#20c7ff] rounded-b-[30%] shadow-gray-400 shadow-lg flex justify-center items-center">
          <h1 className="text-gray-600 font-bold text-[30px]">
            Login to <span className="text-white">ChatKaro</span>{" "}
          </h1>
        </div>
        <form className="w-full flex flex-col gap-[20px] items-center py-3" onSubmit={handleLogin}>
         
          <input
            type="email"
            placeholder="email"
            className="w-[90%] h-[50px] outline-none border-2 border-[#20c7ff] px-[20px] py-[10px] bg-white rounded-lg shadow-lg shadow-gray-400 text-gray-700 text-[19px]"
             onChange={(e)=> setEmail(e.target.value)}
            value={email}
          />
          <div className="  w-[90%] h-[50px] outline-none border-2 border-[#20c7ff]  rounded-lg shadow-gray-200 relative">
            <input
              type={`${show ? "text" : "password"}`}
              placeholder="password"
              className="w-full h-full px-[20px] py-[10px] text-gray-700 text-[19px]"
               onChange={(e)=> setPassword(e.target.value)}
            value={password}
            />
            <span
              className="absolute top-[10px] right-[15px] text-[19px] text-[#20c7ff] font-semibold cursor-pointer"
              onClick={() => setshow((prev) => !prev)}
            >{`${show ? "Hide" : "Show"}`}</span>
          </div>
          {err && <p className="text-red-500">{err}</p>}
          <button className="w-[200px] mt-1.5 px-[20px] py-[10px] bg-[#20c7ff] rounded-lg shadow-lg shadow-gray-200 overflow-hidden text-gray-700 text-[19px] font-semibold hover:bg-[#20c7ff]/90 transition-all duration-300 ease-in-out cursor-pointer" disabled={loading}>
            Login
          </button>
          <p>
            Want to create a new account ?{" "}
            <span
              className="text-[#20c7ff] font-semibold cursor-pointer hover:text-[#20c7ff]/90 transition-all duration-300 ease-in-out"
              onClick={() => navigate("/Signup")}
            >
              {loading ? "Processing..." : "SignUp"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login