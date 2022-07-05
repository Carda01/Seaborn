import {Player} from '../actors/player/player.class';
import {GameEvent, PlayerEvent} from "../../shared/events.model";
import {LoginScene} from "../scenes/login.class";
import {Loots} from "../loot/loot.class";
import {GameOverScene} from "../scenes/gameover";
import {io} from "socket.io-client";
import {windowSize} from "../../consts/enums";
import {JSONObject} from "../../shared/models";
import game = PIXI.game;
let timeUpdate = 0;
declare const window: any;

export class Game {
    public login: LoginScene;
    private actors: Array<Player>;
    private actor: Player;
    private loots: Loots;
    private borderLayer: Phaser.TilemapLayer;
    private portLayer1: Phaser.TilemapLayer;
    private portLayer2: Phaser.TilemapLayer;
    private portLayer3: Phaser.TilemapLayer;

    constructor() {
        window.socket = io();
        this.login = new LoginScene(localStorage.getItem('Username'));
    }

    protected manageAssets(game): void {
        this.actors = [];
        this.loots = new Loots(game);
        window.socket.on(PlayerEvent.joined, (player) => {
            this.actors.push(new Player(game, player));
        });
        window.socket.on(PlayerEvent.protagonist, (player) => {
            this.actor = new Player(game, player);
            this.actors.push(this.actor);
        });

        window.socket.on(PlayerEvent.players, (players) => {
            players.map((player: any) => {
                const enemy = new Player(game, player);
                this.actors.push(enemy);
            });
        });
        window.socket.on(PlayerEvent.quit, (playerId) => {
            this.actors.filter(actor => actor.player.id === playerId).map(actor => {
                actor.player.body.sprite.destroy()
                actor.player.destroy();
            });
            this.actors = this.actors.filter(actor => actor.player.id !== playerId);
        });
        window.socket.on(GameEvent.drop, (data) => {
            this.loots.addLoot(data.idLoot, data.coors);
        });
        window.socket.on(PlayerEvent.killed, (enemy) => {
            this.actors.filter(actor => actor.player.id === enemy).map(actor => {
                actor.player.body.sprite.destroy();
                actor.player.destroy();
            });
            this.actors = this.actors.filter(actor => actor.player.id !== enemy);
	    window.location.reload()
        });
        window.socket.on(PlayerEvent.hit, (data) => {
            this.actors.filter(actor => actor.player.id === data.enemy).map(actor => {
                actor.player.health -= data.damage;
                game.camera.shake(0.01, 100);
            });
            this.actors.forEach(actor => {
                if (actor.player.id === data.enemy)
                    actor.player.health -= data.damage;
            });
            this.actor.player.health -= data.damage;
        });
        window.socket.on(PlayerEvent.pickup, (data) => {
            this.actors.filter(actor => actor.player.id === data.idPlayer).map(actor => actor.assignPickup(this.loots.getItemByID(data.idLoot)));

            this.loots.removeByID(data.idLoot)
        });

        window.socket.on(PlayerEvent.coordinates, (player) => {
            this.actors.filter((actor: Player) => {
                if (actor.player.id === player.player.id) {
                    actor.player.x = player.coors.x;
                    actor.player.y = player.coors.y;
                    actor.player.rotation = player.coors.r;
                    if (player.coors.f) {
                        actor.cannons.fire();
                    }
                    if (player.coors.m) {
                        //actor.player.animations.play('accelerating');
                    }
                }
            });
        });
    }

    protected gameUpdate(game): void {
        if (this.actor && this.actor.controls) {
            game.physics.arcade.collide(this.actor.player, this.borderLayer);
            game.physics.arcade.collide(this.actor.player, this.portLayer1);
            game.physics.arcade.collide(this.actor.player, this.portLayer2);
            game.physics.arcade.collide(this.actor.player, this.portLayer3);

            this.actor.view();

            window.socket.emit(PlayerEvent.coordinates, {
                x: this.actor.player.position.x,
                y: this.actor.player.position.y,
                r: this.actor.player.rotation,
                f: this.actor.playerState.get('fire'),
                m: this.actor.playerState.get('moving'),
                a: this.actor.playerState.get('ammo'),
            });

            game.physics.arcade.collide(this.actor.player, this.actors.map(actor => actor.player));
            game.physics.arcade.collide(this.actors.map((actor) => actor.player), this.actor.cannons.weapon.bullets,
                (enemy, projectile) => {
                    if (enemy.id !== this.actor.player.id) {
                        projectile.kill();
                        let entity = this.actors.filter((actor) => actor.player.id === enemy.id)[0];
                        enemy.health -= this.actor.cannons.damage;
                        window.socket.emit(PlayerEvent.hit, {enemy: enemy.id, damage: this.actor.cannons.damage});
                        if (enemy.health <= 0) {
                            enemy.kill();
                            window.socket.emit(PlayerEvent.killed, enemy.id);
                        }
                    }
                }
            );
            game.physics.arcade.collide(this.actor.cannons.weapon.bullets, this.borderLayer, (projectile, border) => {
                projectile.kill();
            });

            if (this.loots) {
                game.physics.arcade.overlap(
                    this.loots.getLoots().map((loot) => loot.item),
                    this.actors.map((actor) => actor.player),
                    (pickup, actor) => {
                        if (actor === this.actor.player) {
                            window.socket.emit(PlayerEvent.pickup, {
                                idLoot: pickup.name,
                                idPlayer: actor.id,
                            });
                        }

                    });
            }
            timeUpdate++;
            if(timeUpdate % 10 == 0){
                this.actor.saveProgress();
            }
        }
    }

    protected properties(game): void {
        game.world.setBounds(0, 0, 6400, 6400);
        game.stage.disableVisibilityChange = true;
        game.time.desiredFps = 60;
        game.renderer.clearBeforeRender = false;
        game.physics.startSystem(Phaser.Physics.ARCADE);
        let map = game.add.tilemap('map');
        map.addTilesetImage('ocean', 'tiles1')
        map.addTilesetImage('Rocks', 'tiles2', 32, 32, 0, 0, 1);
        map.addTilesetImage('RockIsland_land', 'tiles3');
        map.addTilesetImage('Desert_island', 'tiles4')
        this.portLayer1 = map.createLayer('port1');
        this.portLayer2 = map.createLayer('port2');
        this.portLayer3 = map.createLayer('port3');
        this.borderLayer = map.createLayer('borders');
        let ocean = map.createLayer('ocean');
        map.createLayer('rocks');
        if (true) {
            map.setCollisionByExclusion([], true, this.borderLayer);
            map.setCollisionByExclusion([], true, this.portLayer1);
            map.setCollisionByExclusion([], true, this.portLayer2);
            map.setCollisionByExclusion([], true, this.portLayer3);
        }

    }

    protected gameRender(game) {
        if (this.actor) {
            //     let p = new Phaser.Point(this.actor.player.x, this.actor.player.y);
            //     game.debug.text((`X = ${Math.round(this.actor.player.x)}, Y = ${Math.round(this.actor.player.y)}`) , windowSize.WIDTH - 200, 30, 'rgb(255,255,255)');
            //     game.context.strokeSyle = 'rgb(0,255,255)';
            //     game.context.fillStyle = 'rgb(255,255,0)';
            //     game.context.fillRect(p.x, p.y, 4, 4);
        }
    }

}
