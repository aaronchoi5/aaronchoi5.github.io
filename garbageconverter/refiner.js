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
/* Converting all the numbers to meaningful values */
function returnCardRarity(cardRarity)
{
    var rarity = "N";
    switch(cardRarity)
    {
        case 1:
            rarity = "N";
            break;
        case 2:
            rarity = "S";
            break;
        case 3:
            rarity = "R";
            break;
        case 4:
            rarity = "E";
            break;
    }
    return rarity
}
function returnCardType(cardType)
{
    var type = "";
    switch(cardType)
    {
        case 1:
            type = "Creature";
            break;
        case 2:
            type = "Item";
            break;
        case 3:
            type = "Spell";
            break;
    }
    return type;
}
function returnCardAttribute(cardAttribute)
{
    var attribute = "";
    switch(cardAttribute)
    {
        case 1:
            attribute = "Neutral";
            break;
        case 2:
            attribute = "Fire";
            break;
        case 3:
            attribute = "Water";
            break;
        case 4:
            attribute = "Earth";
            break;
        case 5:
            attribute = "Air";
            break
    }
    return attribute;
}
function returnClassification(cardData)
{
    var classification = ""
    if(cardData.type == 1)
    {
        classification = "Normal"
    }
    else if( cardData.type == 2)
    {
        switch(cardData.kind)
        {
            case 1:
                classification = "Weapon";
                break;
            case 2:
                classification = "Armor";
                break;
            case 3:
                classification = "Tool";
                break;
            case 4:
                classification = "Scroll";
                break;
        }
    }
    else if(cardData.type == 3)
    {
        switch(cardData.kind)
        {
            case 1:
                classification = "Instant";
                break;
            case 2:
                classification = "Multi-Instant";
                break;
            case 3:
                classification = "Enchant";
                break;
            case 4:
                classification = "Multi-Enchant";
                break;
            case 5:
                classification = "Global";
                break;
        }
    }
    return classification;
}
function returnCostOther(costNum)
{
    var costOther = "";
    while(costNum % 10 != 0)
    {
        switch(costNum % 10)
        {
            case 1:
                costOther += "N,";
                break;
            case 2:
                costOther += "R,";
                break;
            case 3:
                costOther += "B,";
                break;
            case 4:
                costOther += "G,";
                break;
            case 5:
                costOther += "Y,";
                break;
            case 6:
                costOther += "+[],";
                break;
        }
        costNum = Math.floor(costNum / 10);
    }
    return costOther;
}
//uses the costOtherList
function returnPlaceRestriction(placeRestNum)
{
    var placeRestriction = "";
    switch(placeRestNum)
        {
            case 0:
                placeRestriction = "";
                break;
            case 1:
                placeRestriction = "N,";
                break;
            case 2:
                placeRestriction = "R,";
                break;
            case 3:
                placeRestriction = "B,";
                break;
            case 4:
                placeRestriction = "G,";
                break;
            case 5:
                placeRestriction = "Y,"
                break;
            case 6:
                placeRestriction = "+[]"
                break;
        }
        return placeRestriction;
}
function returnItemRestriction(itemRestrictionNum)
{
    var itemRestriction = "";
    while(itemRestrictionNum % 10 != 0)
    {
        switch(itemRestrictionNum % 10)
        {
            case 1:
                itemRestriction += "Weapon,";
                break;
            case 2:
                itemRestriction += "Armor,";
                break;
            case 3:
                itemRestriction += "Tool,";
                break;
            case 4:
                itemRestriction += "Scroll,";
                break;
        }
        itemRestrictionNum = Math.floor(itemRestrictionNum / 10);
    }
    
    return itemRestriction;
}
/* Mapping all the cards into a list of JSON-likes. */
const cardsJSON = cardsList.map((cardData) => {
    const matches = cardData.name.match(/(\d*)\)\W+(.*)/);
    
    return {
        legacyId: cardData.num,
        num: parseInt(matches[1]),
        name: matches[2],
        rarity: returnCardRarity(cardData.rarelity),
        type: returnCardType(cardData.type),
        classification: returnClassification(cardData),
        costValue: cardData.costValue,
        costOther: returnCostOther(cardData.costOther),
        attribute: returnCardAttribute(cardData.attribute),
        placeRestriction: returnPlaceRestriction(cardData.placeRestriction),
        itemRestriction: returnItemRestriction(cardData.itemRestriction),
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