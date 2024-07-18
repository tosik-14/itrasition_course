// version 3

const readline = require('readline');
const crypto = require('crypto');  
const Table = require('cli-table');
//const { table } = require('console');
//const { upgrade } = require('c:/users/tosik-asus/appdata/local/microsoft/typescript/5.2/node_modules/undici-types/api');



let gameIndex = 3;


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


class Help {
    constructor(array) {
        this.arr = array;
        this.colWidths = [15];
        this.resultCl = new Results(this.arr);
        this.game = new Game(this.arr)
        this.newTable();
    }

    newTable() {
        this.table = new Table({
            colWidths: this.colWidths
        });
        for (let i = 1; i < 3; i++) {
            this.updateTable();
        }
    }

    updateTable() {

        if (this.table.length < 1) {
            const buff = [this.arr[this.table.length]];
            this.table.push(buff);
            const newItem = this.arr[this.table.length];
            this.colWidths.push(10);
            this.table[0].push(newItem);
            const buf = [this.arr[this.table.length]];
            this.table.push(buf);
            for (let i = 1; i < this.table.length; i++) {  // add first item
                const user = this.table[i][0];
                const result = this.resultCl.result(this.game.getMoveId(newItem), this.game.getMoveId(user));
                this.table[i].push(this.getResultText(result));
            }
        }
        
        const newItem = this.arr[this.table.length];
        this.colWidths.push(10);

        this.table[0].push(newItem);


        for (let i = 1; i < this.table.length; i++) {  // add column
            const user = this.table[i][0];
            const result = this.resultCl.result(this.game.getMoveId(newItem), this.game.getMoveId(user));
            this.table[i].push(this.getResultText(result));
        }

        const newRow = [newItem];
        for (let i = 1; i < this.table.length; i++) {    //add row      
            const pc = this.table[0][i];
            const result = this.resultCl.result(this.game.getMoveId(pc), this.game.getMoveId(newItem)); // почему он блять не видит метод result из касса Rusults???
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

    changeTable() {
        this.colWidths = [15];
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
    constructor(arr) {
        this.items = arr;

        this.pcMoveHash = new PcMoveHash(this.items);
        this.gameResults = new Results(this.items);
    }

    async play() {
        //let pcMove; let key; let hash;
        const { pcMove, key, hash } = this.pcMoveHash.getPcMove();

        console.log(`\nComputer move hash: ${hash}\n`);

        const playerChoice = await this.getPlayerMove();
        let playerMove;
        //if (playerMove != 1 || playerMove != 2 || playerMove != 3) { console.Log("Incorrect move, try again"); return; }
        if (playerChoice > gameIndex || playerChoice < 1) {
            console.log("Unknown move, try again\n");
            return;
        }
        playerMove = this.items[playerChoice];
        
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
        //let arr = ['Fire', 'Water', 'Air', 'Sponge'];
        if (gameIndex > 3) {
            for (let i = 3; i < gameIndex; i++) {
                quest += ` ${i+1}) ${this.items[i+1]}\n`;
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
        //let id = 1;
        
        let { N, G } = this.gameResults.calculate();
        N = this.items.length - 1;
        G--;
        let j = 1, b = 1;
        for (let i = 1; i <= N; i++) {
            if (move == this.items[i]) {
                return j;
            }
            j += G;
            if (j > N) {
                b++;
                j = b;
            }
        }
        console.log('return 0;');   // check
        return 0;
        
    }
}

class Results {
    constructor(arr) {
        this.items = arr;
        //this.calculate();
        //this.N = 0;
        //this.G = 0;
    }

    calculate() {
        let N = (this.items.length - 1);
        if (N % 2 == 0) { N++; }
        const G = Math.floor(N / 2);
        const buf = 0;
        return {
            param: buf, N, G     // i have a question, without buf it dont work
        };
    }

    result(playerMoveId, pcMoveId) {
        const { N, G } = this.calculate();
        if (playerMoveId == pcMoveId) { return 2; }  // draw
        if ((playerMoveId + G) > N && (pcMoveId - G) < 1) {   // if max param 7 then +-3, if 9 then +-4, if 11 then +-5 and ect
            pcMoveId += N;  // max param 7
        } 
        if (pcMoveId > playerMoveId && pcMoveId <= playerMoveId + G) {
            return 0;  // win
        }
        else {
            return 1; // lose
        }
    }
}

class PcMoveHash {
    constructor(items) {
        this.moves = items;
    }

    getPcMove() {
        const move = this.moves[Math.floor(Math.random() * (gameIndex - 1 + 1) + 1)]
        const key = crypto.randomBytes(16).toString('HEX');
        const hash = crypto.createHash('SHA256').update(move + key).digest('HEX');
        return {
            pcMove: move, key, hash
        };
    }
}

class Menu {
    display() {
        console.log('Select option:\n 1) Play\n 2) Help\n 3) Add parameter\n 4) Delete parameter\n 5) Add custom parameter\n 0) Exit\n');
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
    addCustomParam() {
        return new Promise((option) => {
            rl.question('Enter new item: ', (choice) => {
                //rl.close();
                option(choice);
            });
        });
    }
}

(async () => {
    const items = ['PC / User', 'Rock', 'Scissors', 'Paper', 'Fire', 'Water', 'Air', 'Sponge'/*, 'car', 'tree'*/];

    const menu = new Menu();
    const help = new Help(items);
    const game = new Game(items);

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
                if (gameIndex < (items.length - 1)) {
                    gameIndex++;
                    help.changeTable();
                }
                else {
                    console.log("\nMax number of parametrs reached\n");
                    break;
                }
                break;
            case '4':
                if (gameIndex > 3) {
                    gameIndex--;
                    help.changeTable();
                }
                else {
                    console.log("\nMin number of parametrs reached\n");
                    break;
                }
                break;
            case '5':
                const newItem = await menu.addCustomParam();
                items.push(newItem);
                //help.updateTable();
                //gameIndex++;
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

