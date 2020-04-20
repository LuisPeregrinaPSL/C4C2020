import { CoordRanges, TreeScale } from 'src/app/forest.enum';

export class ForestRenderer {
    private document: Document;
    private scene: Element;
    private txt: Element;
    private env: Element;
    private treeCount: number = 0;

    

    constructor(document?: Document) {
        this.document = document;

        this.scene = this.document.querySelector('a-scene');
        console.log(this.scene);
        this.txt = this.scene.querySelector('#treeNumber');
        this.env = this.scene.querySelector('#env');

        /*
        console.log('Calling pool');
        console.log(el);
        var el = this.scene.components.pool__entity.requestEntity();
        el.play();
        this.scene.components.pool__entity.returnEntity(el);
        */
    }

    public setInitialAmount(amount:number) {
        this.env.setAttribute('environment', 'dressingAmount:' + amount);
    }

    public setTreeCount(count:number) {
        count = 1000;
        var previousCount = this.treeCount;
        this.treeCount = count;
        if(this.treeCount > 0){
            if(previousCount == 0) {
                //this.addInitialTrees();
            }
            this.txt.setAttribute('value', 'You have ' + this.treeCount + ' trees');
        }
    }

    private addInitialTrees() {
        console.log('Adding initial trees...');
        if(this.treeCount > 0) {
            for(var i = 0; i < this.treeCount; i++) {
                this.addTree(false);
            }
        }
    }

    public addTree(animation: boolean){
        console.log('Adding new tree...');
        var x = this.generateRandomNumber(CoordRanges.xMin, CoordRanges.xMax);
        var y = this.generateRandomNumber(CoordRanges.yMin, CoordRanges.yMax);
        var z = this.generateRandomNumber(CoordRanges.zMin, CoordRanges.zMax);
        var entity = this.document.createElement('a-entity');
        entity.setAttribute('id', 'id2');
        entity.setAttribute('scale', TreeScale.x + ' ' + TreeScale.y + ' ' + TreeScale.z);
        if(animation) {
            entity.setAttribute('position', x + ' ' + 2.2 + ' ' + z);
            entity.setAttribute('animation', 'property: object3D.position.y; to: ' + y + '; dir: alternate; dur: 2000; loop: false');
        }
        else entity.setAttribute('position', x + ' ' + y + ' ' + z);
        entity.setAttribute('gltf-model', '/assets/gltf/tree4.glb');
        this.scene.appendChild(entity);
    }

    private generateRandomNumber(min: number, max: number) {
        var randomNumber = (Math.random() * (max - min) + min).toFixed(5);
        
        return randomNumber;
    }

    
}