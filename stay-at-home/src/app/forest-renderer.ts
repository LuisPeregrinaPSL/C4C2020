import { CoordRanges, TreeScale } from 'src/app/forest.enum';
import { Utils } from './utils';

export class ForestRenderer {
    private __document: Document;
    private __aframe: any;
    private __three: any;
    private scene: any;
    private txt: Element;
    private env: Element;
    private infoBlock: Element;
    private countInfo: Element;
    private currentView: Element;
    private treeCount: number = 0;
    private treeLimit: number = 200; //It will reset the landscape every treeLimit
    private backCount: number = 0;
    

    constructor(document?: Document, aframe?: any, three?: any) {
        this.__document = document;
        this.__aframe = aframe;
        this.__three = three;
        
        this.scene = this.__document.querySelector('a-scene');
        console.log(this.scene);
        this.txt = this.scene.querySelector('#treeNumber');
        this.env = this.scene.querySelector('#env');

        this.infoBlock = this.__document.querySelector('#info_block');
        this.countInfo = this.infoBlock.querySelector('#tree_count');

        this.setEvents();

        /*
        console.log('Calling pool');
        console.log(this.scene.components);
        var el = this.scene.components.pool__red.requestEntity();
        el.play();
        this.scene.components.pool__red.returnEntity(el);
        */
        
    }

    private setEvents() {
        this.__aframe.registerComponent('show-three-info', {
            schema: {
              color: {default: 'red'}
            },
        
            init: function () {
            console.log('INIT');
            console.log(this);
              var data = this.data;
              var el = this.el;  // <a-entity>
              //var defaultColor = el.getAttribute('material').color;
              var info = el.parentNode.parentNode.querySelector('#info_block').querySelector('#content');

              el.addEventListener('mouseenter', function () {
                info.innerHTML = data.text;
                //el.setAttribute('color', data.color);
                console.log('Testing!!!!', data.text);
                console.log(el.parentNode.parentNode);
                console.log(info);
                //alert(data.text);
              });
        
              el.addEventListener('mouseleave', function () {
                info.innerHTML = '<br>';
                //el.setAttribute('color', defaultColor);
              });

              el.addEventListener('click', function (evt) {
                info.innerHTML = 'You click on a tree!!!';
                //evt.detail.intersection.point;
              });
            }
          });
    }

    public setInitialAmount() {
        console.log('treeCount: ', this.treeCount);
        this.backCount = Math.floor(this.treeCount / this.treeLimit) * this.treeLimit;
        console.log('backCount: ', this.backCount);
        this.env.setAttribute('environment', 'dressingAmount:' + this.backCount);
        var diff = this.treeCount - this.backCount;
        return diff;
    }

    public setCurrentView(view: string) {
        console.log('Changing view', view);
        var newView: any;
        switch(view) {
            case 'gView':
            case 'aView':
            case 'eView':
                newView = this.scene.querySelector('#'+view);
                break;
            default:
                return;
        }

        var cursor;

        if(this.currentView != null) {
            this.currentView.setAttribute('active', 'false');
            if(this.currentView.getAttribute('id') == 'eView') {
                cursor = this.currentView.querySelector('#cursor');
                this.currentView.removeChild(cursor);
            }

        }
        newView.setAttribute('active', 'true');
        if(view == 'eView') {
            cursor = this.__document.createElement('a-cursor');
            cursor.setAttribute('id', 'cursor');
            newView.appendChild(cursor);
        }

        this.currentView = newView;
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
        var x = Utils.getRandomFloat(CoordRanges.xMin, CoordRanges.xMax);
        //var y = Utils.getRandomInt(CoordRanges.yMin, CoordRanges.yMax);
        var y = 0;
        var z = Utils.getRandomFloat(CoordRanges.zMin, CoordRanges.zMax);
        var entity = this.__document.createElement('a-entity');
        entity.setAttribute('id', 'tree');
        entity.setAttribute('scale', TreeScale.x + ' ' + TreeScale.y + ' ' + TreeScale.z);
        if(animation) {
            entity.setAttribute('position', x + ' ' + 2.2 + ' ' + z);
            entity.setAttribute('animation', 'property: object3D.position.y; to: ' + y + '; dir: alternate; dur: 2000; loop: false');
        }
        else entity.setAttribute('position', x + ' ' + y + ' ' + z);

        entity.setAttribute('rotation', '0 0 0');
        entity.setAttribute('gltf-model', '#tree2');
        entity.setAttribute('animation-mixer', 'clip: *;');
        entity.setAttribute('show-three-info', 'text: Stay At Home');
        

        var animEntity = this.__document.createElement('a-animation');
        animEntity.setAttribute('begin', 'click');
        animEntity.setAttribute('attribute', 'rotation');
        animEntity.setAttribute('to', '0 360 0');
        animEntity.setAttribute('easing', 'linear');
        animEntity.setAttribute('dur', '2000');
        animEntity.setAttribute('fill', 'backwards');

        //entity.appendChild(animEntity);
        
        this.scene.appendChild(entity);
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