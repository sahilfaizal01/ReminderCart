import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"


const appSettings = {
    databaseURL: "https://remindercart-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database,"shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingList = document.getElementById("shopping-list")

addButtonEl.addEventListener("click",function(){
    let inputValue = inputFieldEl.value
    push(shoppingListInDB, inputValue)
    clearInpFld()

})

onValue(shoppingListInDB, function(snapshot){ /* run when changes are made to the database */
    if(snapshot.exists()){
        let itemsArray = Object.entries(snapshot.val()) /* convert object to array */

        clearShoppingList()
    
        for(let i=0;i<itemsArray.length;i++){
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemVal = currentItem[1]
    
            appendItem(currentItem)
    
        }
    }else{
        shoppingList.innerHTML = "No items here...yet"
    }
})

function clearShoppingList(){
    shoppingList.innerHTML = ""
}

function clearInpFld(){
    inputFieldEl.value = ""
}

function appendItem(item){
    //shoppingList.innerHTML += `<li>${item}</li>`
    let itemID = item[0]
    let itemValue = item[1]
    let newEl = document.createElement("li")
    newEl.textContent = itemValue
    shoppingList.append(newEl)
    // delete the items that are pressed
    newEl.addEventListener("click", function(){
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB)
    })
}