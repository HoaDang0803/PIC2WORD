import { _decorator, Button, Component, Node, Sprite,EventTarget, random, sp, director, game, Label} from 'cc';
import { DataControler } from './DataControler';
import { ShuffleList } from './ShuffleList';
import { NodeExtension } from './MyExtention/NodeExtension';
import { AnsWord } from './AnsWord';
import { OptWord } from './OptWord';
import { SoundCtrl } from './SoundCtrl';
import { LvComplete } from './LvComplete';

const { ccclass, property } = _decorator;

@ccclass('GameplayCtr')
export class GameplayCtr extends NodeExtension {
    public static instance: GameplayCtr;
    @property(Node)
    answerWord: AnsWord[] = [];
    @property(Node)
    optionWord: OptWord[] = [];
    @property(Node)
    ghostAns: AnsWord[] = [];
    @property(Node)
    ansSimulator: Node[] = [];

    @property(Node)
    imgSprite1: Node;
    @property(Node)
    imgSprite2: Node;
    @property(Node)
    pnlIncorrect: Node;
    @property(Node)
    pnlCorrect: Node;
    @property(Button)
    clearBtn: Button;
    @property(Node)
    hintPopUp: Node;
    @property(Node)
    hintBg: Node;
    @property(Label)
    ans1: Label;
    @property(Label)
    ans2: Label;
    @property(Label)
    countDel: Label;
    @property(Label)
    score: Label;
    @property(Node)
    winPnl: Node;

    wordAns: AnsWord;
    imgQ1: string;
    imgQ2: string;
    answer: CharacterData;
    isCorrect: boolean = true;
    currentAnswerIndex: number =0;
    char: string = 'QWERTYUIOPASDFGHJKLZXCVBNM';
    public static CURRENRT_LEVEL_KEY: string = "currentLevel";
    public static CURRENRT_SCORE_KEY: string = "currentScore";
    public static HINT_STATE_KEY: string = "hintState";
    charArray: CharacterData[] = [];
    idOptWord: number[] = [];

    isClick: boolean = false;

    start() {
        if (GameplayCtr.instance == null) {
            GameplayCtr.instance = this;
        }
        else {
            this.destroy();
        }
        this.LoadHintState();
        this.SetQuestion();
    }


    CharArray() {
        for (let i = 0; i < this.answer.length; i++) {
            this.charArray[i] = this.answer[i].toUpperCase() as unknown as CharacterData;
        }
        for (let i = 0; i < this.optionWord.length; i++) {
            this.optionWord[i].getComponent(OptWord).node.active = true;
        }

        for (let i = this.answer.length; i < this.optionWord.length; i++) {
            this.charArray[i] = this.char.charAt(Math.floor(Math.random() * this.char.length)) as unknown as CharacterData;
        }
        this.charArray = ShuffleList.shuffleListItems(this.charArray);
    }

    SaveCharArray() {
        localStorage.setItem('charArray', JSON.stringify(this.charArray));
    }

    LoadCharArray() {
        const charArrayStr = localStorage.getItem('charArray');
        if (charArrayStr) {
            this.charArray = JSON.parse(charArrayStr);
        }
    }

    ClearCharArray() {
        localStorage.removeItem('charArray');
        this.charArray = [];
    }

    SetQuestion() {
        this.currentAnswerIndex = 0;
        this.score.string = this.GetCurrentScore().toString();
        this.QuestionData();
        this.countDel.node.active = false;
        this.answerWord[1].getComponent(AnsWord).node.parent.setPosition(((this.answerWord.length - this.answer.length) * 75) / 2, 0, 0);
        this.ghostAns[1].getComponent(AnsWord).node.parent.setPosition(((this.answerWord.length - this.answer.length) * 75) / 2, 0, 0);
        this.ansSimulator[1].parent.setPosition(((this.answerWord.length - this.answer.length) * 75) / 2, 0, 0);

        for (let i = 0; i < this.answerWord.length; i++) {
            this.answerWord[i].getComponent(AnsWord).node.active = false;
            this.ansSimulator[i].active = true;
        }
        for (let i = 0; i < this.answer.length; i++) {
            this.answerWord[i].getComponent(AnsWord).SetChar('_' as unknown as CharacterData);
            this.ghostAns[i].getComponent(AnsWord).SetChar(this.answer[i]);
            if (String(this.answerWord[i].getComponent(AnsWord).charValue).toUpperCase() == '_'.toUpperCase()) {
                this.clearBtn.node.active = false;
            }
        }
        for (let i = this.answer.length; i < this.answerWord.length; i++) {
            this.ansSimulator[i].active = false;
            this.ghostAns[i].getComponent(AnsWord).node.active = false;

        }
        if (!this.charArray || this.charArray.length === 0) {
            this.LoadCharArray();  // Thử tải từ localStorage trước
            if (!this.charArray || this.charArray.length === 0) {
                this.CharArray();  // Khởi tạo nếu không có dữ liệu
                this.SaveCharArray();  // Lưu lại ngay sau khi khởi tạo
            }
        }
        for (let i = 0; i < this.optionWord.length; i++) {
            this.optionWord[i].getComponent(OptWord).SetChar(this.charArray[i]);
            this.optionWord[i].getComponent(OptWord).node.active = true;

            if (this.charArray[i] === null) {
                this.optionWord[i].getComponent(OptWord).node.active = false;
            }
        }
        this.Resume();
    }

    SelectedOption(word: OptWord) {
        SoundCtrl.instance.ClickSound();
        if (!this.isClick) {
            this.isClick = true;

            this.clearBtn.node.active = true;
            if (this.currentAnswerIndex >= this.answer.length) return;
       
            while (this.currentAnswerIndex < this.answer.length &&
                String(this.answerWord[this.currentAnswerIndex].getComponent(AnsWord).charValue)!= '_') {
                this.currentAnswerIndex++;
            }

            this.idOptWord[this.currentAnswerIndex] = word.id;
            console.log(this.idOptWord);
            var asw = this.answerWord[this.currentAnswerIndex].getComponent(AnsWord);
            asw.SetChar(word.charValue);
            asw.node.active = true;
            this.DoScaleTo(asw.node, 1.2, 0.1).then(() => {
                this.DoScaleTo(asw.node, 1, 0.1)
            });
            word.node.active = false;
            this.charArray[word.id-1] = null;       
            this.currentAnswerIndex++;
            this.CheckAnswer();
            console.log(this.charArray);
        }
    }

    async CheckAnswer() {
        let allFilled = true;
        for (let i = 0; i < this.answerWord.length; i++) {
            if (String(this.answerWord[i].getComponent(AnsWord).charValue).toUpperCase() === '_'.toUpperCase()) {
                allFilled = false;
                break;
            }
        }
        // Nếu tất cả đã được điền, kiểm tra tính chính xác
        if (allFilled) {
            this.isCorrect = true;
            for (let i = 0; i < this.answer.length; i++) {
                if (String(this.answerWord[i].getComponent(AnsWord).charValue).toUpperCase() !== String(this.answer[i]).toUpperCase()) {
                    this.isCorrect = false;
                    break;
                }
            }
            if (this.isCorrect) {
                SoundCtrl.instance.CorrectSound();
                console.log("Correct");
                this.pnlCorrect.active = true;
                this.ans1.string = DataControler.instance.gameData.data[this.GetCurrentLevel()].txt1;
                this.ans2.string = DataControler.instance.gameData.data[this.GetCurrentLevel()].txt2;
                await this.Delay(1000);
                SoundCtrl.instance.LvCompleteSound();
                this.winPnl.active = true;

                this.NextQuestion();
                this.score.string = this.SetScore(this.GetCurrentScore() + 20).toString();
            } else {
                this.pnlIncorrect.active = true;
                SoundCtrl.instance.IncorrectSound();
                console.log("Incorrect");
            }
        }
    }

    AnswerBack(wordAns) {
        SoundCtrl.instance.ClickSound();
        this.pnlIncorrect.active = false;
        const wordChar = wordAns.getComponent(AnsWord).charValue;
        if (String(this.answerWord[wordAns.id - 1].getComponent(AnsWord).charValue).toUpperCase() == '_'.toUpperCase()) return;
        if (String(this.answerWord[wordAns.id - 1].getComponent(AnsWord).charValue).toUpperCase() != '_'.toUpperCase()) {
            var opt = this.optionWord[this.idOptWord[wordAns.id - 1] - 1].getComponent(OptWord);
            
            if (opt.node.active && this.charArray[this.idOptWord[wordAns.id - 1] - 1] !== null) {
                const charIndex = this.charArray.indexOf(null);
                console.log(charIndex);
                if (charIndex > -1) {
                    this.charArray[charIndex] = wordChar as unknown as CharacterData;
                }
                this.optionWord[charIndex].getComponent(OptWord).node.active = true;
                this.optionWord[charIndex].getComponent(OptWord).SetChar(wordChar);
            }
            else {
                this.charArray[this.idOptWord[wordAns.id - 1] - 1] = wordChar as unknown as CharacterData;
                opt.node.active = true;
                opt.SetChar(wordChar);
            }
        }        
        this.currentAnswerIndex = 0;
        wordAns.SetChar('_' as unknown as CharacterData);
        wordAns.node.active = false;
        console.log(this.charArray);
    }

    NextQuestion() {
        SoundCtrl.instance.ClickSound();
        this.pnlCorrect.active = false;
        this.ans1.string = "";
        this.ans2.string = "";
        if (this.GetCurrentLevel() < DataControler.instance.gameData.data.length - 1) {
            for (let i = 0; i < this.answer.length; i++) {
                this.ghostAns[i].getComponent(AnsWord).node.active = false;
            }
            for (let i = 0; i < this.optionWord.length; i++) {
                this.optionWord[i].getComponent(OptWord).node.active = true;
            }
            this.ClearCharArray();
            this.ClearHintState();
            this.SetNextLevel();
            this.SetQuestion();
        } else {
            console.log("All questions answered.");
        }
    }

    ResetAnswer() {
        SoundCtrl.instance.ClickSound();
        for (let i = 0; i < this.answer.length; i++) {
            const charValue = this.answerWord[i].getComponent(AnsWord).charValue;
            if (charValue && String(charValue).toUpperCase() == '_'.toUpperCase()) continue;
            if (charValue && String(charValue).toUpperCase() !== '_'.toUpperCase()) {

                if (this.charArray[this.idOptWord[i] - 1] == null) {
                    this.charArray[this.idOptWord[i] - 1] = charValue;
                } else { 
                const charIndex = this.charArray.indexOf(null);
                if (this.charArray[charIndex] == null) {
                    this.charArray[charIndex] = charValue;
                    }
                }
            }
            this.answerWord[i].getComponent(AnsWord).SetChar('_' as unknown as CharacterData);
            if (String(this.answerWord[i].getComponent(AnsWord).charValue).toUpperCase() == '_'.toUpperCase()) {
                this.clearBtn.node.active = false;
            }

        }

        for (let i = 0; i < this.answerWord.length; i++) {
            this.answerWord[i].getComponent(AnsWord).node.active = false;
        }
        for (let i = 0; i < this.optionWord.length; i++)
        {       
            if (this.charArray[i] !== null) {
                this.optionWord[i].getComponent(OptWord).node.active = true;
                this.optionWord[i].getComponent(OptWord).SetChar(this.charArray[i]);
            }
            else if (this.charArray[i] == null) {
                this.optionWord[i].getComponent(OptWord).node.active = false;
            }
        }
        this.currentAnswerIndex = 0;
        this.idOptWord = [];
        this.pnlIncorrect.active = false;
        console.log(this.charArray);
    }

    async QuestionData() {
        this.imgQ1 = DataControler.instance.gameData.data[this.GetCurrentLevel()].img1;
        this.imgQ2 = DataControler.instance.gameData.data[this.GetCurrentLevel()].img2;
        this.answer = DataControler.instance.gameData.data[this.GetCurrentLevel()].answer;

        var spriteFrame1 = await this.loadSpriteFrameFromResources(this.imgQ1);
        var spriteComponent1 = this.imgSprite1.getComponent(Sprite);
        var spriteFrame2 = await this.loadSpriteFrameFromResources(this.imgQ2);
        var spriteComponent2 = this.imgSprite2.getComponent(Sprite);
        spriteComponent1.spriteFrame = spriteFrame1;
        spriteComponent2.spriteFrame = spriteFrame2;

    }

    GetCurrentLevel() {
        var levelStr = (localStorage.getItem(GameplayCtr.CURRENRT_LEVEL_KEY));
        if (levelStr == null || levelStr == "") {
            return 0;
        }
        else {
            return parseInt(levelStr);
        }
    }

    SetNextLevel() {
        let nextLevel = this.GetCurrentLevel() + 1;
        localStorage.setItem(GameplayCtr.CURRENRT_LEVEL_KEY, nextLevel.toString());
    }

    GetCurrentScore() {
        var scoreStr = (localStorage.getItem(GameplayCtr.CURRENRT_SCORE_KEY));
        if (scoreStr == null || scoreStr == "") {
            return 0;
        }
        else {
            return parseInt(scoreStr);
        }
    }

    SetScore(score: number) {
        if (score >= 0) {
            localStorage.setItem(GameplayCtr.CURRENRT_SCORE_KEY, score.toString());
            return score;
        } else {
            localStorage.setItem(GameplayCtr.CURRENRT_SCORE_KEY, this.GetCurrentScore().toString());
            return this.GetCurrentScore();
        }
    }

    SwapWord() {
        SoundCtrl.instance.ClickSound();
        // Tạo một mảng tạm thời chứa các phần tử không phải null
        const nonNullArray = this.charArray.filter(c => c !== null);

        // Trộn mảng tạm thời
        const shuffledNonNullArray = ShuffleList.shuffleListItems(nonNullArray);
        this.charArray = shuffledNonNullArray;
 
        for (let i = 0; i < this.optionWord.length; i++) {
            this.charArray[i] = shuffledNonNullArray[i];
            this.optionWord[i].getComponent(OptWord).SetChar(this.charArray[i]);
            this.optionWord[i].getComponent(OptWord).node.active = true;
            if (i >= nonNullArray.length) {
                this.charArray[i] = null;
                if (this.charArray[i] === null) {
                    this.optionWord[i].getComponent(OptWord).node.active = false;
                }
            }
        }
        this.SaveCharArray();
        console.log(this.charArray);
    }
    //hintControler
    HintPnl() {
        SoundCtrl.instance.ClickSound();
        this.hintBg.active = true;
        this.hintPopUp.active = true;
        this.DoFade(this.hintBg, 0.75, 0.1);
        this.DoScaleTo(this.hintPopUp, 1, 0.15);   
    }

    Delete1Word() {
        SoundCtrl.instance.ClickSound();
        this.ResetAnswer();
        if (this.GetCurrentScore() >= 10 && this.countDel.string != 'MAX') {
            SoundCtrl.instance.UseCoinSound();
            let nonAnswerIndices: number[] = [];
            for (let i = 0; i < this.charArray.length; i++) {
                const charInArray = this.charArray[i] as unknown as string;
                let isInAnswer = false;
                for (let j = 0; j < this.answer.length; j++) {
                    if (this.answer[j] === charInArray) {
                        isInAnswer = true;
                        break;
                    }
                }

                if (!isInAnswer && this.charArray[i] !== null) {
                    nonAnswerIndices.push(i);
                }
            }
            console.log(nonAnswerIndices);
            if (nonAnswerIndices.length > 0) {
                let randomIndex = nonAnswerIndices.shift();
                if (this.charArray[randomIndex] != null) {
                    this.charArray[randomIndex] = null;
                }
                this.optionWord[randomIndex].getComponent(OptWord).node.active = false;
            }
            if (nonAnswerIndices.length == 0) {
                this.countDel.string = 'MAX';
                this.countDel.node.active = true;
            }
            this.score.string = this.SetScore(this.GetCurrentScore() - 10).toString();
            this.SaveCharArray();
        }
        this.Resume();
        console.log(this.charArray);
    }

    Show1Word() {
        SoundCtrl.instance.ClickSound();
        this.ResetAnswer();
        if (this.GetCurrentScore() >= 30) {
            SoundCtrl.instance.UseCoinSound();
            let randomIndex = Math.floor(Math.random() * this.answer.length);
            if (randomIndex >= this.answer.length) return;

            if (!this.ghostAns[randomIndex].getComponent(AnsWord).node.active) {
                this.ghostAns[randomIndex].getComponent(AnsWord).node.active = true;
            } else if (this.ghostAns[randomIndex].getComponent(AnsWord).node.active) {
                this.Show1Word();
            }
            this.score.string = this.SetScore(this.GetCurrentScore() - 30).toString();
            this.SaveHintState();
        }
        this.Resume();
    }

    ShowAns1() {
        SoundCtrl.instance.ClickSound();
        if (this.GetCurrentScore() >= 50 && this.ans1.string == '') {
            SoundCtrl.instance.UseCoinSound();
            this.ans1.string = DataControler.instance.gameData.data[this.GetCurrentLevel()].txt1;
            this.score.string = this.SetScore(this.GetCurrentScore() - 50).toString();
            this.SaveHintState();
        }
        this.Resume();
    }

    ShowAns2() {
        SoundCtrl.instance.ClickSound();
        if (this.GetCurrentScore() >= 50 && this.ans2.string == '') {
            SoundCtrl.instance.UseCoinSound();
            this.ans2.string = DataControler.instance.gameData.data[this.GetCurrentLevel()].txt2;
            this.score.string = this.SetScore(this.GetCurrentScore() - 50).toString();
            this.SaveHintState();
        }
        this.Resume();
    }

    NextLevel() {   
        SoundCtrl.instance.ClickSound();
        if (this.GetCurrentScore() >= 150 && this.GetCurrentLevel() < 150) {
            SoundCtrl.instance.UseCoinSound();
            this.score.string = this.SetScore(this.GetCurrentScore() - 150).toString();
            this.NextQuestion();
        }
        this.Resume();
    }

    Resume() {
        SoundCtrl.instance.ClickSound();
        this.DoFade(this.hintBg, 0, 0.1);
        this.DoScaleTo(this.hintPopUp, 0, 0.1).then(() => {
            this.hintBg.active = false;
            this.hintPopUp.active = false;
        });
    }
    //heets
    Restart() {
        this.ans1.string = "";
        this.ans2.string = "";
        localStorage.setItem(GameplayCtr.CURRENRT_SCORE_KEY, '100');
        this.score.string = '100';
        localStorage.setItem(GameplayCtr.CURRENRT_LEVEL_KEY, '0');
        this.ClearCharArray();
        this.SetQuestion();
    }

    SaveHintState() {
        const ghostAnsState = this.ghostAns.map(ans => ans.getComponent(AnsWord).node.active);
        const deletedOptWordState = this.optionWord.map(opt => !opt.getComponent(OptWord).node.active);
        const hintState = {
            ans1: this.ans1.string,
            ans2: this.ans2.string
        };
        const gameState = {
            ghostAnsState: ghostAnsState,
            deletedOptWordState: deletedOptWordState,
            hintState: hintState
        };
        localStorage.setItem(GameplayCtr.HINT_STATE_KEY, JSON.stringify(gameState));
    }

    LoadHintState() {
        const gameStateStr = localStorage.getItem(GameplayCtr.HINT_STATE_KEY);
        if (gameStateStr) {
            const gameState = JSON.parse(gameStateStr);
            this.ghostAns.forEach((ans, index) => {
                ans.getComponent(AnsWord).node.active = gameState.ghostAnsState[index];
            });

            this.optionWord.forEach((opt, index) => {
                opt.getComponent(OptWord).node.active = !gameState.deletedOptWordState[index];
            });

            this.ans1.string = gameState.hintState.ans1 || '';
            this.ans2.string = gameState.hintState.ans2 || '';
        }
    }

    ClearHintState() {
        localStorage.removeItem(GameplayCtr.HINT_STATE_KEY);
        this.ans1.string = '';
        this.ans2.string = '';
    }

}
