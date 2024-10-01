import { _decorator, Component, Node } from 'cc';
import { NodeExtension } from './MyExtention/NodeExtension';
import { SoundCtrl } from './SoundCtrl';
const { ccclass, property } = _decorator;

@ccclass('ScaleImgCtrl')
export class ScaleImgCtrl extends NodeExtension {
    // Biến cờ để theo dõi trạng thái phóng to/thu nhỏ
    private isScaledUp: boolean = false;
    @property(Node)
    otherImg: Node;
    @property(Node)
    bgPanel: Node;
    @property(Number)
    xBack: number = 0;

    start() {
        this.node.on('click', this.ToggleImageScale, this);
    }

    // Hàm để chuyển đổi giữa phóng to và thu nhỏ
    ToggleImageScale() {
        if (this.isScaledUp) {
            this.BackImage();
        } else {
            this.ScaleImage();
        }
        this.isScaledUp = !this.isScaledUp;
    }

    ScaleImage() {
        SoundCtrl.instance.ClickSound();
        this.bgPanel.active = true;
        this.DoMoveXNodeTo(this.node, 0, 0.1); 
        this.DoScaleTo(this.node, 2, 0.1)
        this.otherImg.active = false;
    }

    BackImage() {
        SoundCtrl.instance.ClickSound();
        this.bgPanel.active = false;
        this.DoMoveXNodeTo(this.node, this.xBack, 0.1);
        this.DoScaleTo(this.node, 1, 0.1)
        this.otherImg.active = true;
    }

    BackImageForPnl() {
        SoundCtrl.instance.ClickSound();
        this.bgPanel.active = false;
        this.DoMoveXNodeTo(this.node, this.xBack, 0.1);
        this.DoScaleTo(this.node, 1, 0.1)
        this.otherImg.active = true;
        this.isScaledUp = !this.isScaledUp;
    }
}

