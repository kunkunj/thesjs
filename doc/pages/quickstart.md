###### 快速上手

本节将介绍如何在项目中使用 thesjs

1. 创建一个渲染器

```
const th = new Thes({
​    el: document.body,
​    view: 800,
​    sceneName: 'scene1',
​    width: window?.innerWidth,
​    height: window?.innerHeight,
​    background: 'rgb(255,255,0)',
});
```

2. 创建一个模型

```
const geo = Thes.createGeometry({
​    geometry: 'BoxGeometry',
​    material: 'MeshBasicMaterial',
​    position: [0, 0, 0],
​    materialOption: {
​        color: 'rgb(255,0,0)',
​    },
});
```

3. 把模型加入到渲染器中

```
th.add(geo);
```

