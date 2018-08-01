"use strict";

// global require, console

const fs = require("fs");

/* Loading the old data. */
const cardsAll = require("./cardsOld");

/* Converting the garbage NOT array into an actual array. */
const cardsList = [];
for (let key in cardsAll) {
    cardsList.push(cardsAll[key]);
}

/* Mapping all the cards into a list of JSON-likes. */
const cardsJSON = cardsList.map((cardData) => {
    const matches = cardData.name.match(/(\d*)\)\W+(.*)/);

    return {
        legacyId: cardData.num,
        num: parseInt(matches[1]),
        name: matches[2],
        rarity: cardData.rarelity,
        type: cardData.type,
        costValue: cardData.costValue,
        costOther: cardData.costOther,
        attribute: cardData.attribute,
        placeRestriction: cardData.placeRestriction,
        itemRestriction: cardData.itemRestriction,
        st: cardData.st,
        mhp: cardData.mhp,
        abilityText: cardData.abilityText
    };
});

/* Making an object mapping of the card number to its json-like. */
const cardsJSONMap = {};
cardsJSON.forEach(item => {
    cardsJSONMap[item.num + ""] = item;
});


/* Logging our list so we know it did it. */
console.log(cardsJSON);

/* Saving the json-like array and object-map as a JSON file. */
const jsonString = JSON.stringify(cardsJSON, null, 4);
fs.writeFileSync('card_data.json', jsonString, 'utf8');

const jsonMapString = JSON.stringify(cardsJSONMap, null, 4);
fs.writeFileSync('card_data_map.json', jsonMapString, 'utf8');