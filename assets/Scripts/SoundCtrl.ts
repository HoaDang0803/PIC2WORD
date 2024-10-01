import { _decorator, Button, Component, Node, AudioSource, AudioClip, director } from 'cc';
import { NodeExtension } from './MyExtention/NodeExtension';
const { ccclass, property } = _decorator;

@ccclass('SoundCtrl')
export class SoundCtrl extends NodeExtension {
    public static instance: SoundCtrl;
    public static CURRENRT_STATUS_SOUND: string = "statusSound";
    isMute: boolean;
    @property(Node)
    settingBg: Node;
    @property(Node)
    settingPopUp: Node;
    @property(Node)
    on: Node;
    @property(Node)
    off: Node;
    @property(AudioSource)
    sounds: AudioSource;
    @property(AudioClip)
    incorrect: AudioClip;
    @property(AudioClip)
    correct: AudioClip;
    @property(AudioClip)
    click: AudioClip;
    @property(AudioClip)
    lvComplete: AudioClip;
    @property(AudioClip)
    coinPlus: AudioClip;
    @property(AudioClip)
    useCoin: AudioClip;

    start() {
        if (SoundCtrl.instance == null) {
            SoundCtrl.instance = this;
            director.addPersistRootNode(this.node);
        }
        else {
            this.destroy();
        }
        this.PlaySound();
    }

    OpenSettingPanel() {
        this.ClickSound();
        this.settingBg.active = true;
        this.settingPopUp.active = true;
        this.DoFade(this.settingBg, 0.75, 0.1);
        this.DoScaleTo(this.settingPopUp, 1, 0.15);
    }

    CloseSettingPanel() {
        this.ClickSound();
        this.DoFade(this.settingBg, 0, 0.2);
        this.DoScaleTo(this.settingPopUp, 0, 0.2).then(() => {
            this.settingBg.active = false;
            this.settingPopUp.active = false;
        });
    }

    PlaySound() {
        this.isMute = this.GetStatusSound();
        if (this.isMute == false) {
            this.sounds.play();
            this.on.active = true;
            this.off.active=false;
        } else {
            this.on.active = false;
            this.off.active=true;
            this.sounds.stop();
        }
    }
    StatusSound() {
        this.ClickSound();
        this.on.active = !this.on.active;
        this.off.active = !this.off.active;
        this.isMute = !this.isMute;
        
        if (this.isMute == false) {
            this.sounds.play();
        } else {
            this.sounds.stop();
        }
        this.SetStatusSound(this.isMute.toString());
    }

    IncorrectSound() {
        if (this.isMute == false) {
            this.sounds.playOneShot(this.incorrect, 10);
        } else {
            return;
         }
    }

    CorrectSound() {
        if (this.isMute == false) {
            this.sounds.playOneShot(this.correct, 10);
        } else {
            return;
        }
    }

    ClickSound() {
        if (this.isMute == false) {
            this.sounds.playOneShot(this.click, 10);
        } else {
            return;
        }
    }

    LvCompleteSound() {
        if (this.isMute == false) {
            this.sounds.playOneShot(this.lvComplete, 10);
        } else {
            return;
        }
    }

    CoinPlusSound() {
        if (this.isMute == false) {
            this.sounds.playOneShot(this.coinPlus, 10);
        } else {
            return;
        }
    }

    UseCoinSound() {
        if (this.isMute == false) {
            this.sounds.playOneShot(this.useCoin, 10);
        } else {
            return;
        }
    }

    GetStatusSound() {
        var soundStr = (localStorage.getItem(SoundCtrl.CURRENRT_STATUS_SOUND));
        if (soundStr == null || soundStr == '' || soundStr == 'false') {
            return false;
        } else {
            return true;
        }
    }

    SetStatusSound(currentStatus: string) {
        localStorage.setItem(SoundCtrl.CURRENRT_STATUS_SOUND, currentStatus);
    }
}


