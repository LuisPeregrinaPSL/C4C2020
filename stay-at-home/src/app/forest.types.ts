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
    info: string;
    created: Date;
    options: string;
}

let models: Array<Object> = [];
models['default'] = {name: 'Common', label: 'Common', gltfModel: 'tree2', id: 'treeCommon', src: '/assets/gltf/tree4.glb', posY: 0, minY: 0, scaleX: 1, scaleY: 1, scaleZ: -1, info: 'I am the default tree only used if any other exists'};
models['pine'] = {name: 'Pine', label: 'Pine', gltfModel: 'pine', id: 'treePine', src: '/assets/gltf/pine.glb', posY: 0.310, minY: 0, scaleX: 1, scaleY: 1, scaleZ: -1, info: 'A pine is any conifer in the genus Pinus (/ˈpiːnuːs/[1]) of the family Pinaceae. Pinus is the sole genus in the subfamily Pinoideae.'};
models['bubinga'] = {name: 'Bubinga', label: 'Bubinga', gltfModel: 'bubinga', id: 'treeBubinga', src: '/assets/gltf/bubinga.glb', posY: 0.310, minY: 0, scaleX: 1, scaleY: 1, scaleZ: -1, info: 'Guibourtia is a flowering plant genus in the family Fabaceae (legume family), also known by the common names as Rhodesian teak, African rosewood, amazique, bubinga, kevazingo and ovangkol.'};
models['willow'] = {name: 'Willow', label: 'Willow', gltfModel: 'willow', id: 'treeWillow', src: '/assets/gltf/willow.glb', posY: 0.310, minY: 0, scaleX: 1, scaleY: 1, scaleZ: -1, info: 'Willows, also called sallows and osiers, form the genus Salix, around 400 species of deciduous trees and shrubs, found primarily on moist soils in cold and temperate regions of the Northern Hemisphere.'};
models['apple'] = {name: 'Apple', label: 'Apple', gltfModel: 'apple', id: 'treeApple', src: '/assets/gltf/apple.glb', posY: 0.310, minY: 0, scaleX: 1, scaleY: 1, scaleZ: -1, info: 'An apple is a sweet, edible fruit produced by an apple tree (Malus domestica). Apple trees are cultivated worldwide and are the most widely grown species in the genus Malus. The tree originated in Central Asia, where its wild ancestor, Malus sieversii, is still found today.'};
models['common'] = {name: 'Common', label: 'Common', gltfModel: 'common', id: 'treeCommon', src: '/assets/gltf/common.glb', posY: 0.310, minY: 0, scaleX: 1, scaleY: 1, scaleZ: -1, info: 'I am the most common tree of this collection, and the first level of the game.'};
models['palm'] = {name: 'Palm', label: 'Palm', gltfModel: 'palm', id: 'treePalm', src: '/assets/gltf/palm.glb', posY: 0.310, minY: 0, scaleX: 1, scaleY: 1, scaleZ: -1, info: 'Palm trees are a botanical family of perennial lianas, shrubs, and trees. They are the only members of the family Arecaceae, which is the only family in the order Arecales. They grow in hot climates.'};
models['sycamore'] = {name: 'Sycamore', label: 'Sycamore', gltfModel: 'sycamore', id: 'treeSycamore', src: '/assets/gltf/sycamore.glb', posY: 0.310, minY: 0, scaleX: 1, scaleY: 1, scaleZ: -1, info: 'Acer pseudoplatanus, known as the sycamore in the United Kingdom and the sycamore maple in the United States,[2] is a flowering plant species in the soapberry and lychee family Sapindaceae.'};


models['forest'] = {name: 'Forest', label: 'Forest', gltfModel: 'forest', id: 'treeForest', src: '/assets/gltf/forest.glb', posY: 0.310, minY: 0, scaleX: 3.150, scaleY: 3.270, scaleZ: -2.660, info: 'I am the forest :)'};

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

    //level = 3;
    return parseTreeModel(models[levels[level]]);
}