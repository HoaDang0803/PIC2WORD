import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ShuffleList')
export abstract class ShuffleList extends Component {
    public static shuffleListItems<E>(inputList: E[]): E[] {
        const originalList: E[] = [...inputList]; // Create a shallow copy of the input list
        const randomList: E[] = [];

        const r = Math.random;
        let randomIndex = 0;

        while (originalList.length > 0) {
            randomIndex = Math.floor(r() * originalList.length); // Choose a random index in the list
            randomList.push(originalList[randomIndex]); // Add it to the new, random list
            originalList.splice(randomIndex, 1); // Remove to avoid duplicates
        }

        return randomList; // Return the new random list
    }
}

