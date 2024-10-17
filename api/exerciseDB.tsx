import axios from 'axios';
import { rapidApiKey } from '../constants';

const baseUrl = 'https://exercisedb.p.rapidapi.com';

const apiCall = async (url, params)=>{
    try{
        const options = {
            method: 'GET',
            url,
            params,
            headers: {
                    'X-RapidAPI-Key': 'f084d15b55msha653999aca97471p1f38c7jsnd212f9b0f8a3',
                    'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com',
            },

        };
        const response = await axios.request(options);
        return response.data;
    }catch(err){
        console.log('error: ', err.message);
    }
};

export const fetchExercisesByBodypart = async (bodyPart)=>{
    let data = await apiCall(baseUrl + `/exercises/bodyPart/${bodyPart}`);
    return data;
};

export const fetchExercisesById = async (id)=>{
    let data = await apiCall(baseUrl + `/exercises/exercise/${id}`);
    return data;
};
