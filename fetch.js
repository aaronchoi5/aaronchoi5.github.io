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
function addToBook(cardName,cardNum, link)
{
	if(!slot_map.has(cardName) && bookCounter < 50)
	{
		slot_map.set(cardName, [1, link]);
		const bookArea = document.querySelector(".editBookArea");

		const cardsData = document.querySelector(".editBookArea").childNodes;
		var beforeNode = undefined;
		//console.log(cardsData);
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

		//flexbox autosorts them according to their card number property <3
		wrapper.style.order = cardNum;

		const slot = document.createElement('div');
		slot.classList.add("name");
		slot.innerText = cardName;

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

function cardCreation(cardInfo)
{
	const selectionArea = document.querySelector(".cardSelectionArea");
	const card = document.createElement('img');
	card.title = cardInfo.name;
	card.classList.add("card");

	const cardName = cardInfo.name.toLowerCase().replace(/[^a-z0-9+]+/gi, '');

	let imageLocation = "";

	if (cardInfo.type === "Creature") 
	{
	    if (cardInfo.rarity === "E") 
	    {
	        imageLocation = "evo";
	    } 
	    else 
	    {
	        imageLocation = cardInfo.attribute.toLowerCase();
	    }
	} 
	else if (cardInfo.type === "Spell") 
	{
	    imageLocation = "spells";
	} 
	else if (cardInfo.type === "Item") 
	{
	    imageLocation = "items";
	}
	const link = "./images/thumbnails/" + imageLocation + "/" + cardName + ".jpg";
	card.src = link;

	card.addEventListener("click", function(){addToBook(cardInfo.name, cardInfo.num, link)},false);
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