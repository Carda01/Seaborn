import {Game, Weapon, Sprite} from "phaser-ce";

export class Cannons {
    public weapon: Weapon;
    public fireRate: number = 900;
    public bulletSpeed: number = 500;
    public bulletCount: number = 50;
    public damage: number = 100;
    private player: Sprite;
    private gameInstance: Game;

    public constructor(gameInstance: Game, player: Sprite) {
        this.gameInstance = gameInstance;
        this.player = player;
        this.weapon = this.gameInstance.add.weapon(this.bulletCount, 'projectile');
        this.weapon.bulletKillDistance = 1000;
        this.weapon.bulletKillType = Phaser.Weapon.KILL_DISTANCE;
        this.weapon.multiFire = true;
        this.weapon.fireRate = this.fireRate;
        this.weapon.trackSprite(this.player);
        this.weapon.bulletSpeed = this.bulletSpeed;
    }

    public fire() {
        let angle = this.player.rotation
        this.weapon.fireAngle = Phaser.ANGLE_UP + this.radToDeg(angle);
        this.weapon.fire();
        this.weapon.fireAngle = Phaser.ANGLE_DOWN + this.radToDeg(angle);
        this.weapon.fire();
    }

    private radToDeg(angle: number): number {
        return angle * 180 / Math.PI;
    }

}
