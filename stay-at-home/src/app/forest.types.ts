export interface TreeModel {
    name: string;
    label: string;
    gltfModel: string;
    id: string;
    src: string;
    posY: number;
    minY: number;
    scaleX: number;
    scaleY: number;
    scaleZ: number;
}

let models: Array<Object> = [];
models['default'] = {name: 'Common', label: 'Common', gltfModel: 'tree2', id: 'treeCommon', src: '/assets/gltf/tree4.glb', posY: 0, minY: 0, scaleX: 1, scaleY: 1, scaleZ: -1};
models['pine'] = {name: 'Pine', label: 'Pine', gltfModel: 'pine', id: 'treePine', src: '/assets/gltf/pine.glb', posY: 0.310, minY: 0, scaleX: 1, scaleY: 1, scaleZ: -1};
models['bubinga'] = {name: 'Bubinga', label: 'Bubinga', gltfModel: 'bubinga', id: 'treeBubinga', src: '/assets/gltf/bubinga.glb', posY: 0.310, minY: 0, scaleX: 1, scaleY: 1, scaleZ: -1};
models['willow'] = {name: 'Willow', label: 'Willow', gltfModel: 'willow', id: 'treeWillow', src: '/assets/gltf/willow.glb', posY: 0.310, minY: 0, scaleX: 1, scaleY: 1, scaleZ: -1};
models['apple'] = {name: 'Apple', label: 'Apple', gltfModel: 'apple', id: 'treeApple', src: '/assets/gltf/apple.glb', posY: 0.310, minY: 0, scaleX: 1, scaleY: 1, scaleZ: -1};
models['sycamore'] = {name: 'Sycamore', label: 'Sycamore', gltfModel: 'sycamore', id: 'treeSycamore', src: '/assets/gltf/sycamore.glb', posY: 0.310, minY: 0, scaleX: 1, scaleY: 1, scaleZ: -1};
models['common'] = {name: 'Common', label: 'Common', gltfModel: 'common', id: 'treeCommon', src: '/assets/gltf/common.glb', posY: 0.310, minY: 0, scaleX: 1, scaleY: 1, scaleZ: -1};
models['palm'] = {name: 'Palm', label: 'Palm', gltfModel: 'palm', id: 'treePalm', src: '/assets/gltf/palm2.glb', posY: 0.310, minY: 0, scaleX: 1, scaleY: 1, scaleZ: -1};

models['forest'] = {name: 'Forest', label: 'Forest', gltfModel: 'forest', id: 'treeForest', src: '/assets/gltf/forest.glb', posY: 0.310, minY: 0, scaleX: 3.150, scaleY: 3.270, scaleZ: -2.660};

let levels: Array<string> = [];
levels[0] = 'common';
levels[1] = 'willow';
levels[2] = 'pine';
levels[3] = 'sycamore';
levels[4] = 'palm';
levels[5] = 'bubinga';
levels[6] = 'apple';


export function getTreeModel(model: string) {
    return parseTreeModel(models[model]);
}

function parseTreeModel(modelObj: TreeModel) {
    return modelObj;
}

export function getTreeModelByLevel(level: number) {
    console.log('getTreeModelByLevel');
    console.log(levels.length);
    if(level < 0) {
        level = 0;
    }
    if(levels[level] == null) {
        level = levels.length-1;
    }

    //level = 4;
    return parseTreeModel(models[levels[level]]);
}