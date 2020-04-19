export class ForestRenderer {
    private document: Document;
    private scene: Element;
    private txt: Element;
    private env: Element;
    private treeCount: number = 0;

    constructor(document?: Document) {
        this.document = document;

        this.scene = this.document.querySelector('a-scene');
        this.txt = this.scene.querySelector('#treeNumber');
        this.env = this.scene.querySelector('#env');
    }

    public setInitialAmount(amount:number) {
        this.env.setAttribute('environment', 'dressingAmount:' + amount);
    }

    public setTreeCount(count:number) {
        this.treeCount = count;
        if(this.treeCount > 0){
            this.txt.setAttribute('value', 'You have ' + this.treeCount + ' trees');
        }
    }

    public addTree(){
        console.log('Adding new tree...');
        var x = this.generateRandomNumber(-3, 3);
        var y = this.generateRandomNumber(0.30000, 0.70000);
        var z = this.generateRandomNumber(-2, -4.50000);
        var entity = this.document.createElement('a-entity');
        entity.setAttribute('id', 'id2');
        entity.setAttribute('scale', '0.28 0.22 -0.23');
        entity.setAttribute('position', x + ' ' + 2.2 + ' ' + z);
        entity.setAttribute('animation', 'property: object3D.position.y; to: ' + y + '; dir: alternate; dur: 2000; loop: false');
        entity.setAttribute('gltf-model', '/assets/gltf/tree4.glb');
        this.scene.appendChild(entity);
    }

    private generateRandomNumber(min: number, max: number) {
        var randomNumber = (Math.random() * (max - min) + min).toFixed(5);
        
        return randomNumber;
    }

    
}