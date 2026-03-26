const axios = require('axios');
axios.get('http://localhost:5000/meals/1')
    .then(res => console.log("SUCCESS:", res.data))
    .catch(err => console.error("ERROR:", err.message));
