var express = require('express');
var app = express();
const port = 3000;

app.use('/', express.static('.'));
//app.use(express.static('html'));

app.listen(port, () => {
  console.log(`listening on port ${port}`)
});