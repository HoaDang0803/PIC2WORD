import { _decorator, Component, easing, Label, Node } from 'cc';
import { GameplayCtr } from './GameplayCtr';
import { NodeExtension } from './MyExtention/NodeExtension';
const { ccclass, property } = _decorator;

@ccclass('OptWord')
export class OptWord extends NodeExtension {
    @property(Label)
    wordText: Label

    @property(Number)
    id: number = 0;

    charValue: CharacterData;

    SetChar(value: CharacterData) {
        this.wordText.string = value + '';
        this.charValue = value;
    }

    WordSelected() {
        this.DoScaleTo(this.node, 1.3, 0.15, easing.backOut).then(() => {
            this.node.setScale(1,1,1);
            GameplayCtr.instance.SelectedOption(this);
        });
        GameplayCtr.instance.isClick = false;
    }
}

