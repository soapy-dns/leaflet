import Axios from 'axios';
import _ from 'lodash';
// import config from '../config';

Axios.interceptors.request.use((conf) => {
    const updatedConfig = _.assign({}, conf);

    // updatedConfig.headers.Authorization = token;

    return updatedConfig;
});

const Api = {

    // rural fire service stuff
    getMajorIncidents: () => Axios.get('https://www.rfs.nsw.gov.au/feeds/majorIncidents.json'),


};

export default Api;
