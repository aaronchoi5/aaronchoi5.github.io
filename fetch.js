var card_data = [];
var slot_map = new Map();
var bookCounter = 0;

//function magicSorter(cardNum, wrapper)
//{
//	const bookArea = document.querySelector(".editBookArea");
//	const bookAreaChildren = document.querySelector(".editBookArea").childNodes;
//	for(let i = 0; i < bookAreaChildren.length; i++)
//	{
//		if (parseInt(bookAreaChildren[i].id) > cardNum)
//		{
//			var insert = bookArea.insertBefore(wrapper, bookareaChildren[i]);
//		}
//	}
//	//access parent get each child's id and compare data.num's get the one that's right after current num's and insert before
//}
function addToBook(cardName,cardNum)
{
	if(!slot_map.has(cardName) && bookCounter < 50)
	{
		slot_map.set(cardName, 1);
		const bookArea = document.querySelector(".editBookArea");

		const wrapper = document.createElement('div');
		wrapper.setAttribute("class", "flex-container");
		wrapper.setAttribute("id", cardName);
		wrapper.style.order = cardNum;
		const slot = document.createElement('div');
		slot.classList.add("name");
		slot.innerText = cardName;

		const slotNum = document.createElement('div');
		slotNum.classList.add("count");
		slotNum.innerText = slot_map.get(cardName);

		wrapper.appendChild(slot);
		wrapper.appendChild(slotNum);
	
		wrapper.addEventListener("click", function(){removeFromBook(cardName)},false);
		bookArea.appendChild(wrapper);
		//magicSorter(cardNum,wrapper);
		bookCounter++;
	}
	else if( slot_map.get(cardName) < 4 && bookCounter < 50)
	{
		editSlotCount(cardName, "add");
		bookCounter++;
	}
	
	console.log(bookCounter);
}

function removeFromBook(cardName)
{
	if(slot_map.get(cardName) == 1)
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
	}
	countElement.innerText = updatedCount;
	slot_map.set(cardName, updatedCount);
}

function cardCreation(cardInfo)
{
	const card = document.createElement('div');
	const selectionArea = document.querySelector(".cardSelectionArea");
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
	const link = "./" + imageLocation + "/" + cardName + ".jpg";
	card.style.backgroundImage = 'url(' + link + ')';

	card.addEventListener("click", function(){addToBook(cardInfo.name, cardInfo.num)},false);
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