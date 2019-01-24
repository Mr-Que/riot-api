let request = require('request');

let RiotApi = module.exports = function (API_KEY) {
  this.API_KEY = API_KEY;
  this._cache = {};
  this.BASE_PATH = 'https://na1.api.riotgames.com/lol/';
};

/*
TODO LIST:
  - Get encrypted summoner id if we have to do ANYTHING with a players name
    - https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/<SUMMONER_NAME>?api_key=<API_KEY>
*/


RiotApi.prototype.getCachedJSONRequest = function (url, callback) {
  if (this._cache.hasOwnProperty(url)) {
    callback(this._cache[url]);
  } else {
    let self = this;
    request({
      uri: url,
      json: true,
    }, (error, response, json) => {

      if (!error && response.statusCode === 200) {
        self._cache[url] = json;
      }
      if (response.statusCode === 404) {
        callback({
          "status": {
            "message": "Not Found",
            "status_code": 404
          }
        });
      } else {
        callback(json);
      }
    });
  }
};

// NOTE: Champions are now static and found in a CDN(http://ddragon.leagueoflegends.com/cdn/6.24.1/data/en_US/champion.json) which the version number is dynamic
// TODO: Get a dynamic version number for faster implementation
// OLD: prod.api.pvp.net/api/lol/'+region+'/v1.3/summoner/by-name/'+name+'?api_key=' + auth.leagueoflegend.key/;
RiotApi.prototype.getChampions = function (options, callback) {

  if (options.hasOwnProperty('filter')) {
    if (options.filter.hasOwnProperty('all')) {
      this.getCachedJSONRequest('http://ddragon.leagueoflegends.com/cdn/9.2.1/data/en_US/champion.json', (json) => {
        if (json.hasOwnProperty('status')) callback(json);
        callback(json.data);

      });
    }
  } else {
    this.getCachedJSONRequest('http://ddragon.leagueoflegends.com/cdn/9.2.1/data/en_US/champion.json', (json) => {
      if (json.hasOwnProperty('status')) callback(json);
      callback(Object.keys(json.data));

    });
  }
};

RiotApi.prototype.getRecentGames = function (options, callback) {
  let region = (options.region || 'NA').toLowerCase();
  if (options.hasOwnProperty('summonerId')) {
    this.getCachedJSONRequest(`${this.BASE_PATH + region  }/v1.3/game/by-summoner/${  options.summonerId  }/recent?api_key=${  this.API_KEY}`, callback);
  } else if (options.hasOwnProperty('summonerName')) {
    let self = this;
    this.getSummoner(options, (json) => {
      if (json.hasOwnProperty('status')) callback(json);
      else {
        self.getCachedJSONRequest(self.BASE_PATH + region + '/v1.3/game/by-summoner/' + json.id + '/recent?api_key=' + self.API_KEY, callback);
      }
    });
  } else {
    callback({});
  }
};


// DONE:
RiotApi.prototype.getSummoner = function (options, callback) {
  /*
    GET /lol/summoner/v4/summoners/by-name/{summonerName} Get a summoner by summoner name.
    GET /lol/summoner/v4/summoners/by-account/{encryptedAccountId} Get a summoner by account ID.
    GET /lol/summoner/v4/summoners/by-puuid/{encryptedPUUID} Get a summoner by PUUID.
    GET /lol/summoner/v4/summoners/{encryptedSummonerId}
    */

  if (options.hasOwnProperty('summonerName')) {
    this.getCachedJSONRequest(`${this.BASE_PATH  }summoner/v4/summoners/by-name/${  options.summonerName  }?api_key=${  this.API_KEY}`, callback);
  } else if (options.hasOwnProperty('encryptedAId')) {
    this.getCachedJSONRequest(`${this.BASE_PATH  }summoner/v4/summoners/by-account/${  options.encryptedAID  }?api_key=${  this.API_KEY}`, callback);
  } else if (options.hasOwnProperty('pUUID')) {
    this.getCachedJSONRequest(`${this.BASE_PATH  }summoner/v4/summoners/by-puuid/${  options.pUUID  }?api_key=${  this.API_KEY}`, callback);
  } else if (options.hasOwnProperty('encSummonerId')) {
    this.getCachedJSONRequest(`${this.BASE_PATH  }summoner/v4/summoners/${  options.encSummonerId  }?api_key=${  this.API_KEY}`, callback);
  } else {
    callback({});
  }
};


// DONE:
RiotApi.prototype.getLeagues = function (options, callback) {
  if (options.hasOwnProperty('encryptedSummonerId')) {
    this.getCachedJSONRequest(`${this.BASE_PATH}league/v4/positions/by-summoner/${  options.encryptedSummonerId  }?api_key=${  this.API_KEY}`, (json) => {
      if (json.hasOwnProperty('status')) callback(json);
      else {
        callback(json)
      }
    });
  } else if (options.hasOwnProperty('summonerName')) {
    let self = this;
    this.getSummoner(options, (json) => {
      if (json.hasOwnProperty('status')) callback(json);
      else {
        let encID = json.id;
        self.getCachedJSONRequest(`${this.BASE_PATH}league/v4/positions/by-summoner/${ encID }?api_key=${  this.API_KEY}`, (json) => {
          if (json.hasOwnProperty('status')) callback(json);
          else {
            callback(json)
          }
        });
      }
    });
  } else {
    callback({});
  }
};


// NOTE: THIS IS DEPRECATED 
RiotApi.prototype.getStatsSummary = function (options, callback) {
  callback({
    "status": {
      "message": "Deprecated - Not Acceptable",
      "status_code": 406
    }
  });
};

// NOTE: THIS IS DEPRECATED 
RiotApi.prototype.getRankedStats = function (options, callback) {
  callback({
    "status": {
      "message": "Deprecated - Not Acceptable",
      "status_code": 406
    }
  });
};

// DONE:
RiotApi.prototype.getMasteries = function (options, callback) {
  if (options.hasOwnProperty('encryptedSummonerId')) {
    this.getCachedJSONRequest(`${this.BASE_PATH }champion-mastery/v4/scores/by-summoner/${  options.encryptedSummonerId  }?api_key=${  this.API_KEY}`, callback);
  } else if (options.hasOwnProperty('summonerName')) {
    this.getSummoner(options, (json) => {
      if (json.hasOwnProperty('status')) callback(json);
      else {
        let encID = json.id;
        this.getCachedJSONRequest(`${this.BASE_PATH }champion-mastery/v4/scores/by-summoner/${  encID }?api_key=${  this.API_KEY}`, callback);
      }
    });
  } else {
    callback({});
  }
};


// NOTE: THIS IS DEPRECATED
RiotApi.prototype.getRunes = function (options, callback) {
  callback({
    "status": {
      "message": "Deprecated - Not Acceptable",
      "status_code": 406
    }
  });
};

// NOTE: THIS IS DEPRECATED
RiotApi.prototype.getSummonerNamesByIds = function (options, callback) {
  callback({
    "status": {
      "message": "Deprecated - Not Acceptable",
      "status_code": 406
    }
  });
};

// NOTE: THIS IS DEPRECATED
RiotApi.prototype.getTeams = function (options, callback) {
  callback({
    "status": {
      "message": "Deprecated - Not Acceptable",
      "status_code": 406
    }
  });
};