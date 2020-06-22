const Alexa = require("ask-sdk-core");
const actions = require("./functions");

const Quotes = {
  
  pc:[
    "Sales of PC in North is 14066 as on 16 June 2020",
    "Sales of PC in Region South is 8563 as on 11 June 2020",
    "Sales in Region East for PC is 6783 as on 11 June 2020",
    "Sales of PC in Region West is 10896 as on 11 June 2020"
    ],
  notebook:[
    "Sales of Notebook in Region North is 12309 as on 11 June 2020",
    "Sales of Notebook in Region South is 8563 as on 11 June 2020",
    "Sales in Notebook  East for PC is 7646 as on 11 June 2020",
    "Sales of Notebook in Region West is 14562 as on 11 June 2020"
    ],
  printer:[
    "Sales of Printer in Region North is 12309 as on 11 June 2020",
    "Sales of Printer in Region South is 8563 as on 11 June 2020",
    "Sales in Printer  East for PC is 7646 as on 11 June 2020",
    "Sales of Printer in Region West is 14562 as on 11 June 2020"
    ],
  east:[
    "Sales in Region East for PC is 6783 as on 11 June 2020",
    "Sales of Notebook in East is 10896 as on 11 June 2020",
    "Sales of Printer in East is 10896 as on 11 June 2020"
    ],
  west:[
    "Sales of Printer in West is 14562 as on 11 June 2020",
    "Sales of Notebook in West is 5673 as on 11 June 2020",
    "Sales of PC in West is 87562 as on 11 June 2020"
    ],
  north:[
    "Sales of Printer in Region North is 12309 as on 11 June 2020",
    "Sales of Notebook in Region North is 12309 as on 11 June 2020",
    "Sales of PC in Region North is 12309 as on 11 June 2020"
   
    ],
  south:[
    "Sales of Printer in Region South is 8563 as on 15 June 2020",
    "Sales of Notebook in Region South is 5673 as on 15 June 2020",
    "Sales of PC in Region South is 13414 as on 15 June 2020"
    ]
};

const Bookmarks={
  "my office":"28.629860,77.224209",
  "airport": "28.552979,77.122767"
};

var user_origin ="28.712392,77.100642";
var user_destination ="XXXXXX";

var google_api_key ="AIzaSyCainEccqt7cGDnhJkNdU75gF3YD1ARBxU";

var google_api_traffic_model ="best_guess";
var google_api_departure_time = "now";

var google_api_host="maps.googleapi.com";
var google_api_path="/maps/api/directions/json?origin="+user_origin+
"&destination="+user_destination+
"&key="+google_api_key+
"&traffic_model="+google_api_traffic_model+
"&departure_time="+google_api_departure_time;


// Launch Request Handler -- When a skill is launched
const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "LaunchRequest";
  },
  handle(handlerInput) {
    console.log("Launch Request Handler Called");

    let speechText =
      "Hello, I am Data analyst powered by Bytech India Pvt. Ltd. I am glad to meet you! How May I help you Today?";
    let repromptText =
      "I did not receive any input. Do you need any help?";
      
    
    handlerInput.attributesManager.setSessionAttributes({type: "help"});

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(repromptText)
      .getResponse();
  }
};

// Handler for Random Quote
const RandomQuote = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "RandomQuote"
    );
  },
  handle(handlerInput) {
    console.log("RandomQuote intent handler called");

    let getQuote = actions.getQuote(Quotes);
    let author = getQuote[0];
    let quote = getQuote[1];

    let cardTitle = "sales of " + author;
    let cardContent = quote;
    let speechText = quote;
    
    let repromptText ="Do you want know any other data point";

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(cardTitle, cardContent)
      .reprompt(repromptText)
      .getResponse();
      
  }
};

const AuthorQuote = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "AuthorQuote"
    );
  },
  handle(handlerInput) {
    console.log("AuthorQuote Intent handler called");

    // Get the Author Name
    let author = handlerInput.requestEnvelope.request.intent.slots.author.value;

    let getQuote = actions.getQuote(Quotes, author);

    if (!getQuote) {
      return UnhandledHandler.handle(handlerInput);
    }

    author = getQuote[0];
    let quote = getQuote[1];

    let cardTitle = "sales Of " + author;
    let cardContent = quote;
    let speechText = quote;
    
    let repromptText ="Do you want know any other data point";

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(cardTitle, cardContent)
      .reprompt(repromptText)
      .getResponse();
      
  }
};


// get the bookmarked places


const GetBookmarks = {
  canHandle(handlerInput) {
    return (
      handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "GetBookmarks"
      );
  },
  handle(handlerInput) {
    console.log("GetBookmarks Intent Handler Called");
    
    // Get the list of Keys for Bookmarks Object
    let keys = Object.keys(Bookmarks);
    let destinations = "";
    
    // Now iterate through the array and create a statement of places
    for (let i=0; i<keys.length; i++) {
      // OPTIONAL: if it is the last destination, add the keyword "and"
      if (i==keys.length-1) {
        destinations += " and ";
      }
      
      // add the destinations and append comma with each to make it a proper speech
      destinations += keys[i] + ", ";
    }
    
    let speechText = "Your bookmarked places are " + destinations;
    
    return handlerInput.responseBuilder
      .speak(speechText)
      .getResponse();
  }
};



// Unhandled Requests
const UnhandledHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error Handler : ${error.message}`);

    return handlerInput.responseBuilder
      .speak(
        "Sorry, I am unable to understand what you said. You can mention some category"
      )
      .getResponse();
  }
};

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler, 
    RandomQuote, 
    AuthorQuote,
    GetBookmarks
    )
  .addErrorHandlers(UnhandledHandler)
  .lambda();