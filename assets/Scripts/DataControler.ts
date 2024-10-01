import { _decorator, Component, director, Node } from 'cc';
import { NodeExtension } from './MyExtention/NodeExtension';
import { GameData } from './Model';
const { ccclass, property } = _decorator;

@ccclass('DataControler')
export class DataControler extends NodeExtension {
    public static instance: DataControler;
    gameData: GameData;
    start() {
        if (DataControler.instance == null) {
            DataControler.instance = this;
            director.addPersistRootNode(this.node);
        }
        else {
            this.destroy();
        }
        this.loadData();
    }

    async loadData() {
     
        var jsonData = await this.loadJsonRes("data/database");
        this.gameData = jsonData.json as GameData;
        await this.Delay(1500);
        director.loadScene("Gameplay");
    }
}
