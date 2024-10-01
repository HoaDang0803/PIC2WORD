import { _decorator, Component, Node } from 'cc';
import { NodeExtension } from './MyExtention/NodeExtension';
import { Goods } from './Goods';
import { GameplayCtr } from './GameplayCtr';
import { SoundCtrl } from './SoundCtrl';
const { ccclass, property } = _decorator;

@ccclass('StoreCtrl')
export class StoreCtrl extends NodeExtension {
    public static instance: StoreCtrl;
    @property(Node)
    storePanel: Node;
    @property(Node)
    storePopup: Node;
    @property(Node)
    buySuccess: Node;
    @property(Node)
    coinPls: Goods[] = [];

    start() {
        if (StoreCtrl.instance == null) {
            StoreCtrl.instance = this;
        }
        else {
            this.destroy();
        }
    }

    OpenStorePanel() {
        SoundCtrl.instance.ClickSound();
        this.storePanel.active = true;
        this.storePopup.active = true;
        this.DoFade(this.storePanel, 0.75, 0.1);
        this.DoScaleTo(this.storePopup, 1, 0.15);
    }

    CloseStorePanel() {
        SoundCtrl.instance.ClickSound();
        this.DoFade(this.storePanel, 0, 0.1);
        this.DoScaleTo(this.storePopup, 0, 0.1).then(() => {
            this.storePanel.active = false;
            this.storePopup.active = false;
        });
    }

    async BuySuccess(coinPls: Goods) {
        SoundCtrl.instance.CoinPlusSound();
        this.buySuccess.active = true;
        console.log(coinPls.coin);
        GameplayCtr.instance.SetScore(GameplayCtr.instance.GetCurrentScore() + coinPls.coin);
        GameplayCtr.instance.score.string = GameplayCtr.instance.GetCurrentScore() + '';
        await this.Delay(1000);
        this.buySuccess.active = false;
    }
}

