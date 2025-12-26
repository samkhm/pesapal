
var axios = require('axios');
var data = JSON.stringify({
  "consumer_key": "qkio1BGGYAXTu2JOfm7XSXNruoZsrqEW",
  "consumer_secret": "osGQ364R49cXKeOYSpaOnT++rHs="
});

var config = {
  method: 'post',
maxBodyLength: Infinity,
  url: 'https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken',
  headers: { 
    'Content-Type': 'application/json', 
    'Accept': 'application/json'
  },
  data : data
};

axios(config)
.then(function (response) {
  console.log(JSON.stringify(response.data));
})
.catch(function (error) {
  console.log(error);
});


//for live
// var axios = require('axios');
// var data = JSON.stringify({
//   "consumer_key": "Do9B1uN/16gIVLr55y25RtUy7J85zhxk",
//   "consumer_secret": "26E1mhZ+tkyOdZ4DDKVifdafU4c="
// });

// var config = {
//   method: 'post',
// maxBodyLength: Infinity,
//   url: 'https://pay.pesapal.com/v3/api/Auth/RequestToken',
//   headers: { 
//     'Content-Type': 'application/json', 
//     'Accept': 'application/json'
//   },
//   data : data
// };

// axios(config)
// .then(function (response) {
//   console.log(JSON.stringify(response.data));
// })
// .catch(function (error) {
//   console.log(error);
// });