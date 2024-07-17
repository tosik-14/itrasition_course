const readline = require('readline');
const crypto = require('crypto');  
const Table = require('cli-table');
//const { upgrade } = require('c:/users/tosik-asus/appdata/local/microsoft/typescript/5.2/node_modules/undici-types/api');


let gameIndex = 3;


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


class Help {
    constructor() {
        this.arr = ['Fire', 'Water', 'Air', 'Sponge'];
        this.colWidths = [15, 10, 10, 10];
        this.newTable();
        this.game = new Game();
        this.results = new Results();
    }

    newTable() {
        this.table = new Table({
            colWidths: this.colWidths
        });
        this.table.push(
            ['PC / User', 'Rock', 'Scissors', 'Paper'],
            ['Rock', 'Draw', 'Lose', 'Win'],
            ['Scissors', 'Win', 'Draw', 'Lose'],
            ['Paper', 'Lose', 'Win', 'Draw']
        );
    }

    updateTable() {
        const newItem = this.arr[this.table.length - 4];
        this.colWidths.push(10);

        this.table[0].push(newItem);

        
        for (let i = 1; i < this.table.length; i++) {  // add column
            const user = this.table[i][0];
            const result = this.results.result(this.game.getMoveId(newItem), this.game.getMoveId(user));
            this.table[i].push(this.getResultText(result));
        }

        const newRow = [newItem];
        for (let i = 1; i < this.table.length; i++) {    //add row      
            const pc = this.table[0][i];
            const result = this.results.result(this.game.getMoveId(pc), this.game.getMoveId(newItem));
            newRow.push(this.getResultText(result));
        }


        newRow.push('Draw');  
        this.table.push(newRow);
    }

    getResultText(result) {
        if (result == 0) { return 'Win'; }
        if (result == 1) { return 'Lose'; }
        else {
            return 'Draw';
        }
    }

    cleaningTable() {
        this.colWidths = [15, 10, 10, 10];
        this.newTable();
        for (let i = 3; i < gameIndex; i++) {
            this.updateTable();
        }
    }

    display() {
        console.log(this.table.toString());
    }
    
}

class Game {
    constructor(results) {
        this.pcMoveHash = new PcMoveHash();
        this.gameResults = results;
    }

    async play() {
        //let pcMove; let key; let hash;
        const { pcMove, key, hash } = this.pcMoveHash.getPcMove();

        console.log(`\nComputer move hash: ${hash}\n`);

        const playerChoice = await this.getPlayerMove();
        let playerMove;
        //if (playerMove != 1 || playerMove != 2 || playerMove != 3) { console.Log("Incorrect move, try again"); return; }
        switch (playerChoice) {
            case '1':
                playerMove = 'Rock';
                break;
            case '2':
                playerMove = 'Scissors';
                break;
            case '3':
                playerMove = 'Paper';
                break;
            case '4':
                if (gameIndex >= 4) {
                    playerMove = 'Fire';
                }
                else {
                    console.log("Unknown move, try again\n");
                    return;
                }
                break;
            case '5':
                if (gameIndex >= 5) {
                    playerMove = 'Water';
                }
                else {
                    console.log("Unknown move, try again\n");
                    return;
                }
                break;
            case '6':
                if (gameIndex >= 6) {
                    playerMove = 'Air';
                }
                else {
                    console.log("Unknown move, try again\n");
                    return;
                }
                break;
            case '7':
                if (gameIndex == 7) {
                    playerMove = 'Sponge';
                }
                else {
                    console.log("Unknown move, try again\n");
                    return;
                }
                break;
            default:
                console.log("Unknown move, try again\n");
                //gameRunning = false;
                return;
                break;
        }
        console.log(`You made a move with ${playerMove}\n`)
        console.log(`Computer made a move with ${pcMove}\n`);
        let playerMoveId = this.getMoveId(playerMove);
        let pcMoveId = this.getMoveId(pcMove);
        const result = this.gameResults.result(playerMoveId, pcMoveId);
        if (result == 2) { console.log("It's draw\n"); }
        else if (result == 0) { console.log("You win!\n"); }
        else if (result == 1) { console.log("You lose!\n"); }
        //console.log(`${result}\n`);
        console.log(`Computer move key: ${key}\n`);
        //gameRunning = false;
    }

    getPlayerMove() {
        /*const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });*/
        let quest = 'Select move:\n 1) Rock\n 2) Scissors\n 3) Paper\n';
        let arr = ['Fire', 'Water', 'Air', 'Sponge'];
        if (gameIndex > 3) {
            for (let i = 3; i < gameIndex; i++) {
                quest += ` ${i+1}) ${arr[i - 3]}\n`;
            }
        } 
        return new Promise(
            (result) =>
            {
                rl.question(quest, (move) =>
                {
                    //rl.close;
                    result(move);
                });
            });
    }

    getMoveId(move) {
        let id = 0;
        if (move == 'Rock') { id = 1; }
        else if (move == 'Scissors') { id = 3; }
        else if (move == 'Paper') { id = 5; }
        else if (move == 'Fire') { id = 2; }
        else if (move == 'Water') { id = 7; }
        else if (move == 'Air') { id = 6; }
        else if (move == 'Sponge') { id = 4; }
        return id;
    }
}

class Results {
    constructor() { 
    }

    result(playerMoveId, pcMoveId) {
        if (playerMoveId == pcMoveId) { return 2; }  // draw
        if ((playerMoveId + 3) > 7 && (pcMoveId - 3) < 1) {   // if max param 7 then +-3, if 9 then +-4, if 11 then +-5 and ect
            pcMoveId += 7;  // max param 7
        } 
        if (pcMoveId > playerMoveId && pcMoveId <= playerMoveId + 3) {
            return 0;  // win
        }
        else {
            return 1; // lose
        }
    }
}

class PcMoveHash {
    constructor() {
        this.Moves = ['Rock', 'Scissors', 'Paper', 'Fire', 'Water', 'Air', 'Sponge'];
    }

    getPcMove() {
        const move = this.Moves[Math.floor(Math.random() * ((gameIndex - 1) - 0 + 1)) + 0]
        const key = crypto.randomBytes(16).toString('HEX');
        const hash = crypto.createHash('SHA256').update(move + key).digest('HEX');
        return {
            pcMove: move, key, hash
        };
    }
}

class Menu {
    display() {
        console.log('Select option:\n 1) Play\n 2) Help\n 3) Add parameter\n 4) Delete parameter\n 0) Exit\n');
    }

    getOption() {
        return new Promise((option) =>
        {
            rl.question('Choose an option: ', (choice) =>
            {
                //rl.close();
                option(choice);
            });
        });
    }
}

(async () => {
    const menu = new Menu();
    const help = new Help();
    const results = new Results();
    const game = new Game(results);

    let a = 0;

    while (a == 0) {
        menu.display();
        const option = await menu.getOption();

        switch (option) {
            case '1':
                //gameRunning = true;
                await game.play();
                //gameRunning = false;
                break;
            case '2':
                help.display();
                //help.updateTable();
                break;
            case '3':
                if (gameIndex < 7) {
                    help.updateTable();
                    gameIndex++;
                }
                else {
                    console.log("\nMax number of parametrs reached\n");
                    break;
                }
                break;
            case '4':
                if (gameIndex > 3) {
                    gameIndex--;
                    help.cleaningTable();
                }
                else {
                    console.log("\nMin number of parametrs reached\n");
                    break;
                }
                break;
            case '0':
                console.log("Goodbye!\n");
                a = 1;
                //process.exit(1);
                break;
            default:
                console.log("Unknown option\n");
                break;
        }

    }
    rl.close();
    process.exit(0);
})();

