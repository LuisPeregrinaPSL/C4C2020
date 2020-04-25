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
models['common'] = {name: 'Common', label: 'Common', gltfModel: 'tree2', id: 'treeCommon', src: '/assets/gltf/tree4.glb', posY: 0, minY: 0, scaleX: 1, scaleY: 1, scaleZ: -1};
models['pine'] = {name: 'Pine', label: 'Pine', gltfModel: 'pine', id: 'treePine', src: '/assets/gltf/pine.glb', posY: 0.310, minY: 0, scaleX: 2, scaleY: 2, scaleZ: -2};
models['palm'] = {name: 'Palm', label: 'Palm', gltfModel: 'palm', id: 'treePalm', src: '/assets/gltf/palm.glb', posY: 0.310, minY: 0, scaleX: 0.25, scaleY: 0.5, scaleZ: -0.25};
models['bubinga'] = {name: 'Bubinga', label: 'Bubinga', gltfModel: 'bubinga', id: 'treeBubinga', src: '/assets/gltf/bubinga.glb', posY: 0.310, minY: 0, scaleX: 1, scaleY: 1, scaleZ: -1};

let levels: Array<string> = [];
levels[0] = 'common';
levels[1] = 'pine';
levels[2] = 'palm';
levels[2] = 'bubinga';


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

    //level = 0;
    return parseTreeModel(models[levels[level]]);
}