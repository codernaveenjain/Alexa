const https =require("https");


const myfunctions = {
  // Take out the quote and return author as well as quote
  getQuote: function(quotes, author) {
    console.log("Getting into getQuoteFunction");

    // Get random author if author is not defined
    if (author === undefined) {
      var totalauthors = Object.keys(quotes).length;
      var rand = Math.floor(Math.random() * totalauthors);

      // random author name
      author = Object.keys(quotes)[rand];
    }

    // check the author if it exists, and have a single author name
    switch (author) {
      case "notebook":
        author = "notebook";
        break;
      case "note book":
        author = "notebook";
        break;
      case "pc":
        author = "pc";
        break;
      case "west":
        author = "west";
        break;
      case "east":
        author = "east";
        break;
      case "north":
        author = "north";
        break;
      case "South":
        author = "south";
        break;
      case "printer":
        author = "printer";
        break;
      case "print":
        author = "printer";
        break;
      default:
        author: "Unknown";
    }

    // Get total quotations for the author from the Quotes object
    var totalquotations = quotes[author].length;

    // Select a random quotation
    var randquote = Math.floor(Math.random() * totalquotations);
    var quote = quotes[author][randquote];

    console.log("Return author and quote");

    // return both the author name and the quote as an array
    return [author, quote];
  },
  
  // make an http request and retrieve data either through GET or POST
  
  
  getData: function(options, postData) {
    return new Promise(function(resolve,reject) {
      var request = https.request(options, function(response) {
        // reject if status is not 2xxx
        if (response.statusCode < 200 || response.statusCode >= 300) {
          return reject(new Error("statusCode=" + response.statusCode));
        }
        
        // Status is in 2xx
        // cumulate data
        var body = [];
        response.on("data", function (chunk) {
          body.push(chunk);
        });
        
        // when process ends
        response.on("end", function() {
          try {
            body = JSON.parse(Buffer.concat(body).toString());
            // use just 'body' for non JSON input
          } catch (error) {
            reject(error);
          }
          resolve(body);
        });
      });

      // manage other request errors
      request.on("error", function(error) {
        reject(error);
      });

      // POST data (optional)
      if (postData) {
        request.write(postData);
      }
      
      // End the request. It's Important
      request.end();
    }); // promise ends
  }
  
  
};

module.exports = myfunctions;
