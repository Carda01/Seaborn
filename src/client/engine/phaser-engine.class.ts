import { windowSize } from "../../consts/enums";
import { Game } from "../game/game.class";
import { LifeCycle } from "./lifecycle";

export class Seaborn extends Game implements LifeCycle {
    private game: Phaser.Game;

    constructor() {
        super();
        this.game = new Phaser.Game(windowSize.WIDTH, windowSize.HEIGHT, Phaser.CANVAS, 'seaborn', {
            preload: this.preload,
            create: this.create,
            update: this.update,
            render: this.render,
        });
    }

    public preload(): void {
        const game = this.game.load;
        // No credentials for now, any player is anonymous
        game.crossOrigin = 'anonymous';
        
        //loading all the assets
        game.spritesheet('ship-sprite', 'assets/ship4.png', 97, 64);
        game.image('projectile', 'assets/cannonball2.png');

        game.image('helper', 'assets/graphics/gui/help.png');

        game.tilemap('map', 'assets/new_map/map.json', null, Phaser.Tilemap.TILED_JSON);
        game.image('tiles1', 'assets/new_map/ocean.png');
        game.image('tiles2', 'assets/new_map/Rocks.png');
        game.image('tiles3', 'assets/new_map/RockIsland_land.png');
        game.image('tiles4', 'assets/new_map/Desert_island.png');

        //game.spritesheet('hud_buttons', 'assets/graphics/gui/icons.png', 107, 115);
        
        //interface assets
        game.image('scroll1', 'assets/graphics/gui/scroll1.png');
        game.image('scroll2', 'assets/graphics/gui/scroll2.png');
        game.image('scroll1_small', 'assets/graphics/gui/scroll1_small.png');
        game.image('line1', 'assets/graphics/gui/line1.png');
        game.image('line2', 'assets/graphics/gui/line2.png');

        //hud buttons
        game.image('help', 'assets/graphics/gui/hud_buttons/help.png');
        game.image('left', 'assets/graphics/gui/hud_buttons/left.png');
        game.image('right', 'assets/graphics/gui/hud_buttons/right.png');
        game.image('sound', 'assets/graphics/gui/hud_buttons/sound.png');
        game.image('sound_disabled', 'assets/graphics/gui/hud_buttons/sound_disabled.png');
        game.image('music', 'assets/graphics/gui/hud_buttons/music.png');
        game.image('music_disabled', 'assets/graphics/gui/hud_buttons/music_disabled.png');
        game.image('store', 'assets/graphics/gui/hud_buttons/store.png');
        game.image('store_disabled', 'assets/graphics/gui/hud_buttons/store_disabled.png');
        game.image('exit', 'assets/graphics/gui/hud_buttons/exit.png');
        game.image('settings', 'assets/graphics/gui/hud_buttons/settings.png');
        game.image('profile', 'assets/graphics/gui/hud_buttons/profile.png');

        //buttons
        game.image('button_buy', 'assets/graphics/gui/buttons/button_buy.png');
        game.image('button_sell', 'assets/graphics/gui/buttons/button_sell.png');
        game.image('button_close', 'assets/graphics/gui/buttons/button_close.png');
        game.image('button_details', 'assets/graphics/gui/buttons/button_details.png');
        game.image('button_back', 'assets/graphics/gui/buttons/button_back.png');
        game.image('button_revive', 'assets/graphics/gui/buttons/button_revive.png');
        game.image('button_shop_enabled', 'assets/graphics/gui/buttons/button_shop_enabled.png');
        game.image('button_shop_disabled', 'assets/graphics/gui/buttons/button_shop_disabled.png');
        game.image('button_shipyard_enabled', 'assets/graphics/gui/buttons/button_shipyard_enabled.png');
        game.image('button_shipyard_disabled', 'assets/graphics/gui/buttons/button_shipyard_disabled.png');
        game.image('button_harbor_details', 'assets/graphics/gui/buttons/button_harbor_details.png');
        game.image('button_exit', 'assets/graphics/gui/buttons/button_exit.png');
        game.image('button_modify_enabled', 'assets/graphics/gui/buttons/button_modify_enabled.png');
        game.image('button_modify_disabled', 'assets/graphics/gui/buttons/button_modify_disabled.png');
        game.image('button_buy_ship', 'assets/graphics/gui/buttons/button_buy_ship.png');
        game.image('button_ship_upgrades', 'assets/graphics/gui/buttons/button_ship_upgrades.png');
        game.image('button_upgrade', 'assets/graphics/gui/buttons/button_upgrade.png');
        game.image('button_upgrade_enabled', 'assets/graphics/gui/buttons/button_upgrade_enabled.png');
        game.image('button_upgrade_disabled', 'assets/graphics/gui/buttons/button_upgrade_disabled.png');

        //resources
        game.image('money', 'assets/graphics/resources/money.png');
        game.image('iron', 'assets/graphics/resources/iron.png');
        game.image('stone', 'assets/graphics/resources/stone.png');
        game.image('wood', 'assets/graphics/resources/wood.png');
        game.image('tools', 'assets/graphics/resources/tools.png');
        game.image('fabrics', 'assets/graphics/resources/fabrics.png');

        //ships
        game.image('ship_sloop', 'assets/graphics/ships/ship_sloop.png');
        game.image('ship_sloop_sailed', 'assets/graphics/ships/ship_sloop_sailed.png');
        game.image('ship_galeon', 'assets/graphics/ships/ship_galeon.png');
        game.image('ship_galeon_sailed', 'assets/graphics/ships/ship_galeon_sailed.png');
        
        //loot
        game.image('loot1', 'assets/graphics/loot1.png');
        game.image('loot2', 'assets/graphics/loot2.png');
        game.image('loot3', 'assets/graphics/loot3.png');
        game.image('loot4', 'assets/graphics/loot4.png');
        
        //animations
        game.spritesheet('dust', 'assets/dust.png', 64, 64, 16);
        game.spritesheet('boom', 'assets/boom.png', 128, 128, 64);
    }

    public create(): void {
        super.properties(this.game);
        super.manageAssets(this.game);
    }

    public update(): void {
        super.gameUpdate(this.game);
    }

    public render(): void{
        super.gameRender(this.game);
    }
}