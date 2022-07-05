import {KeyBoardControl} from "../../controls/keyboard.class";
import Phaser, {Weapon} from 'phaser-ce';
import {Hud} from "../../hud/hud.class";
import {Particle} from "../../props/particle/particle.class";
import {Cannons} from "../../props/powers/cannons/cannons.class";
import { Resources } from "../../game/resources.class";
import {Loot} from "../../loot/loot.class";

export interface IPlayer extends Phaser.Sprite {
    id: number;
}

export class Player {
    public player: IPlayer;
    public shipInstance;
    public controls: KeyBoardControl;
    public playerState: Map<string, boolean | number>;
    public angularVelocity: number = 50;
    public hud: Hud;
    public maxSpeed: number = 100;
    public cannons: Cannons;
    public experience: number;
    private particle: Particle;
    public resources;

    //TODO DB queries in constructor
    constructor(private gameInstance: Phaser.Game, public playerInstance: any) {
        let ship;
        $.ajax({
            type: 'POST',
            url: '/getShip',
            context: this,
            data: {id: playerInstance.ship_id},
            success: (function(data){
                this.createPlayer(this.gameInstance, data);
                this.playerState = new Map();
            }),
            error: function(xhr){
                window.alert(xhr);
                window.location.replace('/index');
            }
        });


    }

    public createPlayer(gameInstance, data): void {
        //TODO change vars to DB query
        this.addControls();
        this.resources = new Resources();
        this.player = gameInstance.add.sprite(this.playerInstance.x, this.playerInstance.y, 'ship_sloop_sailed');
        // this.player = gameInstance.add.sprite(1000 + Math.random() * 100, 1000 + Math.random() * 100, 'ship_sloop_sailed');
        this.player.scale.setTo(0.4, 0.4);
        this.player.id = this.playerInstance.id;
        this.player.anchor.setTo(0.35, 0.5);
        this.player.name = this.playerInstance.name;
        this.player.maxHealth = 1500;
        this.player.health = 1000;
        this.experience = 0;

        this.attachPhysics(gameInstance);

        this.hud = new Hud(gameInstance, this.player, this.resources);
        this.hud.setName();
        this.hud.setHud();

        this.cannons = new Cannons(gameInstance, this.player);
        this.particle = new Particle(gameInstance, this.player);

    }

    public assignPickup(loot : Loot): void {
        this.resources.merge(loot.resources);
    }

    public view(): void {
        this.gameInstance.camera.follow(this.player);
        this.controls.update();
        this.hud.updateH(this.player.health);
        this.resources = this.hud.updateResources(this.resources);
    }

    private addControls(): void {
        this.controls = new KeyBoardControl(this.gameInstance, this);
    }

    private attachPhysics(gameInstance): void {
        gameInstance.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.collideWorldBounds = true;
        this.player.body.gravity.y = 0;
        this.player.body.drag.set(80);
        this.player.body.maxVelocity.set(this.maxSpeed);
        this.player.body.immovable = false;
    }

    public saveProgress(): void{
        let features = {
            x: this.player.position.x,
            y: this.player.position.y
        };
        localStorage.setItem(this.player.id.toString(), JSON.stringify(features));
    }

}


