import axios from "axios";

export default axios.create({
    baseURL: 'https://vtwitter-f79bb-default-rtdb.europe-west1.firebasedatabase.app',
    headers: {
        'Content-Type': 'application/json'
    },
})