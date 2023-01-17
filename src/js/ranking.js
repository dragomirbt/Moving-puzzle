let ranking = JSON.parse(localStorage.getItem("ranking"));
//displays the ranking of the players
for(let player of ranking) {
    let tableBody = document.getElementsByTagName("tbody")[0];
 
    const tr = document.createElement("tr");
    tr.innerHTML = `
        <td>
            ${player.user}
        </td>
        <td>
            ${player.score}
        </td>
        `;

    if(tr.classList.contains("currentPlayer")) {
        tr.classList.remove("currentPlayer");
        tr.classList.add("otherPlayer");
    } 
    if(player.currentPlayer){
        tr.classList.add("currentPlayer");
    }else {
        tr.classList.add("otherPlayer");
    }
    
    tableBody.appendChild(tr);
}