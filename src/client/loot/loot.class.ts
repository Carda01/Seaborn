import { Game, Sprite, Physics } from 'phaser-ce';
import {Resources} from "../game/resources.class";

export class Loots{
    private loots: Array<Loot>;
    private game: Game;

    constructor(game){
        this.loots = [];
        this.game = game;

    }

    getLoots(){
        return this.loots;
    }

    length(){
        const len = this.loots.length
        return len;
    }

    addLoot(id, coordinates){
        this.loots.splice(parseInt(id), 0, new Loot(this.game, id, coordinates));

    }

    getItemByID(id){
        return this.loots[parseInt(id)];
    }

    removeByID(id){
        this.loots[id].item.kill();
        for(let i = 0; i < this.loots.length; i++){
            if (i.toString() == id){
                this.loots.splice(i, 1);
                return;
            }
        }
    }
}


export class Loot{
    public item: Phaser.Sprite;
    public resources: Resources;


    constructor(game : Game, id: string, coors){
        this.item = game.add.sprite(coors.x, coors.y, coors.name);
        this.item.scale.setTo(0.5,0.5);
        this.resources = new Resources(coors.wood, coors.stone, coors.iron, coors.fabrics, coors.tools, coors.money);
        this.item.name = id;
        game.physics.enable(this.item, Physics.ARCADE);
        //this.particle = new Particle(game, this.item);
    }

    randomLoot(){
        let choice = Math.floor(Math.random()*4);
        return `loot${choice + 1}`;
    }
}