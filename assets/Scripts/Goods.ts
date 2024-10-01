import { _decorator, Component, Node } from 'cc';
import { StoreCtrl } from './StoreCtrl';
const { ccclass, property } = _decorator;

@ccclass('Goods')
export class Goods extends Component {
    @property(Number)
    coin: number = 0;

    Buy() {
        StoreCtrl.instance.BuySuccess(this);
    }
}

