import { director ,_decorator, Collider2D, Color, Component, easing, EPhysics2DDrawFlags, ImageAsset, JsonAsset, loader, log, Node, PhysicsSystem2D, Quat, resources, Sprite, SpriteFrame, Tween, tween, UIOpacity, UIRenderer, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('NodeExtension')
export class NodeExtension extends Component {
    // Các hàm hoặc thuộc tính chung có thể được định nghĩa ở đây.

    async DoScaleTo(targetNode: Node, scaleValue: number, duration: number, easingType: any = easing.linear,token: CancellationToken = null): Promise<void> {
        return new Promise((resolve, reject) => {
            //console.log("XX "+ easingType)
            if(easingType==null){
                easingType = easing.linear;
            }
           // const easingFunc = easing[easingType] || easing.linear; // Sử dụng easeOutCubic nếu không tìm thấy kiểu easing
            // Sử dụng Tween để thay đổi tỷ lệ của nút với kiểu easing
             const _tween = tween(targetNode)
                .to(duration, { scale: new Vec3(scaleValue, scaleValue, 1) }, { easing: easingType })
                .call(() => {
                    if (token?.cancelled) {
                        //reject('Operation cancelled');
                    } else {
                        resolve(); // Gọi resolve() khi hiệu ứng hoàn thành
                    }
                })
                .start();
                const checkCancellation = () => {
                    if (token?.cancelled) {
                        log("CAN TWEEN");
                        _tween.stop();
                      //  reject('Operation cancelled');
                    } else {
                        requestAnimationFrame(checkCancellation);
                    }
                };

                requestAnimationFrame(checkCancellation);
        });
    }
    async DoScaleXTo(targetNode: Node, scaleXValue: number, duration: number, easingType: any = easing.linear): Promise<void> {
        return new Promise((resolve, reject) => {
            //console.log("XX "+ easingType)
           // const easingFunc = easing[easingType] || easing.linear; // Sử dụng easeOutCubic nếu không tìm thấy kiểu easing
            // Sử dụng Tween để thay đổi tỷ lệ của nút với kiểu easing
            const currentScale = targetNode.getScale();
            tween(targetNode)
                .to(duration, { scale: new Vec3(scaleXValue, currentScale.y, 1) }, { easing: easingType })
                .call(() => {
                    resolve(); // Gọi resolve() khi hiệu ứng hoàn thành
                })
                .start();
        });
    }
    async DoScaleYTo(targetNode: Node, scaleYValue: number, duration: number, easingType: any = easing.linear): Promise<void> {
        return new Promise((resolve, reject) => {
            //console.log("XX "+ easingType)
           // const easingFunc = easing[easingType] || easing.linear; // Sử dụng easeOutCubic nếu không tìm thấy kiểu easing
            // Sử dụng Tween để thay đổi tỷ lệ của nút với kiểu easing
            const currentScale = targetNode.getScale();
            tween(targetNode)
                .to(duration, { scale: new Vec3(currentScale.x, scaleYValue, 1) }, { easing: easingType })
                .call(() => {
                    resolve(); // Gọi resolve() khi hiệu ứng hoàn thành
                })
                .start();
        });
    }
    async DoMoveNodeTo(targetNode: Node, targetPosition: Vec3, duration: number, easingType: any = easing.linear): Promise<void> {
        return new Promise((resolve, reject) => {
            // Sử dụng Tween để di chuyển node đến vị trí mới với kiểu easing
            tween(targetNode)
                .to(duration, { position: targetPosition }, { easing: easingType })
                .call(() => {
                    resolve(); // Gọi resolve() khi hiệu ứng hoàn thành
                })
                .start();
        });
    }
    async DoMoveLocalNodeTo(targetNode: Node, targetPosition: Vec3, duration: number, easingType: any = easing.linear): Promise<void> {
        return new Promise((resolve, reject) => {
            // Sử dụng Tween để di chuyển node đến vị trí mới với kiểu easing
            tween(targetNode)
                .to(duration, { worldPosition: targetPosition }, { easing: easingType })
                .call(() => {
                    resolve(); // Gọi resolve() khi hiệu ứng hoàn thành
                })
                .start();
        });
    }
    async DoMoveXNodeTo(targetNode: Node, targetX: number, duration: number, easingType: any = easing.linear): Promise<void> {
        return new Promise<void>((resolve) => {
            // Lấy vị trí hiện tại của node
            const currentPosition = targetNode.position;
            // Sử dụng Tween để di chuyển phần tử 'x' của node đến giá trị 'x' mới với kiểu easing
            tween(targetNode)
                .to(duration, { position: new Vec3(targetX, currentPosition.y, currentPosition.z) }, { easing: easingType })
                .call(() => {
                    resolve(); // Gọi resolve() khi hiệu ứng hoàn thành
                })
                .start();
        });
    }
    async DoMoveYNodeTo(targetNode: Node, targetY: number, duration: number, easingType: any = easing.linear): Promise<void> {
        return new Promise<void>((resolve) => {
            // Lấy vị trí hiện tại của node
            const currentPosition = targetNode.position;
            // Sử dụng Tween để di chuyển phần tử 'x' của node đến giá trị 'x' mới với kiểu easing
            tween(targetNode)
                .to(duration, { position: new Vec3(currentPosition.x, targetY, currentPosition.z) }, { easing: easingType })
                .call(() => {
                    resolve(); // Gọi resolve() khi hiệu ứng hoàn thành
                })
                .start();
        });
    }
    async DoFade(targetNode: Node, fadeValue: number, duration: number,easingType: any = easing.linear): Promise<void> {
        return new Promise<void>((resolve) => {
            const uiOpacity = targetNode.getComponent(UIOpacity);
            if (uiOpacity) {
                const currentOpacity = uiOpacity.opacity;
                const targetOpacity = fadeValue * 255; // Chuyển đổi độ fade từ 0-1 thành 0-255
                // Sử dụng Tween để thay đổi độ opacity của node
                tween(uiOpacity)
                    .to(duration, { opacity: targetOpacity }, { easing: easingType })
                    .call(() => {
                        resolve(); // Gọi resolve() khi hiệu ứng hoàn thành
                    })
                    .start();
            }
        });
    }
    async DoColor(targetNode: Node, targetColor: Color, duration: number, easingType: any = easing.linear, token: CancellationToken = null): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const uiRenderer = targetNode.getComponent(Sprite);
            if (uiRenderer) {
                const currentColor = uiRenderer.color;

                if(easingType==null){
                    easingType = easing.linear
                }
                // Sử dụng Tween để thay đổi màu sắc của node
                const colorTween = tween(currentColor)
                    .to(duration, { targetColor }, { easing: easingType })
                    .call(() => {
                        if (token?.cancelled) {
                            log("CAN TWEEN color");
                           // reject('Operation cancelled');
                        } else {
                            uiRenderer.color = targetColor; // Cập nhật màu sắc của node
                            resolve(); // Gọi resolve() khi hiệu ứng hoàn thành
                        }
                    })
                    .start();

                const checkCancellation = () => {
                    if (token?.cancelled) {
                        colorTween.stop();
                       // reject('Operation cancelled');
                    } else {
                        requestAnimationFrame(checkCancellation);
                    }
                };

                requestAnimationFrame(checkCancellation);
            } else {
                resolve(); // Nếu không có Sprite, hoàn thành ngay lập tức
            }
        });
    }
    async DoRotation(targetNode: Node, targetAngle: number, duration: number,easingType: any = easing.linear): Promise<void> {
        return new Promise<void>((resolve) => {
            const currentRotation = targetNode.rotation;
            const targetRotation = new Quat();
            Quat.fromEuler(targetRotation, 0, 0, targetAngle); // Chuyển đổi góc thành Quat
            // Sử dụng Tween để xoay node đến góc cụ thể
            tween(targetNode)
                .to(duration, { rotation: targetRotation }, { easing: easingType })
                .call(() => {
                    resolve(); // Gọi resolve() khi hiệu ứng hoàn thành
                })
                .start();
        });
    }
    async loadJsonRes(url: string) {
        return new Promise<JsonAsset>((resolve, reject) => {
            resources.load(url, null, (error, asset) => {
                if (error) {
                    reject(error)
                }
                resolve(asset)
            })
        })
    }
    loadSpriteFrameFromResources(spritePath:string) {
        return new Promise<SpriteFrame>((resolve, reject) => {
            resources.load(spritePath, SpriteFrame, (error, asset) => {
                if (error) {
                    reject(error)
                }
                resolve(asset)
            })
        });
    }
    loadAnyFromRes(path:string){
        return new Promise<any>((resolve, reject) => {
            resources.load(path, null, (error, asset) => {
                if (error) {
                    reject(error)
                }
                resolve(asset)
            })
        });
    }
    loadImageAssetFromResources(spritePath:string) {
        return new Promise<ImageAsset>((resolve, reject) => {
            resources.load(spritePath, ImageAsset, (error, asset) => {
                if (error) {
                    reject(error)
                }
                resolve(asset)
            })
        });
    }
    async PhyDoMoveXNodeTo(targetNode: Node, targetX: number, duration: number, easingType: any = easing.linear): Promise<void> {
        return new Promise<void>((resolve) => {
            // Lấy vị trí hiện tại của node
            const currentPosition = targetNode.position;
            // Sử dụng Tween để di chuyển phần tử 'x' của node đến giá trị 'x' mới với kiểu easing
            tween(targetNode)
                .to(duration, { position: new Vec3(targetX, currentPosition.y, currentPosition.z) }, { easing: easingType })
                .call(() => {
                    // Cập nhật vị trí của collider sau khi di chuyển node
                    const collider = targetNode.getComponent(Collider2D);
                    if (collider) {
                        collider.node.position = targetNode.position;
                    }
                    resolve(); // Gọi resolve() khi hiệu ứng hoàn thành
                })
                .start();
        });
    }
    async Delay(time: number): Promise<void> {
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                resolve();
            }, time);
        });
    }
    
    EnablePhysicDeug(){
        PhysicsSystem2D.instance.enable = true;
        PhysicsSystem2D.instance.debugDrawFlags = EPhysics2DDrawFlags.Aabb |
    EPhysics2DDrawFlags.Pair |
    EPhysics2DDrawFlags.CenterOfMass |
    EPhysics2DDrawFlags.Joint |
    EPhysics2DDrawFlags.Shape;
    }
    GetStringEnum<T>(enumType: T, value: any): string | undefined {
        // Lặp qua các thuộc tính của enumType
        for (const key in enumType) {
            // Kiểm tra nếu giá trị của thuộc tính này trùng với giá trị đưa vào
            if ((enumType as any)[key] === value) {
                // Trả về tên của thuộc tính này
                return key;
            }
        }
        // Trả về undefined nếu không tìm thấy
        return undefined;
    }
    random(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
@ccclass('CancellationToken')
export class CancellationToken {
    private isCancelled = false;

    cancel() {
        this.isCancelled = true;
    }

    get cancelled() {
        return this.isCancelled;
    }

    

}