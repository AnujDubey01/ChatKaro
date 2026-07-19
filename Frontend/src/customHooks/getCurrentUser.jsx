import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../../redux/userSlice';

const getCurrentUser = () => {
    const getuser = import.meta.env.VITE_BACKEND_URL || "";
    const dispatch = useDispatch();
    const {userData} = useSelector(state=>state.user);
    useEffect(()=> {
        const fetchUser=async ()=>{
            try {
                let result = await axios.get(`${getuser}/api/v1/user/current`,
                    {
                    withCredentials:true
                    });
                    dispatch(setUserData(result.data))

            } catch (error) {
                
            }
            fetchUser();
        }
    },[userData])
}

export default getCurrentUser