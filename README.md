# RiotAPI
[![Known Vulnerabilities](https://snyk.io/test/github/Mr-Que/riot-api/badge.svg?targetFile=package.json)](https://snyk.io/test/github/Mr-Que/riot-api?targetFile=package.json)

A node.js library for fetching League of Legends data from the [Riot API](https://developer.riotgames.com/).

Riot's API requires a API Key. More information about how to get a Key, Rate Limits and more can be found on their [official Site](https://developer.riotgames.com/getting-started.html).

Game constants like queue types, maps, game types, game modes and rune slots are explained [here](https://developer.riotgames.com/static-data.html).

## Getting started
RiotAPI is designed to be simple.

```javascript
var RiotApi = require('riot-api');
var api = new RiotApi('YOUR_API_KEY_GOES_HERE');
```
Each Method takes an options object and a callback. The callback is always a json object, either a set of results or a status message if the call was invalid.

## Methods
### api.getChampions(options, callback)
Retrieve all champions currently in the game.

#### Options:

 - `filter` - **object** - (Optional) Filter the result to only get Champions who match the specific options.
   - The only current option is the option all which can be defined as **true** or **false** to define if you want the amount of champions or all champion data.


#### Result:

The Result is a array of objects containing information about the champion. An object might look like this:
```javascript
{ version: '9.2.1',
  id: 'Zyra',
  key: '143',
  name: 'Zyra',
  title: 'Rise of the Thorns',
  blurb:
   'Born in an ancient, sorcerous catastrophe, Zyra is the wrath of nature given form—an alluring hybrid of plant and human, kindling new life with every step. She views the many mortals of Valoran as little more than prey for her seeded progeny, and thinks...',
  info: { attack: 4, defense: 3, magic: 8, difficulty: 7 },
  image:
   { full: 'Zyra.png',
     sprite: 'champion4.png',
     group: 'champion',
     x: 96,
     y: 96,
     w: 48,
     h: 48 },
  tags: [ 'Mage', 'Support' ],
  partype: 'Mana',
  stats:
   { hp: 504,
     hpperlevel: 79,
     mp: 418,
     mpperlevel: 25,
     movespeed: 340,
     armor: 29,
     armorperlevel: 3,
     spellblock: 30,
     spellblockperlevel: 0.5,
     attackrange: 575,
     hpregen: 5.5,
     hpregenperlevel: 0.5,
     mpregen: 13,
     mpregenperlevel: 0.4,
     crit: 0,
     critperlevel: 0,
     attackdamage: 53.376,
     attackdamageperlevel: 3.2,
     attackspeedperlevel: 2.11,
     attackspeed: 0.625 }
}
```

#### Example:
```javascript
api.getChampions({
    'filter': {
        'all': true
    }
}, function(data) {
    for(var champion in data){
        let champData = data[champion]
        console.log(champData);
    }
});
```


### api.getLeagues(options, callback)
Retrieves leagues data for summoner, including leagues for all of summoner's teams.

#### Options:
 - `encryptedSummonerId` - **string** - Encrytpted Summoner Id*.
 - `summonerName` - **string** - Summoner Name*.

*Either Encrypted Summoner ID or Name is required.

#### Result:

```javascript
[ { leagueId: '239fc0d0-2353-11e8-b378-c81f66dbb56c',
    leagueName: 'Jax\'s Enforcers',
    queueType: 'RANKED_FLEX_SR',
    position: 'NONE',
    tier: 'GOLD',
    rank: 'IV',
    leaguePoints: 19,
    wins: 2,
    losses: 0,
    veteran: false,
    inactive: false,
    freshBlood: false,
    hotStreak: false,
    summonerId: 'OAR8pPNKHhDbkfcg_EMt1geroqvY5kaoPSg-1vbEouNIobA',
    summonerName: 'brTT' },
  { leagueId: '2b164390-01c3-11e8-b72a-c81f66dbb56c',
    leagueName: 'Riven\'s Hunters',
    queueType: 'RANKED_SOLO_5x5',
    position: 'NONE',
    tier: 'PLATINUM',
    rank: 'III',
    leaguePoints: 0,
    wins: 5,
    losses: 9,
    veteran: false,
    inactive: false,
    freshBlood: false,
    hotStreak: false,
    summonerId: 'OAR8pPNKHhDbkfcg_EMt1geroqvY5kaoPSg-1vbEouNIobA',
    summonerName: 'brTT' } ]
```

#### Example:
```javascript
api.getLeagues({
    'region': 'NA',
    'encryptedSummonerId': 'OAR8pPNKHhDbkfcg_EMt1geroqvY5kaoPSg-1vbEouNIobA'
    //-OR-
    //'summonerName': 'brTT'
}, function(data) {
    console.log(data);
});
```


### api.getMasteries(options, callback)
Get mastery pages for summoner.

#### Options:
 - `encryptedSummonerId` - **string** - Encrytpted Summoner Id*.
 - `summonerName` - **string** - Summoner Name*.

*Either Summoner ID or Name is required.

#### Result:
```javascript
44
```

#### Example:
```javascript
api.getMasteries({
    'region': 'NA',
    'summonerName': 'brTT'
    //-OR-
    // 'encryptedSummonerId': 'OAR8pPNKHhDbkfcg_EMt1geroqvY5kaoPSg-1vbEouNIobA'
}, function(data) {
    console.log(data);
    //process data
});
```

### api.getSummoner(options, callback)
Get basic information about summoner.

#### Options:
 - `summonerName` - **string** - Summoner Name.
 - `encryptedSummonerId` - **string** - Encrytpted Summoner Id.
 - `pUUID` - **string** - Summoner PUUID.
 - `encryptedAId` - **string** - Encrypted Account ID.

One of the options is required

#### Result:

The Result is an object containing basic information of a summoner. 
```javascript
{ id: '0B3bFSvYS42z81iwWxb1ipSY0G04hoNep2fy3Gw5jM4',
  accountId: 'VHUqa9vgdPh1lm1t0R4tmq5wmU4U8P7Shmaxw9viKw',
  puuid:
   'hgZu-QeHsvqlN3VRmnjp19b8Rd8T8q3zkk7VkHJWgIQ420tm0y3KDvUB-7GEhLq9Y4DNTln0UvhKgw',
  name: 'TheOddOne',
  profileIconId: 3152,
  revisionDate: 1536048529000,
  summonerLevel: 33 }
```
#### Example:
```javascript
api.getSummoner({
    'summonerName': 'TheOddOne'
}, function(data) {
    console.log(data);
    // process data
});
```
