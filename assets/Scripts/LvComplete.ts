import { _decorator, Component, Node } from 'cc';
import { AnsWord } from './AnsWord';
import { GameplayCtr } from './GameplayCtr';
import { NodeExtension } from './MyExtention/NodeExtension';
import { SoundCtrl } from './SoundCtrl';
const { ccclass, property } = _decorator;

@ccclass('LvComplete')
export class LvComplete extends NodeExtension {
    @property(Node)
    ansShow: AnsWord[] = [];

    listActive: Node[] = [];

    onEnable() {
        this.UpdateAnsShow();
    }

    UpdateAnsShow() {
        this.listActive = [];

        this.ansShow[1].getComponent(AnsWord).node.parent.setPosition(((this.ansShow.length - GameplayCtr.instance.answer.length) * 75) / 2, 0, 0);
        for (let i = 0; i < GameplayCtr.instance.answer.length; i++) {
            this.ansShow[i].getComponent(AnsWord).node.active = true;
            this.ansShow[i].getComponent(AnsWord).SetChar(GameplayCtr.instance.answer[i]);
            this.listActive.push(this.ansShow[i].getComponent(AnsWord).node);
        }
        this.RunAnimation();
    }

    async RunAnimation() {      
        for (let i = 0; i < this.listActive.length; i++) {
            this.DoScaleXTo(this.listActive[i], 1, 0.2);
            await this.Delay(150);
        }   
    }

    CloseWinPnl() {
        SoundCtrl.instance.ClickSound();
      //  GameplayCtr.instance.winPnl.active = false;

        for (let i = 0; i < this.ansShow.length; i++) {
            this.DoScaleXTo(this.ansShow[i].getComponent(AnsWord).node, 0, 0.1);
            this.ansShow[i].getComponent(AnsWord).node.active = false;
        }   
        this.node.active = false;
    }

}

