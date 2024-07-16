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

        this.colWidths = [15, 15, 15, 15];
        this.newTable();
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

    display() {
        console.log(this.table.toString());
    }



    updateColumnWidth(widths) {
        this.colWidths = widths;
        this.newTable();
    }
    addRow(row) {
        this.table.push(row);
    }
    addColumn(column) {
        for (let i = 0; i < this.table.length; i++) {
            this.table[i].push(column[i]);
        }
    }

    addFire() {
        //this.updateColumnWidth([15, 15, 15, 15, 15]);
        this.addRow(['Fire', 'Win', 'Lose', 'Lose']);
        this.addColumn(['Fire', 'Lose', 'Win', 'Win', 'Draw']);
    }

    addWater() {
        //this.updateColumnWidth([15, 15, 15, 15, 15, 15]);
        this.addFire();
        this.addRow(['Water', 'Lose', 'Lose', 'Win', 'Lose']);
        this.addColumn(['Water', 'Win', 'Win', 'Lose', 'Win', 'Draw']);
    }
    addAir() {
        //this.addFire();
        this.addWater();
        //this.updateColumnWidth([15, 10, 10, 10, 10, 10, 10]);
        this.addRow(['Air', 'Lose', 'Win', 'Win', 'Lose', 'Lose']);
        this.addColumn(['Air', 'Win', 'Lose', 'Lose', 'Win', 'Win', 'Draw']);
    }
    addSponge() {
        //this.addFire();
        //this.addWater();
        this.addAir();
        //this.updateColumnWidth([15, 10, 10, 10, 10, 10, 10, 10]);
        this.addRow(['Sponge', 'Win', 'Win', 'Lose', 'Win', 'Lose', 'Lose']);
        this.addColumn(['Sponge', 'Lose', 'Lose', 'Win', 'Lose', 'Win', 'Win', 'Draw']);
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
        const result = this.gameResults.result(playerMove, pcMove);
        console.log(`${result}\n`);
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
}

class Results {
    constructor() {
        this.createStruct();
        
    }
    createStruct() {
        this.resultStruct = {
            Rock: { win: ['Scissors'] },
            Scissors: { win: ['Paper'] },
            Paper: { win: ['Rock'] }
        };
    }

    updateStruct(newParam, winList, loseList) {
        this.resultStruct[newParam] = { win: winList };

        for (let i in this.resultStruct) {
            if (loseList.includes(i)) {
                this.resultStruct[i].win.push(newParam);
            }
        }

        /*for (let i = 0; i < this.resultStruct.length; i++) {
            if (loseList.includes(this.resultStruct[i])) {
                this.resultStruct[i].win.push(newParam);
            }
        }*/
    }

    result(playerMove, pcMove) {
        if (playerMove == pcMove) { return "It's draw!"; }
        else if (this.resultStruct[playerMove].win.includes(pcMove)) {
            return "You win!";
        }
        else {
            return "You lose!";
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
                break;
            case '3':
                if (gameIndex == 7) {
                    console.log("\nMax number of parametrs reached\n");
                    break;
                }
                if (gameIndex == 3) {
                    /*help.updateColumnWidth([15, 15, 15, 15, 15]);
                    help.addRow(['Fire', 'Win', 'Lose', 'Lose']);
                    help.addColumn(['Fire', 'Lose', 'Win', 'Win', 'Draw']);*/
                    help.updateColumnWidth([15, 15, 15, 15, 15]);
                    help.addFire();

                    results.updateStruct('Fire', ['Scissors', 'Paper'], ['Rock']);
                    gameIndex++;
                } else if (gameIndex == 4) {
                    help.updateColumnWidth([15, 15, 15, 15, 15, 15]);
                    help.addWater();

                    results.updateStruct('Water', ['Rock', 'Scissors', 'Fire'], ['Paper']);
                    gameIndex++;
                } else if (gameIndex == 5) {
                    help.updateColumnWidth([15, 10, 10, 10, 10, 10, 10]);
                    help.addAir();

                    results.updateStruct('Air', ['Rock', 'Fire', 'Water'], ['Scissors', 'Paper']);
                    gameIndex++;
                } else if (gameIndex == 6) {
                    help.updateColumnWidth([15, 10, 10, 10, 10, 10, 10, 10]);
                    help.addSponge();

                    results.updateStruct('Sponge', ['Paper', 'Water', 'Air'], ['Rock', 'Scissors', 'Fire']);
                    gameIndex++;
                }
                break;
            case '4':
                if (gameIndex == 3) {
                    console.log("\nMin number of parametrs reached\n");
                    break;
                }
                if (gameIndex == 4) {
                    help.updateColumnWidth([15, 15, 15, 15]);

                    results.createStruct();
                    gameIndex--;
                } else if (gameIndex == 5) {
                    help.updateColumnWidth([15, 15, 15, 15, 15]);
                    help.addFire();

                    results.createStruct();
                    results.updateStruct('Fire', ['Scissors', 'Paper'], ['Rock']);
                    gameIndex--;
                } else if (gameIndex == 6) {
                    help.updateColumnWidth([15, 15, 15, 15, 15, 15]);
                    help.addWater();

                    results.createStruct();
                    results.updateStruct('Fire', ['Scissors', 'Paper'], ['Rock']);
                    results.updateStruct('Water', ['Rock', 'Scissors', 'Fire'], ['Paper']);
                    gameIndex--;
                } else if (gameIndex == 7) {
                    help.updateColumnWidth([15, 10, 10, 10, 10, 10, 10]);
                    help.addAir();

                    results.createStruct();
                    results.updateStruct('Fire', ['Scissors', 'Paper'], ['Rock']);
                    results.updateStruct('Water', ['Rock', 'Scissors', 'Fire'], ['Paper']);
                    results.updateStruct('Air', ['Rock', 'Fire', 'Water'], ['Scissors', 'Paper']);
                    gameIndex--;
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

/*const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function selectOption(menu) {
    if (gameRunning == false) {
        return new Promise(result => rl.question(menu, result));
    }
}

async function main() {
    const help = new Help();
    const game = new Game();

    let a = 0;

    while (a == 0) {
        *//*if (gameRunning == false) {

        }*//*
        const option = await selectOption('\nSelect option:\n 1) Play\n 2) Help\n 0) Exit\n'); 
        if (option.length == 0) {
            //console.log("empty request, try again\n");
            option = 'fdf'; 
        }
        switch (option) {
            case '1':
                gameRunning = true;
                await game.play();
                //gameRunning = false;
                break;
            case '2':
                help.display();
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
    process.exit(1);
}

main();*/