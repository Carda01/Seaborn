import {Player} from '../actors/player/player.class';
import {Controls, DisplayUI} from './keyboard.model';
import Phaser from "phaser-ce";
import { Curves } from 'phaser';

export class KeyBoardControl {
    public gameControls: Controls;
    public speed : number = 120;
    private isPressedH: DisplayUI;

    constructor(private gameInstance: Phaser.Game, private playerInstance: Player) {
        const space = Phaser.KeyCode.SPACEBAR;
        const h = Phaser.KeyCode.H;
        this.gameControls = {
            cursors: this.gameInstance.input.keyboard.createCursorKeys(),
            fireWeapon: this.gameInstance.input.keyboard.addKey(space),
            pressH: this.gameInstance.input.keyboard.addKey(h)
        }
    }

    public update(): void {
        if (this.playerInstance.player.alive) {
            this.playerInstance.playerState.set('fire', false);
            const vel = this.playerInstance.angularVelocity;
            const currentSpeed = this.playerInstance.player.body.velocity;
            let speedModificator = 0;
            
/*             // TODO TESTING GEARS VERSION
            let currentGear = 0;
            let gears = [0,0.25,0.5,0.75,1];
            //UP CONTROLS
            if (this.gameControls.cursors.up.isDown && currentGear < 5) {
                currentGear+=1;
            } 
            //DOWN CONTROLS         
            if (this.gameControls.cursors.down.isDown && currentGear > 0) {
                currentGear-=1;
            }
            //SHIP MOVEMENT
            if (currentGear>0) {
                this.gameInstance.physics.arcade.velocityFromRotation(
                    this.playerInstance.player.rotation,
                    this.speed*gears[currentGear],
                    this.playerInstance.player.body.velocity);
                this.playerInstance.playerState.set('moving', true);
                } else {
                //currentGear = 0;
                this.playerInstance.player.body.acceleration.set(0);
                this.playerInstance.playerState.set('moving', false);
            } */

            //UP CONTROLS
            if (this.gameControls.cursors.up.isDown) {
                if (Math.abs(currentSpeed.x) + Math.abs(currentSpeed.y) < this.playerInstance.maxSpeed) {
                    this.gameInstance.physics.arcade.velocityFromRotation(
                        this.playerInstance.player.rotation,
                        this.speed,
                        this.playerInstance.player.body.acceleration);
                    this.playerInstance.playerState.set('moving', true);
                } else {
                    this.gameInstance.physics.arcade.velocityFromRotation(
                        this.playerInstance.player.rotation,
                        this.speed,
                        this.playerInstance.player.body.velocity);
                    this.playerInstance.playerState.set('moving', true);
                }
            } else {
                this.playerInstance.player.body.acceleration.set(0);
                this.playerInstance.playerState.set('moving', false);
            }

            //LEFT CONTROLS
            if (this.gameControls.cursors.left.isDown && (Math.abs(currentSpeed.x)>2 || Math.abs(currentSpeed.y)>2) && Math.abs(this.playerInstance.player.body.angularVelocity)<50) {
                if (Math.abs(currentSpeed.x)>=Math.abs(currentSpeed.y)) {
                    speedModificator = Math.abs(currentSpeed.x)/vel;
                } else {
                    speedModificator = Math.abs(currentSpeed.y)/vel;
                }
                this.playerInstance.player.body.angularAcceleration = -vel*speedModificator*0.4;
            //RIGHT CONTROLS
            } else if (this.gameControls.cursors.right.isDown && (Math.abs(currentSpeed.x)>2 || Math.abs(currentSpeed.y)>2) && Math.abs(this.playerInstance.player.body.angularVelocity)<50) {
                if (Math.abs(currentSpeed.x)>=Math.abs(currentSpeed.y)) {
                    speedModificator = Math.abs(currentSpeed.x)/vel;
                } else {
                    speedModificator = Math.abs(currentSpeed.y)/vel;
                }
                this.playerInstance.player.body.angularAcceleration = vel*speedModificator*0.4;
            } else {
                this.playerInstance.player.body.angularAcceleration = 0;
                if (this.playerInstance.player.body.angularVelocity>5) {
                    this.playerInstance.player.body.angularVelocity-=1.5;
                } else if (this.playerInstance.player.body.angularVelocity<-5){
                    this.playerInstance.player.body.angularVelocity+=1.5;
                } else {
                    this.playerInstance.player.body.angularVelocity=0;
                }
            }
            //DOWN CONTROLS
            if (this.gameControls.cursors.down.isDown && (Math.abs(currentSpeed.x) + Math.abs(currentSpeed.y) < this.playerInstance.maxSpeed*0.05)) {
                if (Math.abs(currentSpeed.x) + Math.abs(currentSpeed.y) < this.playerInstance.maxSpeed*0.1) {
                    this.gameInstance.physics.arcade.velocityFromRotation(
                        this.playerInstance.player.rotation,
                        -this.speed*0.1,
                        this.playerInstance.player.body.acceleration);
                    this.playerInstance.playerState.set('moving', true);
                } else {
                    this.gameInstance.physics.arcade.velocityFromRotation(
                        this.playerInstance.player.rotation,
                        -this.speed*0.1,
                        this.playerInstance.player.body.velocity);
                    this.playerInstance.playerState.set('moving', true);
                }
            }
            //FIRING CONTROLS
            if (this.gameControls.fireWeapon.isDown) {
                this.playerInstance.cannons.fire();
                this.playerInstance.playerState.set('fire', true);
            }
            else{
                this.playerInstance.playerState.set('fire', false);
            }
            //OPEN HELP
            if (this.gameControls.pressH.isDown) {
                //TODO connect to helper   
            }
        }
    }
}
