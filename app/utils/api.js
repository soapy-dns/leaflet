import Axios from 'axios';
// import _ from 'lodash';
// import config from '../config';

Axios.interceptors.request.use((conf) => {
    const updatedConfig = Object.assign({}, conf);

    // updatedConfig.headers.Authorization = token;

    return updatedConfig;
})

const endpoint = 'http://localhost:3001'

const Api = {

    // rural fire service stuff
    getMajorIncidents: () => Axios.get('https://cors-anywhere.herokuapp.com/https://www.rfs.nsw.gov.au/feeds/majorIncidents.json'),

    postLearningImage: (img, label) => Axios.post(`${endpoint}/face/${label}`, img),
    train: () => Axios.put(`${endpoint}/face/train`),
    identifyFace: (img) => Axios.post(`${endpoint}/face/identify`, img)

};

export default Api;
