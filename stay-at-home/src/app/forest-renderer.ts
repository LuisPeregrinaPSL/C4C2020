import { CoordRanges, TreeScale } from 'src/app/forest.enum';

export class ForestRenderer {
    private document: Document;
    private scene: any;
    private txt: Element;
    private env: Element;
    private treeCount: number = 0;

    

    constructor(document?: Document, vector?: any) {
        this.document = document;

        this.scene = this.document.querySelector('a-scene');
        console.log(this.scene);
        this.txt = this.scene.querySelector('#treeNumber');
        this.env = this.scene.querySelector('#env');

        /*
        console.log('Calling pool');
        console.log(this.scene.components);
        var el = this.scene.components.pool__red.requestEntity();
        el.play();
        this.scene.components.pool__red.returnEntity(el);
        */
        
    }

    public setInitialAmount(amount:number) {
        this.env.setAttribute('environment', 'dressingAmount:' + amount);
    }

    public setTreeCount(count:number, animation: boolean) {
        console.log('Seeting tree count', count);
        //count = 1000;
        var previousCount = this.treeCount;
        this.treeCount = count;
        if(this.treeCount - previousCount > 0){
            this.addNewTrees((this.treeCount - previousCount), animation);
            this.txt.setAttribute('value', 'You have ' + this.treeCount + ' trees');
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

    
}