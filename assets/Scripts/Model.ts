export interface GameData {
    data: Data[]
}

export interface Data {
    id: number;
    img1: string;
    img2: string;
    answer: CharacterData;
    txt1: string;
    txt2: string;
}