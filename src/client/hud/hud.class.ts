import {windowSize, colors} from "../../consts/enums"
import {Resources} from "../game/resources.class";

export class Hud {
    private game;
    private player;
    private health: Phaser.Text;
    private name: string;
    private ammo: Phaser.Text;

    //BUTTONS
    private buttonHelper;
    private buttonExit;
    private buttonSettings;
    private buttonStore;
    private buttonProfile;

    //ADDITIONAL
    public helper;
    private sceneName;
    private scroll;
    private scrollBig;
    private scrollSmall;

    //GROUPS
    private exitGroup;
    private settingsGroup;
    private harborMenuGroup;
    private shipyardGroup;
    private storeGroup;
    private profileGroup;
    private details;
    private accountDetailsGroup;
    private leftGroup;
    private hudGroup;

    //RESOURCES
    private resources;
    private leftWood;
    private leftStone;
    private leftIron;
    private leftFabrics;
    private leftTools;
    private leftMoney;

    //HUD RESOURCES
    private leftHudWood;
    private leftHudStone;
    private leftHudIron;
    private leftHudFabrics;
    private leftHudTools;
    private leftHudMoney;

    //RESOURCES STYLE
    private resStyle = {
        font: '22px Arial',
        fill: '#fff'
    };

    //TEXT STYLES
    private redTextStyle = {font: '55px Georgia', fill: colors.RED};
    private blueTextStyle = {font: '30px Georgia', fill: colors.BLUE};
    private brownTextStyle = {font: '30px Georgia', fill: colors.BROWN};

    //SHIP CHILDS TEXT STYLE
    private playerSubNameStyle = {
        font: '30px Arial',
        fill: '#fff'
    };

    constructor(game, player, resources) {
        this.game = game;
        this.player = player;
        this.resources = resources;
    }

    public setName(): void {
        this.name = this.game.add.text(0, 70, this.player.name.substring(0, 6), this.playerSubNameStyle);
        this.player.addChild(this.name);
    }

    public setHud(): void {
        const width = windowSize.WIDTH;
        const minusX = 60;
        const height = windowSize.HEIGHT;

        //TODO change to DB query
        //TEMPORAL VERSION - this.money.setText('0');

        //hud-bar in the lower right of the window
        //TODO EASY simplify, avoid switch case and change it to 'method' parameter
        this.buttonExit = this.setHudButton(width - minusX * 1, height - 40, "exit", "exit");
        this.buttonSettings = this.setHudButton(width - minusX * 2, height - 40, "settings", "settings");
        this.buttonHelper = this.setHudButton(width - minusX * 3, height - 40, "help", "helper");
        this.buttonStore = this.setHudButton(width - minusX * 4, height - 40, "store", "store");
        this.buttonProfile = this.setHudButton(width - minusX * 5, height - 40, "profile", "profile");
    }

    public onHudClick() {
        try {
            if (!this.hudGroup) {
                const resX = 30;
                const intervalResY = 35;
                const style = {font: "bold 32px Arial", fill: "#fff"};
                this.hudGroup = this.game.add.group();

                const mainName = this.game.add.text(windowSize.WIDTH / 2, 50, this.player.name, style);
                mainName.anchor.setTo(0.5, 0.5);
                mainName.setShadow(1, 1, 'rgba(0,0,0,1)');
                mainName.fixedToCamera = true;

                //Resources listed
                this.leftHudMoney = this.setResources(resX, intervalResY * 1, "money", this.resources.money);
                this.leftHudWood = this.setResources(resX, intervalResY * 2, "wood", this.resources.wood.amount);
                this.leftHudStone = this.setResources(resX, intervalResY * 3, "stone", this.resources.stone.amount);
                this.leftHudIron = this.setResources(resX, intervalResY * 4, "iron", this.resources.iron.amount);
                this.leftHudFabrics = this.setResources(resX, intervalResY * 5, "fabrics", this.resources.fabrics.amount);
                this.leftHudTools = this.setResources(resX, intervalResY * 6, "tools", this.resources.tools.amount);

                const healthViewer = this.setHealth();

                this.hudGroup.add(this.leftHudMoney);
                this.hudGroup.add(this.leftHudWood);
                this.hudGroup.add(this.leftHudStone);
                this.hudGroup.add(this.leftHudIron);
                this.hudGroup.add(this.leftHudFabrics);
                this.hudGroup.add(this.leftHudTools);
                this.hudGroup.add(mainName);
                this.hudGroup.add(healthViewer);
            } else {
                this.hudGroup.visible = !this.hudGroup.visible;
            }
        } catch (err) {
            console.log(err);
        }

    }

    public setHudButton(x, y, buttonName: string, method?) {
        try {
            switch (method) {
                case "helper": {
                    const button = this.game.add.button(x, y, buttonName, this.onClickHelper, this);
                    button.anchor.setTo(0.5, 0.5);
                    button.scale.setTo(0.7, 0.7);
                    button.fixedToCamera = true;
                    return button;
                }
                case "profile": {
                    const button = this.game.add.button(x, y, buttonName, this.onClickProfile, this);
                    button.anchor.setTo(0.5, 0.5);
                    button.scale.setTo(0.7, 0.7);
                    button.fixedToCamera = true;
                    return button;
                }
                case "store": {
                    const button = this.game.add.button(x, y, buttonName, this.openHarborMenu, this);
                    button.anchor.setTo(0.5, 0.5);
                    button.scale.setTo(0.7, 0.7);
                    button.fixedToCamera = true;
                    return button;
                }
                case "settings": {
                    const trigger = this.game.add.button(x, y, buttonName, this.onHudClick);
                    trigger.visible = false;
                    const button = this.game.add.button(x, y, buttonName, this.onHudClick, this);
                    button.anchor.setTo(0.5, 0.5);
                    button.scale.setTo(0.7, 0.7);
                    button.fixedToCamera = true;
                    return button;
                }
                case "exit": {
                    const button = this.game.add.button(x, y, buttonName, this.onExit, this);
                    button.anchor.setTo(0.5, 0.5);
                    button.scale.setTo(0.7, 0.7);
                    button.fixedToCamera = true;
                    return button;
                }
                case "hud": {
                    const button = this.game.add.button(x, y, buttonName, this.onHudClick, this);
                    button.anchor.setTo(0.5, 0.5);
                    button.scale.setTo(0.7, 0.7);
                    button.fixedToCamera = true;
                    return button;
                }
                default: {
                    const button = this.game.add.button(x, y, buttonName, this.onClick, this);
                    button.anchor.setTo(0.5, 0.5);
                    button.scale.setTo(0.7, 0.7);
                    button.fixedToCamera = true;
                    return button;
                }
            }
        } catch (err) {
            console.log(err);
        }
    }

    public setResources(x, y, imageName: string, amount) {
        const img = this.game.add.image(x, y, imageName);
        const txt = this.game.add.text(x + 30, y, amount, this.resStyle);

        img.anchor.setTo(0.5, 0.5);
        img.scale.setTo(0.15, 0.15);
        img.fixedToCamera = true;

        txt.setShadow(1, 1, 'rgba(0,0,0,1)');
        txt.anchor.setTo(0, 0.5);
        txt.fixedToCamera = true;
        //txt.setText(amount);
        return txt;
    }

    public onClickHelper(): void {
        try {
            if (!this.helper) {
                this.helper = this.game.add.image(windowSize.WIDTH / 2, windowSize.HEIGHT / 2, "helper");
                this.helper.anchor.setTo(0.5, 0.5);
                this.helper.scale.setTo(1.25, 1.25);
                this.helper.fixedToCamera = true;
            } else {
                this.helper.visible = !this.helper.visible;
            }
        } catch (err) {
            console.log(err);
        }
    }

    public onClickProfile(): void {
        try {
            //test to avoid opening menus, when it the panel has been opened
            try {
                if (this.scroll.visible) {
                    return
                }
            } catch (e) {
            }
            ;

            if (!this.profileGroup) {
                this.addScroll(1.3);
                this.profileGroup = this.game.add.group();
                this.profileGroup.fixedToCamera = true;

                const mainName = this.game.add.text(windowSize.WIDTH / 2, windowSize.HEIGHT / 7, 'Ship', this.redTextStyle);
                mainName.anchor.setTo(0.5, 0.5);

                const line1 = this.game.add.image(windowSize.WIDTH / 2, windowSize.HEIGHT / 7 * 1.3, 'line1');
                line1.scale.setTo(0.5, 0.5);
                line1.anchor.setTo(0.5, 0.5);

                const shipIcon = this.game.add.image(windowSize.WIDTH / 2, windowSize.HEIGHT / 7 * 2.2, 'ship_sloop_sailed');
                shipIcon.scale.setTo(0.8, 0.8);
                shipIcon.anchor.setTo(0.5, 0.5);

                const line2 = this.game.add.image(windowSize.WIDTH / 2, windowSize.HEIGHT / 7 * 4, 'line2');
                line2.scale.setTo(0.3, 0.3);
                line2.anchor.setTo(0.5, 0.5);

                const textLine1 = this.addTextLine('Ship Type', 'Sloop', windowSize.HEIGHT / 8 * 3.8);
                const textLine2 = this.addTextLine('Max Health', this.player.maxHealth, windowSize.HEIGHT / 8 * 4.4);
                const textLine3 = this.addTextLine('Damage', '100', windowSize.HEIGHT / 8 * 5);
                const textLine4 = this.addTextLine('Max Speed', '120', windowSize.HEIGHT / 8 * 5.6);

                const closeButton = this.game.add.button(windowSize.WIDTH / 2 + 30, windowSize.HEIGHT / 7 * 5.8, 'button_close', this.closeProfile, this);
                closeButton.anchor.setTo(0, 0.5);
                closeButton.scale.setTo(0.6, 0.6);

                const detailsButton = this.game.add.button(windowSize.WIDTH / 2 - 30, windowSize.HEIGHT / 7 * 5.8, 'button_details', this.showAccountDetails, this);
                detailsButton.anchor.setTo(1, 0.5);
                detailsButton.scale.setTo(0.6, 0.65);

                //adding to a group 'profileGroup'
                this.profileGroup.add(mainName);
                this.profileGroup.add(shipIcon);
                this.profileGroup.add(closeButton);
                this.profileGroup.add(detailsButton);
                this.profileGroup.add(line1);
                this.profileGroup.add(line2);
                this.profileGroup.add(textLine1);
                this.profileGroup.add(textLine2);
                this.profileGroup.add(textLine3);
                this.profileGroup.add(textLine4);

            } else {
                if (this.details) {
                    if (this.details.visible) {
                        this.details.visible = false;
                    }
                }
                this.profileGroup.visible = !this.profileGroup.visible;
                this.scroll.visible = !this.scroll.visible;
            }
        } catch (err) {
            console.log(err);
        }
    }

    public onClickStore(): void {
        try {
            this.scrollBig.visible = false;
            this.onClick;

        } catch (err) {
            console.log(err);
        }
    }

    public onClick(): void {
        try {
            if (!this.scroll) {
                this.addScroll();
            } else {
                this.scroll.visible = !this.scroll.visible;
            }
        } catch (err) {
            console.log(err);
        }
    }

    public accountDetails() {
        if (!this.accountDetailsGroup) {
            this.accountDetailsGroup = this.game.add.group();
            this.accountDetailsGroup.fixedToCamera = true;

            const mainName = this.game.add.text(windowSize.WIDTH / 2, windowSize.HEIGHT / 7, 'Profile', this.redTextStyle);
            mainName.anchor.setTo(0.5, 0.5);

            //to add shadow use this template
            //mainName.setShadow(1, 1, 'rgba(0,0,0,1)');

            const line1 = this.game.add.image(windowSize.WIDTH / 2, windowSize.HEIGHT / 7 * 1.3, 'line1');
            line1.scale.setTo(0.5, 0.5);
            line1.anchor.setTo(0.5, 0.5);

            const line2 = this.game.add.image(windowSize.WIDTH / 2, windowSize.HEIGHT / 2, 'line2');
            line2.scale.setTo(0.3, 0.4);
            line2.anchor.setTo(0.5, 0.5);

            const closeButton = this.game.add.button(windowSize.WIDTH / 2 + 30, windowSize.HEIGHT / 7 * 5.8, 'button_close', this.closeProfile, this);
            closeButton.anchor.setTo(0, 0.5);
            closeButton.scale.setTo(0.6, 0.6);

            const backButton = this.game.add.button(windowSize.WIDTH / 2 - 30, windowSize.HEIGHT / 7 * 5.8, 'button_back', this.showAccountDetails, this);
            backButton.anchor.setTo(1, 0.5);
            backButton.scale.setTo(0.6, 0.6);

            const textLine1 = this.addTextLine('User Name', this.player.name, windowSize.HEIGHT / 5 * 1.7);
            const textLine2 = this.addTextLine('Experience', '3000', windowSize.HEIGHT / 5 * 2.1);
            const textLine3 = this.addTextLine('Rank', Math.floor(3000 / 1000), windowSize.HEIGHT / 5 * 2.5);
            const textLine4 = this.addTextLine('Email', this.player.name + '@gmail.com', windowSize.HEIGHT / 5 * 2.9);
            const textLine5 = this.addTextLine('Registration Date', '2022-06-04', windowSize.HEIGHT / 5 * 3.3);

            this.accountDetailsGroup.add(mainName);
            this.accountDetailsGroup.add(line1);
            this.accountDetailsGroup.add(line2);
            this.accountDetailsGroup.add(textLine1);
            this.accountDetailsGroup.add(textLine2);
            this.accountDetailsGroup.add(textLine3);
            this.accountDetailsGroup.add(textLine4);
            this.accountDetailsGroup.add(textLine5);
            this.accountDetailsGroup.add(closeButton);
            this.accountDetailsGroup.add(backButton);

            return this.accountDetailsGroup;
        } else {
            this.accountDetailsGroup.visible = !this.accountDetailsGroup.visible;
        }
    }

    public showAccountDetails(): void {
        if (!this.details) {
            this.profileGroup.visible = !this.profileGroup.visible;
            this.details = this.accountDetails();
        } else {
            this.profileGroup.visible = !this.profileGroup.visible;
            this.details.visible = !this.details.visible;
        }
    }

    public closeProfile(): void {
        if (this.details) {
            this.details.visible = false;
        }
        this.profileGroup.visible = false;
        this.scroll.visible = false;
    }

    public addScroll(scrollWidth?, scrollHeight?): void {
        if (!scrollWidth) {
            scrollWidth = 1
        }
        if (!scrollHeight) {
            scrollHeight = 1
        }
        if (!this.scroll) {
            this.scroll = this.game.add.image(windowSize.WIDTH / 2, windowSize.HEIGHT / 2, 'scroll1');
            this.scroll.anchor.setTo(0.5, 0.5);
            this.scroll.scale.setTo(0.4 * scrollHeight, 0.4 * scrollWidth);
            this.scroll.rotation = -1.5708;
            this.scroll.fixedToCamera = true;
        } else {
            this.scroll.visible = true;
        }
    }

    public addBigScroll(scrollWidth?, scrollHeight?): void {
        if (!scrollWidth) {
            scrollWidth = 1
        }
        if (!scrollHeight) {
            scrollHeight = 1
        }
        if (!this.scrollBig) {
            this.scrollBig = this.game.add.image(windowSize.WIDTH * 0.5, windowSize.HEIGHT * 0.475, 'scroll2');
            this.scrollBig.anchor.setTo(0.5, 0.5);
            this.scrollBig.scale.setTo(0.6 * scrollWidth, 0.7 * scrollHeight);
            this.scrollBig.fixedToCamera = true;
        } else {
            this.scrollBig.visible = true;
        }
    }

    public addTextLine(leftText, rightText, height) {
        let text1, text2, n = 0.1;
        const textGroup = this.game.add.group();

        text1 = this.game.add.text(windowSize.WIDTH / 2 - 30, height, leftText, this.brownTextStyle);
        text2 = this.game.add.text(windowSize.WIDTH / 2 + 30, height, rightText, this.blueTextStyle);
        text1.anchor.setTo(1, 0.5);
        text2.anchor.setTo(0, 0.5);

        //Logic to resize the text
        while (text2.width >= 270 && n < 0.5) {
            text2.scale.setTo(1 - n, 1 - n);
            n += 0.1;
        }
        n = 0.1;
        while (text1.width >= 270 && n < 0.5) {
            text2.scale.setTo(1 - n, 1 - n);
            n += 0.1;
        }

        textGroup.add(text1);
        textGroup.add(text2);
        return textGroup;
    }

    public onExit(): void {
        $.ajax({
            type: 'POST',
            url: '/logout',
            success: function (){
                window.location.replace('index.html');
            },
            error: function (xhr) {
                window.alert(JSON.stringify(xhr));
            }
        });
    }

    public openHarborMenu(): void {
        try {
            //unit test to avoid opening menus, when it the panel has been opened
            try {
                if (this.scroll.visible) {
                    return
                }
            } catch (e) {};

            if (!this.harborMenuGroup) {
                this.addBigScroll();
                this.harborMenuGroup = this.game.add.group();
                this.harborMenuGroup.fixedToCamera = true;

                const title = this.game.add.text(windowSize.WIDTH / 2, windowSize.HEIGHT * 0.4, 'West Lislowo', this.redTextStyle);
                title.anchor.setTo(0.5, 0.5);

                const shopButton = this.game.add.button(windowSize.WIDTH / 2 - 20, windowSize.HEIGHT * 0.5, 'button_shop_enabled', this.openStoreMenu, this);
                const shipyardButton = this.game.add.button(windowSize.WIDTH / 2 + 20, windowSize.HEIGHT * 0.5, 'button_shipyard_enabled', this.openShipyardMenu, this);
                const harborDetailsButton = this.game.add.button(windowSize.WIDTH / 2 - 20, windowSize.HEIGHT * 0.6, 'button_harbor_details', this.openHarborDetails, this);
                const closeButton = this.game.add.button(windowSize.WIDTH / 2 + 20, windowSize.HEIGHT * 0.6, 'button_close', this.closeHarborMenu, this);

                //button settings
                shopButton.scale.setTo(0.7, 0.7);
                shopButton.anchor.setTo(1, 0.5);
                shipyardButton.scale.setTo(0.7, 0.7);
                shipyardButton.anchor.setTo(0, 0.5);
                harborDetailsButton.scale.setTo(0.7, 0.7);
                harborDetailsButton.anchor.setTo(1, 0.5);
                closeButton.scale.setTo(0.71, 0.7);
                closeButton.anchor.setTo(0, 0.5);

                this.harborMenuGroup.add(title);
                this.harborMenuGroup.add(shopButton);
                this.harborMenuGroup.add(shipyardButton);
                this.harborMenuGroup.add(harborDetailsButton);
                this.harborMenuGroup.add(closeButton);
            } else {
                this.scrollBig.visible = !this.scrollBig.visible;
                this.harborMenuGroup.visible = !this.harborMenuGroup.visible;
            }
        } catch (err) {
            console.log(err);
        }
    }

    public closeHarborMenu(): void {
        this.harborMenuGroup.visible = false;
        this.scrollBig.visible = false;
    }

    public openHarborDetails(): void {
        //TODO create Harbor Details
        //this.closeHarborMenu();
        //this.addScroll();
    }

    public openStoreMenu(): void {
        try {
            this.closeHarborMenu();
            this.addScroll(1.3);

            if (!this.storeGroup) {
                this.storeGroup = this.game.add.group();

                const mainName = this.game.add.text(windowSize.WIDTH / 2, windowSize.HEIGHT / 7, 'Store', this.redTextStyle);
                mainName.anchor.setTo(0.5, 0.5);

                const line1 = this.game.add.image(windowSize.WIDTH / 2, windowSize.HEIGHT / 7 * 1.3, 'line1');
                line1.scale.setTo(0.5, 0.5);
                line1.anchor.setTo(0.5, 0.5);

                const storeLine1 = this.storeLine(windowSize.HEIGHT * 0.25, this.resources.wood.name, this.resources.wood.price, this.resources.wood.amount);
                const storeLine2 = this.storeLine(windowSize.HEIGHT * 0.35, this.resources.stone.name, this.resources.stone.price, this.resources.stone.amount);
                const storeLine3 = this.storeLine(windowSize.HEIGHT * 0.45, this.resources.iron.name, this.resources.iron.price, this.resources.iron.amount);
                const storeLine4 = this.storeLine(windowSize.HEIGHT * 0.55, this.resources.fabrics.name, this.resources.fabrics.price, this.resources.fabrics.amount);
                const storeLine5 = this.storeLine(windowSize.HEIGHT * 0.65, this.resources.tools.name, this.resources.tools.price, this.resources.tools.amount);

                const moneyIcon = this.game.add.image(windowSize.WIDTH / 2 - 20, windowSize.HEIGHT * 0.75, 'money');
                moneyIcon.scale.setTo(0.25, 0.25);
                moneyIcon.anchor.setTo(1, 0.5);

                this.leftMoney = this.game.add.text(windowSize.WIDTH / 2 - 15, windowSize.HEIGHT * 0.75, this.resources.money, {
                    font: "30px Georgia",
                    fill: colors.BROWN
                });
                this.leftMoney.anchor.setTo(0, 0.5);

                const closeButton = this.game.add.button(windowSize.WIDTH / 2, windowSize.HEIGHT * 0.8, 'button_close', this.closeStoreMenu, this);
                closeButton.scale.setTo(0.6, 0.6);
                closeButton.anchor.setTo(0.5, 0);

                this.storeGroup.add(mainName);
                this.storeGroup.add(line1);
                this.storeGroup.add(storeLine1);
                this.storeGroup.add(storeLine2);
                this.storeGroup.add(storeLine3);
                this.storeGroup.add(storeLine4);
                this.storeGroup.add(storeLine5);
                this.storeGroup.add(moneyIcon);
                this.storeGroup.add(this.leftMoney);
                this.storeGroup.add(closeButton);
                this.storeGroup.fixedToCamera = true;
            } else {
                this.storeGroup.visible = !this.storeGroup.visible;
            }
        } catch (err) {
            console.log(err);
        }
    }

    public closeStoreMenu(): void {
        this.storeGroup.visible = false;
        this.scroll.visible = false;
    }

    public openShipyardMenu(): void {
        //TODO create ShipyardMenu logics
    }

    public storeLine(height: number, res: string, price, amount) {
        //res - stands for resource
        try {
            const storeLine = this.game.add.group();
            const center = windowSize.WIDTH / 2;

            //TODO change to DB queries
            const sellDiscount = 0.1;
            let discountPrice = Math.floor(price * (1 - sellDiscount));

            const resNameStyle = {font: "35px Georgia", fill: colors.BROWN};
            const subStyle = {font: "25px Georgia", fill: colors.BROWN};

            const resImg = this.game.add.image(center - 190, height, res.toLowerCase());
            const resName = this.game.add.text(center - 170, height, res.toUpperCase(), resNameStyle);
            const moneyLeftIcon = this.game.add.image(center + 20, height - 5, 'money');
            const moneyRightIcon = this.game.add.image(center + 110, height - 5, 'money');
            const moneyCountBuy = this.game.add.text(center + 26, height + 5, Math.floor(price), subStyle);
            const moneyCountSell = this.game.add.text(center + 116, height + 5, discountPrice, subStyle);
            const buyButton = this.game.add.button(center + 23, height, 'button_buy', function () {
                this.resTransaction(res, price, 'buy', amount)
            }, this);
            const sellButton = this.game.add.button(center + 113, height, 'button_sell', function () {
                this.resTransaction(res, discountPrice, 'sell', amount)
            }, this);

            switch (res) {
                case "Wood": {
                    this.leftWood = this.game.add.text(center + 180, height, 'LEFT: ' + amount, subStyle);
                    this.leftWood.anchor.setTo(0, 0.5);
                    storeLine.add(this.leftWood);
                    break;
                }
                case "Stone": {
                    this.leftStone = this.game.add.text(center + 180, height, 'LEFT: ' + amount, subStyle);
                    this.leftStone.anchor.setTo(0, 0.5);
                    storeLine.add(this.leftStone);
                    break;
                }
                case "Iron": {
                    this.leftIron = this.game.add.text(center + 180, height, 'LEFT: ' + amount, subStyle);
                    this.leftIron.anchor.setTo(0, 0.5);
                    storeLine.add(this.leftIron);
                    break;
                }
                case "Fabrics": {
                    this.leftFabrics = this.game.add.text(center + 180, height, 'LEFT: ' + amount, subStyle);
                    this.leftFabrics.anchor.setTo(0, 0.5);
                    storeLine.add(this.leftFabrics);
                    break;
                }
                case "Tools": {
                    this.leftTools = this.game.add.text(center + 180, height, 'LEFT: ' + amount, subStyle);
                    this.leftTools.anchor.setTo(0, 0.5);
                    storeLine.add(this.leftTools);
                    break;
                }
            }

            resImg.anchor.setTo(1, 0.5);
            resImg.scale.setTo(0.35, 0.35);
            resName.anchor.setTo(0, 0.5);
            moneyLeftIcon.anchor.setTo(1, 1);
            moneyLeftIcon.scale.setTo(0.15, 0.15);
            moneyRightIcon.anchor.setTo(1, 1);
            moneyRightIcon.scale.setTo(0.15, 0.15);
            moneyCountBuy.anchor.setTo(0, 1);
            moneyCountSell.anchor.setTo(0, 1);
            buyButton.anchor.setTo(0.5, 0);
            buyButton.scale.setTo(0.35, 0.35);
            sellButton.anchor.setTo(0.5, 0);
            sellButton.scale.setTo(0.35, 0.35);

            storeLine.add(resImg);
            storeLine.add(resName);
            storeLine.add(moneyLeftIcon);
            storeLine.add(moneyCountBuy);
            storeLine.add(buyButton);
            storeLine.add(moneyRightIcon);
            storeLine.add(moneyCountSell);
            storeLine.add(sellButton);

            return storeLine;
        } catch (err) {
            console.log(err);
        }
    }

    public updatePrice(money, operation) {
        //TODO connect to the main logic
        //Change price during session
        if (operation === 'buy') {
            money += money * 0.05;
        } else {
            money -= money * 0.02;
        }
    }

    public resTransaction(resName: string, price: number, operation: string, left: number) {
        //TODO separate "if statetments" to add red mark if a player don't have enough money or items
        try {
            switch (resName) {
                case "Wood": {
                    if (operation === "buy" && this.resources.money >= price) {
                        try {
                            this.resources.wood.amount += 1;
                            this.resources.money -= price;
                        } catch (err) {
                            console.log(err);
                        }
                    } else if (operation === "sell" && this.resources.wood.amount > 0) {
                        try {
                            this.resources.wood.amount -= 1;
                            this.resources.money += price;
                        } catch (err) {
                            console.log(err);
                        }
                    }
                    this.leftWood.setText("LEFT: " + this.resources.wood.amount);
                    this.leftHudWood.setText(this.resources.wood.amount);
                    break;
                }
                case "Stone": {
                    if (operation === "buy" && this.resources.money >= price) {
                        try {
                            this.resources.stone.amount += 1;
                            this.resources.money -= price;
                        } catch (err) {
                            console.log(err);
                        }
                    } else if (operation === "sell" && this.resources.stone.amount > 0) {
                        try {
                            this.resources.stone.amount -= 1;
                            this.resources.money += price;
                        } catch (err) {
                            console.log(err);
                        }
                    }
                    this.leftStone.setText("LEFT: " + this.resources.stone.amount);
                    this.leftHudStone.setText(this.resources.stone.amount);
                    break;
                }
                case "Iron": {
                    if (operation === "buy" && this.resources.money >= price) {
                        try {
                            this.resources.iron.amount += 1;
                            this.resources.money -= price;
                        } catch (err) {
                            console.log(err);
                        }
                    } else if (operation === "sell" && this.resources.iron.amount > 0) {
                        try {
                            this.resources.iron.amount -= 1;
                            this.resources.money += price;
                        } catch (err) {
                            console.log(err);
                        }
                    }
                    this.leftIron.setText("LEFT: " + this.resources.iron.amount);
                    this.leftHudIron.setText(this.resources.iron.amount);
                    break;
                }
                case "Fabrics": {
                    if (operation === "buy" && this.resources.money >= price) {
                        try {
                            this.resources.fabrics.amount += 1;
                            this.resources.money -= price;
                        } catch (err) {
                            console.log(err);
                        }
                    } else if (operation === "sell" && this.resources.fabrics.amount > 0) {
                        try {
                            this.resources.fabrics.amount -= 1;
                            this.resources.money += price;
                        } catch (err) {
                            console.log(err);
                        }
                    }
                    this.leftFabrics.setText("LEFT: " + this.resources.fabrics.amount);
                    this.leftHudFabrics.setText(this.resources.fabrics.amount);
                    break;
                }
                case "Tools": {
                    if (operation === "buy" && this.resources.money >= price) {
                        try {
                            this.resources.tools.amount += 1;
                            this.resources.money -= price;
                        } catch (err) {
                            console.log(err);
                        }
                    } else if (operation === "sell" && this.resources.tools.amount > 0) {
                        try {
                            this.resources.tools.amount -= 1;
                            this.resources.money += price;
                        } catch (err) {
                            console.log(err);
                        }
                    }
                    this.leftTools.setText("LEFT: " + this.resources.tools.amount);
                    this.leftHudTools.setText(this.resources.tools.amount);
                    break;
                }
                default: {
                    break;
                }
            }
            this.leftMoney.setText(this.resources.money);
            this.leftHudMoney.setText(this.resources.money);
        } catch (err) {
            console.log(err);
        }
    }

    public updateResources(resources) {
        try {
            this.leftHudWood.setText(resources.wood.amount);
            this.leftHudStone.setText(resources.stone.amount);
            this.leftHudIron.setText(resources.iron.amount);
            this.leftHudFabrics.setText(resources.fabrics.amount);
            this.leftHudTools.setText(resources.tools.amount);
            this.leftHudMoney.setText(resources.money);

            this.leftWood.setText("LEFT: " + resources.wood.amount);
            this.leftStone.setText("LEFT: " + resources.stone.amount);
            this.leftIron.setText("LEFT: " + resources.iron.amount);
            this.leftFabrics.setText("LEFT: " + resources.fabrics.amount);
            this.leftTools.setText("LEFT: " + resources.tools.amount);
            this.leftMoney.setText(resources.money);
        } catch (e) {};
        return this.resources;
    }

    public setHealth() {
        const stringHealth = "Health:   " + this.player.health.toString() + "/" + this.player.maxHealth.toString();
        this.health = this.game.add.text(50, windowSize.HEIGHT - 50, stringHealth, this.resStyle);
        this.health.setShadow(1, 1, 'rgba(0,0,0,1)');
        this.health.fixedToCamera = true;
        //this.player.addChild(this.health);
        return this.health;
    }

    public updateH(health): void {
        try {
            const stringHealth = "Health:   " + health.toString() + "/" + this.player.maxHealth.toString();
            this.health.setText(stringHealth);
        } catch (err) {

        }
    }

    public update(ammo): void {
        this.ammo.setText(ammo ? ammo : '');
    }

    public setAmmo(game, player, weapon): void {
        if (this.ammo) {
            this.ammo.setText('');
        }
        //this.ammo = game.add.text(, weapon.bulletCount, this.playerSubNameStyle);
        //player.addChild(this.ammo);
    }
}
