import { CoordRanges, TreeScale } from 'src/app/forest.enum';
import { getTreeModel, getTreeModelByLevel, TreeModel } from 'src/app/forest.types';
import { GameRules } from 'src/app/game-rules';
import { Utils } from './utils';

export class ForestRenderer {
    private __document: Document;
    private __aframe: any;
    private __three: any;
    private scene: any;
    private txt: Element;
    private env: Element;
    private infoBlock: any;
    private countInfo: Element;
    private currentView: Element;
    private treeCount: number = 0;
    private treeLimit: number = 40; //It will reset the landscape every treeLimit
    private backCount: number = 0;
    private frontCount: number = 0;
    private level: number = 1;
    private model: TreeModel;
    

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

        this.setLevel(0);
        
    }

    private setEvents() {
        this.__aframe.registerComponent('three-info', {
            schema: {
            },
        
            init: function () {
              var data = this.data;
              var el = this.el;  // <a-entity>
              //var defaultColor = el.getAttribute('material').color;
              var info = el.parentNode.parentNode.querySelector('#info_block').querySelector('#content');
              var info_tree = el.parentNode.parentNode.querySelector('#tree_info');
              

              el.addEventListener('mouseenter', function () {
                info.innerHTML = data.text;
                //el.setAttribute('color', data.color);
              });
        
              el.addEventListener('mouseleave', function () {
                info.innerHTML = '<br>';
                info_tree.style.visibility = 'hidden';
                //el.setAttribute('color', defaultColor);
              });

              el.addEventListener('click', (evt) => {
                //info.innerHTML = 'Alive since: ' + this.getElapsedTime(data.timestamp);
                info_tree.style.visibility = 'visible';
                info_tree.querySelector('#tree_name').innerHTML = '<h2>'+data.name+'</h2>';
                info_tree.querySelector('#tree_time').innerHTML = 'Alive since <strong>'+this.getElapsedTime(data.timestamp)+'</strong>';
                info_tree.querySelector('#tree_content').innerHTML = data.info;
                //evt.detail.intersection.point;
              });
            },
            getElapsedTime: function(timestamp) {
                var currentDate = new Date();
                var time = currentDate.getTime() - timestamp;
                var seconds =  time / 1000;
                var resSeconds = (time % 1000)/1000;
                seconds = seconds - resSeconds;
                
                var minutes = seconds / 60;
                var resMinutes = seconds % 60;
                minutes = minutes - (resMinutes/60);
                seconds = resMinutes;

                var hours = minutes / 60;
                var resHours= minutes % 60;
                hours = hours - (resHours/60);
                minutes = resHours;

                return Math.round(hours) + ' hrs ' + Math.round(minutes) + ' min ' + Math.round(seconds) + ' sec';

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

    public showInformationPane() {
        this.infoBlock.style.visibility = 'visible';
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

    public setLevel(level: number) {
        console.log('Setting level to ', level);
        this.level = level;
        if(this.frontCount == 0) {
            this.frontCount = GameRules.getTreesByLevel(this.level);
            console.log('Setting frontCount to', this.frontCount);
        }
        else{
            this.resetLandscape();
            this.convertLastLevelIntoForest();
        }
        if(this.level > 0) {
            this.convertLastLevelIntoForest();
        }
        this.model = getTreeModelByLevel(this.level);
    }

    public setLastLevel(level: number, initialCount: number) {
        console.log('Setting last level to', level);
        this.level = level;
        if(this.frontCount == 0) {
            this.frontCount = GameRules.getTreesByLevel(this.level);
            console.log('Setting frontCount to', this.frontCount);
        }
        this.model = getTreeModelByLevel(this.level);
        this.resetLandscape();
        this.setTreeCount(initialCount, false);
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
        
        //GROW
        if(this.treeCount > previousCount) {
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
        } //SHRINK
        else if(this.treeCount < previousCount) {
            diff = previousCount - this.treeCount;
            if(diff > 0){
                /*
                if((this.treeCount - this.backCount) > this.treeLimit) {
                    this.resetLandscape();
                    diff = this.treeCount - this.backCount;
                    console.log('new diff', diff);
                    //this.treeCount = diff;
                }
                */
                this.removeTrees(diff, animation);
                //this.txt.setAttribute('value', 'You have ' + this.treeCount + ' trees');
                this.countInfo.innerHTML='You have ' + this.treeCount + ' trees';
            }
        }
    }

    private addNewTrees(diff: number, animation: boolean) {
        console.log('Adding ' + diff + ' new trees...');
        this.frontCount+=diff;
        //diff=1;
        if(diff > 0) {
            for(var i = 0; i < diff; i++) {
                this.addTree(animation);
            }
        }
    }

    private removeTrees(diff: number, animation: boolean) {
        console.log('Removing ' + diff + ' new trees...');
        this.frontCount+=diff;
        //diff=1;
        if(diff > 0) {
            for(var i = 0; i < diff; i++) {
                this.removeTree(this.model.id);
            }
        }
    }

    public addTree(animation: boolean){
        console.log('Adding new tree...');
        var x = Utils.getRandomFloat(CoordRanges.xMin, CoordRanges.xMax);
        //var y = Utils.getRandomInt(CoordRanges.yMin, CoordRanges.yMax);
        //var y = 0.310;
        var y = this.model.posY;
        var z = Utils.getRandomFloat(CoordRanges.zMin, CoordRanges.zMax);
        var entity = this.__document.createElement('a-entity');
        entity.setAttribute('id', this.model.id);
        entity.setAttribute('position', x + ' ' + y + ' ' + z);
        //entity.setAttribute('scale', model.scaleX + ' ' + model.scaleY + ' ' + model.scaleZ);
        if(animation) {
            entity.setAttribute('scale', this.model.scaleX + ' ' + this.model.minY + ' ' + this.model.scaleZ);
            entity.setAttribute('animation', 'property: object3D.scale.y; to: ' + this.model.scaleY + '; dir: alternate; dur: 2000; loop: false');
        }
        else entity.setAttribute('scale', this.model.scaleX + ' ' + this.model.scaleY + ' ' + this.model.scaleZ);

        var createdDate: Date = new Date();

        entity.setAttribute('rotation', '0 0 0');
        entity.setAttribute('gltf-model', '#'+this.model.gltfModel);
        entity.setAttribute('animation-mixer', '');
        entity.setAttribute('three-info', 'name: ' + this.model.name + '; info: ' + this.model.info + '; text: I am a ' + this.model.name + '; created: ' + new Date() + '; timestamp: ' + createdDate.getTime() + '; model: ' + this.model.src);

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
        console.log('frontCount', this.frontCount);
        if(this.frontCount > 0) {
            this.backCount+=this.frontCount;
            this.countInfo.innerHTML='You have reached the count limit, reseting landscape....';
            
            this.removeItems(this.model.id);

            this.frontCount = 0;
            this.env.setAttribute('environment', 'dressingAmount:' + this.backCount);
        }
    }

    private convertLastLevelIntoForest() {
        var forestModel = getTreeModel('forest');
        this.removeItems(forestModel.id);

        var scaleFactor = this.level / 1.1;
        var x = -27.074 * scaleFactor;
        var y = forestModel.posY;
        var z = -41.216 * scaleFactor;
        var entity = this.__document.createElement('a-entity');
        entity.setAttribute('id', forestModel.id);
        entity.setAttribute('position', x + ' ' + y + ' ' + z);
        //entity.setAttribute('scale', model.scaleX + ' ' + model.scaleY + ' ' + model.scaleZ);
        entity.setAttribute('scale', (forestModel.scaleX * scaleFactor) + ' ' + forestModel.minY + ' ' + (forestModel.scaleZ * scaleFactor) );
        entity.setAttribute('animation', 'property: object3D.scale.y; to: ' + (forestModel.scaleY * scaleFactor)  + '; dir: alternate; dur: 2000; loop: false');

        entity.setAttribute('rotation', '0 0 0');
        entity.setAttribute('gltf-model', '#'+forestModel.gltfModel);
        entity.setAttribute('animation-mixer', '');
        entity.setAttribute('show-three-info', 'text: I am a ' + forestModel.name);
        
        this.scene.appendChild(entity);
    }
    
    private removeItems(itemId: string) {
        console.log('removeItems');

        var obj: any;
        while(obj = this.scene.querySelector('a-entity#' + itemId)) {
            console.log('removing...');
            console.log(obj);
            this.scene.removeChild(obj);
        }
    }

    private removeTree(itemId: string) {
        console.log('removeTree');

        var obj: any;
        if(obj = this.scene.querySelector('a-entity#' + itemId)) {
            console.log('removing...');
            console.log(obj);
            this.scene.removeChild(obj);
        }
    }
}