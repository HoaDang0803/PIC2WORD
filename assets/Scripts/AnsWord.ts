import { _decorator, Component, easing, Label, Node } from 'cc';
import { GameplayCtr } from './GameplayCtr';
import { NodeExtension } from './MyExtention/NodeExtension';
const { ccclass, property } = _decorator;

@ccclass('AnsWord')
export class AnsWord extends NodeExtension {
    @property(Label)
    wordText: Label

    @property(Number)
    id: number = 0;

    charValue: CharacterData;

    SetChar(value: CharacterData) {
        this.wordText.string = value + '';
        this.charValue = value;
    }

    WordReset() {
        this.DoScaleTo(this.node, 1.3, 0.1, easing.backOut).then(() => {
            this.node.setScale(1, 1, 1);
            GameplayCtr.instance.AnswerBack(this);
        });
        
    }
}

