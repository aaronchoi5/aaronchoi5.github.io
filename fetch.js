var card_data = [];
var slot_map = new Map();
var bookCounter = 0;

function book2png()
{
	var canvas = document.querySelector('canvas');
	var ctx = canvas.getContext('2d');
	
	canvas.height = Math.floor((slot_map.size / 6 + 1)) * 125;
	const cardsData = document.querySelector(".editBookArea").childNodes;// sort childnodes?slot_map?
	const selectionArea = document.querySelector(".cardSelectionArea");
	var canY = 0;
	var canX = 0;

	for(let i = 0; i < cardsData.length; i++)
	{
		var number = slot_map.get(cardsData[i].id)[0].toString()
		var img = new Image();
		img.src = slot_map.get(cardsData[i].id)[1];
		ctx.drawImage(img,canX,canY);
		if(number > 1)
		{
			ctx.strokeStyle='black';
			ctx.fillStyle='white';
			ctx.font = "40px Arial";
			ctx.lineWidth = "1px";
			ctx.strokeText(number.toString(), (canX + 75), (canY + 120)); 
			ctx.fillText(number.toString(), (canX + 75), (canY + 120)); 
		}
		
		canX = (canX + 100) % 600;
		if(canX == 0 && i != 0)
		{
			canY += 125;
		}
	}	
}
function copyListToClipboard()
{
	const cardsData = document.querySelector(".editBookArea").childNodes;
	var outputString = "";
	for(let i = 0; i < cardsData.length; i++)
	{
		outputString += cardsData[i].childNodes[0].innerText + " " + cardsData[i].childNodes[1].innerText + "\n";
	}
	//hackysolution because copying from multiple elements is complicated apparently
	const copyToClipboard = str => {

	  const el = document.createElement('textarea');  // Create a <textarea> element
	  el.value = str;                                 // Set its value to the string that you want copied
	  el.setAttribute('readonly', '');                // Make it readonly to be tamper-proof
	  el.style.position = 'absolute';                 
	  el.style.left = '-9999px';                      // Move outside the screen to make it invisible
	  document.body.appendChild(el);                  // Append the <textarea> element to the HTML document
	  const selected =            
	    document.getSelection().rangeCount > 0        // Check if there is any content selected previously
	      ? document.getSelection().getRangeAt(0)     // Store selection if found
	      : false;                                    // Mark as false to know no selection existed before
	  el.select();                                    // Select the <textarea> content
	  document.execCommand('copy');                   // Copy - only works as a result of a user action (e.g. click events)
	  document.body.removeChild(el);                  // Remove the <textarea> element
	  if (selected) {                                 // If a selection existed before copying
	    document.getSelection().removeAllRanges();    // Unselect everything on the HTML document
	    document.getSelection().addRange(selected);   // Restore the original selection
	  }
	  
	};
	copyToClipboard(outputString);
}
function addToBook(cardName,cardNum, link, slotColor)
{
	if(!slot_map.has(cardName) && bookCounter < 50)
	{
		slot_map.set(cardName, [1, link]);
		const bookArea = document.querySelector(".editBookArea");

		const cardsData = document.querySelector(".editBookArea").childNodes;
		var beforeNode = undefined;
		//logic to place the new card slot
		for(let i = 0; i < cardsData.length; i++ )
		{
			console.log(cardsData[i].style.order);
			if(cardsData[i].style.order > cardNum )
			{
				beforeNode = cardsData[i];
				break;
			}
		}

		const wrapper = document.createElement('div');
		wrapper.setAttribute("class", "flex-container");
		wrapper.setAttribute("id", cardName);
		wrapper.style.order = cardNum;

		const slot = document.createElement('div');
		slot.classList.add("name");
		slot.innerText = cardName;
		slot.style.backgroundColor = slotColor;

		const slotNum = document.createElement('div');
		slotNum.classList.add("count");
		slotNum.innerText = 1;

		wrapper.appendChild(slot);
		wrapper.appendChild(slotNum);
		wrapper.addEventListener("click", function(){removeFromBook(cardName)},false);
		if( beforeNode === undefined)
		{
			bookArea.appendChild(wrapper);
		}
		else
		{
			bookArea.insertBefore(wrapper, beforeNode);
		}
		
		bookCounter++;
	}
	else if( slot_map.get(cardName)[0] < 4 && bookCounter < 50)
	{
		editSlotCount(cardName, "add");
		bookCounter++;
	}
	
	console.log(bookCounter);
}

function removeFromBook(cardName)
{
	if(slot_map.get(cardName)[0] == 1)
	{
		const bookArea = document.querySelector(".editBookArea");
		const slotWrapper = document.getElementById(cardName);
		bookArea.removeChild(slotWrapper);
		slot_map.delete(cardName);
	}
	else
	{
		editSlotCount(cardName, "subtract");
	}
	bookCounter--;
}
function editSlotCount(cardName, addOrSubtract)
{
	var countElement = document.getElementById(cardName).getElementsByClassName("count")[0];
	var updatedCount = parseInt(countElement.innerText);
	if(addOrSubtract == "add")
	{
		updatedCount++;
	}
	else
	{
		updatedCount--;
		console.log(updatedCount);
	}
	countElement.innerText = updatedCount;
	slot_map.set(cardName, [updatedCount, slot_map.get(cardName)[1]]);
}
function determineSlotColor(cardType, cardAttribute)
{
	var color = ""
	if (cardType === "Creature") 
	{
		if(cardAttribute == "Neutral")
	        {
	        	color = "#A9A9A9";
	        }
	        else if(cardAttribute == "Fire")
	        {
	        	color = "#DC143C";	
	        }
	        else if(cardAttribute == "Water")
	        {
	        	color = "#00BFFF";
	        }
	        else if(cardAttribute == "Earth")
	        {
	        	color = "#32CD32";
	        }
	        else if(cardAttribute == "Air")
	        {
	        	color = "#FFD700";
	        }
	}
	else if (cardType === "Spell") 
	{
	    color = "#F5FFFA";
	} 
	else if (cardType === "Item") 
	{
	    color = "#B0C4DE";
	}
	return color;
}
function showCardInfo(cardInfo)
{
	const cardStatsArea = document.querySelector(".cardStatsArea");
	const card = document.createElement('img');

	card.classList.add("center");

	const imageName = cardInfo.name.toLowerCase().replace(/[^a-z0-9+]+/gi, '');

	const imageLocation = imageNameParser(imageName, cardInfo.type ,cardInfo.attribute, cardInfo.rarity)
	const link = "./images/" + imageLocation + "/" + imageName + ".jpg";
	card.src = link;
	
	const cardName = "Name: " + cardInfo.name + "\n";
	const rarity = "Rarity: " + cardInfo.rarity + "\n" ;
	const type = "Type: " + cardInfo.type + "\n";
	const attribute = "Attribute: " + cardInfo.attribute + "\n";
	const cardCost = "Cost: " + cardInfo.costValue + " "+ cardInfo.costOther + "\n";
	const stAndMHP = "ST/MHP: " + cardInfo.st + "/" + cardInfo.mhp + "\n";
	const landLimit = "Land Limit: " + cardInfo.placeRestriction + "\n";
	const itemLimit = "Item Limit: " + cardInfo.itemRestriction + "\n";
	const abilityText = "Ability Text: " + cardInfo.abilityText + "\n";

	const cardDetails = document.createElement('p');
	cardDetails.innerText = cardName + rarity + type + attribute + cardCost + stAndMHP + landLimit + itemLimit + abilityText;
	cardDetails.style.color = "white";
	cardDetails.style.fontSize = "12px";
	cardDetails.style.marginLeft = "5px";


//set better margins? make sure to refine style
	cardStatsArea.appendChild(card);
	cardStatsArea.appendChild(cardDetails);

}
function removeCardInfo()
{
	const cardStatsArea = document.querySelector(".cardStatsArea");
	cardStatsArea.innerHTML = '';
}
function imageNameParser(cardName,type ,attribute, rarity)
{
	let folderLocation = "";
	if (type === "Creature") 
	{
	    if (rarity === "E") 
	    {
	        folderLocation = "evo";
	    } 
	    else 
	    {
	        folderLocation = attribute.toLowerCase();
	    }
	} 
	else if (type === "Spell") 
	{
	    folderLocation = "spells";
	} 
	else if (type === "Item") 
	{
	    folderLocation = "items";
	}
	return folderLocation;
}
function cardCreation(cardInfo)
{
	const selectionArea = document.querySelector(".cardSelectionArea");
	const card = document.createElement('img');
	card.title = cardInfo.name;
	card.classList.add("card");

	const imageName = cardInfo.name.toLowerCase().replace(/[^a-z0-9+]+/gi, '');
	const slotColor = determineSlotColor(cardInfo.type, cardInfo.attribute);
	
	let folderLocation = imageNameParser(imageName, cardInfo.type ,cardInfo.attribute, cardInfo.rarity)
	const link = "./images/thumbnails/" + folderLocation + "/" + imageName + ".jpg";
	card.src = link;

	card.addEventListener("click", function(){addToBook(cardInfo.name, cardInfo.num, link, slotColor)},false);
	card.addEventListener("mouseover", function(){showCardInfo(cardInfo)},false);
	card.addEventListener("mouseout", function(){removeCardInfo()},false);
	selectionArea.appendChild(card);
}
function selectFilter()
{
	card_data = []
	const selectionArea = document.querySelector(".cardSelectionArea");
	selectionArea.innerHTML = '';
	for( let i = 0; i < data.length; i++)
	{
		if(arguments[0] == data[i].type)
		{
			if(arguments[1] === undefined )
			{
				cardCreation(data[i]);
				card_data.push(data[i]);
			}
			else if(arguments[0] == "Creature" && arguments[1] == data[i].attribute)
			{
				cardCreation(data[i]);
				card_data.push(data[i]);
			}
			else if( arguments[1] == data[i].classification)
			{
				cardCreation(data[i]);
				card_data.push(data[i]);
			}
		}
		else if(arguments[0] === undefined)
		{
			cardCreation(data[i]);
			card_data.push(data[i]);
		}
	}
}
