const http = require("http");
const fs = require("fs");
const requests = require("requests");

const port = process.env.PORT || 3001;

const homeFile = fs.readFileSync("index.html", "utf-8");

const replaceVal = (tempVal, orgVal)=>{
    let temperature=tempVal.replace("{%tempval%}", orgVal.main.temp)
    temperature=temperature.replace("{%tempmin%}", orgVal.main.temp_min)
    temperature=temperature.replace("{%tempmax%}", orgVal.main.temp_max)
    temperature=temperature.replace("{%city%}", orgVal.name)
    temperature=temperature.replace("{%country%}", orgVal.sys.country)
    temperature=temperature.replace("{%tempStatus%}", orgVal.weather[0].main)

    return temperature;
}

const server = http.createServer((req, res) => {
  if (req.url == "/") {

    requests("https://api.openweathermap.org/data/2.5/weather?q=imphal&units=metric&appid=fdb876aac9705866d0d36932f09effe1")

      .on("data", function (chunk) {
        const objData=JSON.parse(chunk);
        const arrData=[objData];
        console.log(arrData[0]);
        const realTimeData=arrData
            .map((val)=> replaceVal(homeFile, val))
            .join("");
        res.write(realTimeData);
        // res.writeHead(200);
        // console.log(realTimeData);
      })

      .on("end", function (err) {
        if (err) return console.log("connection closed due to errors", err);
        
        res.end();
      });
  }
});

server.listen(port,() => {
  console.log("server is listening at port number ${port} !");
});
