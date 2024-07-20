// version 5

const readline = require('readline');
const crypto = require('crypto');  
const Table = require('cli-table');
//const { table } = require('console');
//const { upgrade } = require('c:/users/tosik-asus/appdata/local/microsoft/typescript/5.2/node_modules/undici-types/api');



let gameIndex = 0;


const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


class Help {
    constructor(array) {
        this.items = array;
        this.colWidths = [15];
        this.resultCl = new Results(this.items);
        this.game = new Game(this.items)
        this.newTable();
    }

    newTable() {
        if (this.items.length < 4) return;
        this.table = new Table({
            colWidths: this.colWidths
        });
        for (let i = 1; i < 3; i++) {
            this.updateTable();
        }
    }

    updateTable() {

        if (this.table.length < 1) {
            const buff = [this.items[this.table.length]];
            this.table.push(buff);
            const newItem = this.items[this.table.length];
            this.colWidths.push(10);
            this.table[0].push(newItem);
            const buf = [this.items[this.table.length]];
            this.table.push(buf);
            for (let i = 1; i < this.table.length; i++) {  // add first item
                const user = this.table[i][0];
                const result = this.resultCl.result(this.game.getMoveId(newItem), this.game.getMoveId(user));
                this.table[i].push(this.getResultText(result));
            }
        }
        
        const newItem = this.items[this.table.length];
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

    async play(playerMove) {
        //let pcMove; let key; let hash;
        const { pcMove, key, hash } = this.pcMoveHash.getPcMove();

        console.log(`\nComputer move hash: ${hash}\n`);
        
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

    getMoveId(move) {
        //let id = 1;
        
        let { N, G } = this.gameResults.calculate();
        N = this.items.length - 1;
        if (G > 2) { G--; }
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

class Menu {                                    //cd E:\itransition_course\task3
    constructor(arr){                           //node task3v5.js rock scissors paper
        this.items = arr;
    }
    display() {
        let quest = 'Select move:\n';
        let i = 0
        for (i; i < gameIndex; i++) {
            quest += ` ${i + 1}) ${this.items[i + 1]}\n`;
        }
        quest += ` ${i + 1}) Help\n`
        quest += ` 0) Exit\n`
        console.log(quest);
    }

    getAnswer(quest) {
        return new Promise((option) =>
        {
            rl.question(`${quest}`/*'Choose an option: '*/, (choice) =>
            {
                //rl.close();
                option(choice);
            });
        });
    }
}

(async () => {
    const items = [];
    
    const help = new Help(items);
    const game = new Game(items);

    const moves = process.argv.slice(2);
    if (moves.length < 3) {
        console.log('Insufficient number of items.');
        process.exit(0);
    }
    gameIndex = moves.length;

    let questOption = 'Choose an option: ';
    let a = 0;

    if (items.length == 0) {
        items.push('PC / User');
        for (let i = 0; i < moves.length; i++){
            items.push(moves[i]);
        }
        if (items.length >= 4) {
            help.changeTable();
        }
    }

    const menu = new Menu(items);

    while (a == 0) {

        menu.display();

        //console.log(`\ncheck gameIndex: ${gameIndex}\n`);
        
        const option = await menu.getAnswer(questOption);

        //console.log(`\ncheck option & items.length: ${option} & ${items.length}\n`)

        if (option == 0){ 
            console.log("Goodbye!\n");
            rl.close();
            process.exit(0);
            }
        else if (option == (items.length)) { help.display(); }
        else if (option <= gameIndex && option >= 1) {
            await game.play(items[option]);
        }
        else{
            console.log("Unknown move, try again\n");
        }   
    }
    rl.close();
    process.exit(0);
})();


/*'PC / User', 'Rock', 'Scissors'/*, 'Paper'/*, 'Fire', 'Water', 'Air', 'Sponge', 'car', 'tree'*/

