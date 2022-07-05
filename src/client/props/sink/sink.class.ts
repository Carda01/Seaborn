import Phaser from 'phaser-ce';
export class Sink{
    private sinkink: Phaser.Sprite;
    constructor(gameInstance, projectile){
        this.sinkink = gameInstance.add.sprite(64, 64, 'sink');
        //add animation of sinking
        this.sinkink.reset(projectile.body.x - 20, projectile.body.y - 30);
        //play animation

        setTimeout(() => {
            this.sinkink.kill();
        }, 500);
    }
}