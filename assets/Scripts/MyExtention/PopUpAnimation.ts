import { _decorator, Component, Node } from 'cc';
import { NodeExtension } from './NodeExtension';
const { ccclass, property } = _decorator;

@ccclass('PopUpAnimation')
export class PopUpAnimation extends NodeExtension {
    background: Node;
    mainPopup: Node;

    onEnable() {
        this.DoFade(this.background, 0.5, 0.1);
        this.DoScaleTo(this.mainPopup, 1, 0.15);
    }

    ClosePopup() {
        this.DoFade(this.background, 0, 0.1);
        this.DoScaleTo(this.mainPopup, 0, 0.1).then(() => {
            this.background.active = false;
            this.mainPopup.active = false;
        });
    }
}

