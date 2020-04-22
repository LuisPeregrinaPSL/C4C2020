import { CoordRanges, TreeScale } from 'src/app/forest.enum';

export class ForestRenderer {
    private document: Document;
    private scene: any;
    private txt: Element;
    private env: Element;
    private infoBlock: Element;
    private countInfo: Element;
    private treeCount: number = 0;
    private treeLimit: number = 200; //It will reset the landscape every treeLimit
    private backCount: number = 0;
    

    constructor(document?: Document, vector?: any) {
        this.document = document;

        this.scene = this.document.querySelector('a-scene');
        console.log(this.scene);
        this.txt = this.scene.querySelector('#treeNumber');
        this.env = this.scene.querySelector('#env');

        this.infoBlock = this.document.querySelector('#info_block');
        this.countInfo = this.infoBlock.querySelector('#tree_count');

        /*
        console.log('Calling pool');
        console.log(this.scene.components);
        var el = this.scene.components.pool__red.requestEntity();
        el.play();
        this.scene.components.pool__red.returnEntity(el);
        */
        
    }

    public setInitialAmount() {
        console.log('treeCount: ', this.treeCount);
        this.backCount = Math.floor(this.treeCount / this.treeLimit) * this.treeLimit;
        console.log('backCount: ', this.backCount);
        this.env.setAttribute('environment', 'dressingAmount:' + this.backCount);
        var diff = this.treeCount - this.backCount;
        return diff;
    }

    public setTreeCount(count:number, animation: boolean) {
        console.log('Seeting tree count', count);
        //count = 1000;
        var previousCount = this.treeCount;
        console.log('Previous count', previousCount);
        this.treeCount = count;
        var diff: number = this.treeCount - previousCount;
        console.log('first diff: ', diff);
        if(this.treeCount > 0 && previousCount == 0) {
            diff = this.setInitialAmount();
            console.log('setInitialAmount: ', diff);
        }
        console.log('diff: ', diff);
        if(diff > 0){
            if((this.treeCount - this.backCount) > this.treeLimit) {
                this.resetLandscape();
                diff = this.treeCount - this.backCount;
                console.log('new diff', diff);
                //this.treeCount = diff;
            }

            this.addNewTrees(diff, animation);
            //this.txt.setAttribute('value', 'You have ' + this.treeCount + ' trees');
            this.countInfo.innerHTML='You have ' + this.treeCount + ' trees';
        }
    }

    private addNewTrees(diff: number, animation: boolean) {
        console.log('Adding ' + diff + ' new trees...');
        if(diff > 0) {
            for(var i = 0; i < diff; i++) {
                this.addTree(animation);
            }
        }
    }

    public addTree(animation: boolean){
        //console.log('Adding new tree...');
        var x = this.generateRandomNumber(CoordRanges.xMin, CoordRanges.xMax);
        var y = this.generateRandomNumber(CoordRanges.yMin, CoordRanges.yMax);
        var z = this.generateRandomNumber(CoordRanges.zMin, CoordRanges.zMax);
        var entity = this.document.createElement('a-entity');
        entity.setAttribute('id', 'tree');
        entity.setAttribute('scale', TreeScale.x + ' ' + TreeScale.y + ' ' + TreeScale.z);
        if(animation) {
            entity.setAttribute('position', x + ' ' + 2.2 + ' ' + z);
            entity.setAttribute('animation', 'property: object3D.position.y; to: ' + y + '; dir: alternate; dur: 2000; loop: false');
        }
        else entity.setAttribute('position', x + ' ' + y + ' ' + z);
        entity.setAttribute('gltf-model', '#tree2');
        this.scene.appendChild(entity);
    }

    private generateRandomNumber(min: number, max: number) {
        var randomNumber = (Math.random() * (max - min) + min).toFixed(5);
        
        return randomNumber;
    }

    private resetLandscape() {
        this.backCount+=this.treeLimit;
        this.countInfo.innerHTML='You have reached the count limit, reseting landscape....';
        
        var obj: any;
        while(obj = this.scene.querySelector('a-entity#tree')) {
            console.log('removing...');
            console.log(obj);
            this.scene.removeChild(obj);
        }

        this.env.setAttribute('environment', 'dressingAmount:' + this.backCount);
    }

    
}