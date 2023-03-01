## 示例

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

## options

Thes的option参数，使用 new Thes(options)创建一个渲染器。

`object`  `必填`

| Name    | Type   | Description |  |
| ------- | :----- | :---------- | ------- |
| el | HTMLElement | 需要挂载的dom节点，全屏的话传入document.body | `必填` |
| view | number | 视野宽广，越大视野越广，默认200 | `可选` |
| camera | [CameraType](/zh-cn/thes?id=cameratype) | 相机参数详见相机相关，不填默认`OrthographicCamera` | `可选` |
| width | number | 容器宽，不填默认window.innerWidth | `可选` |
| height | number | 容器高，不填默认window.innerHeight | `可选` |
| sceneName | string | 场景名称，不填按照创建的id拼接scene，例：scene1、scene2 | `可选` |
| lights | [PointType](/zh-cn/thes?id=pointtype) | 点光源，不填有默认 | `可选` |
| ambientLight | [AmbientType](/zh-cn/thes?id=ambienttype) | 环境光，不填有默认 | `可选` |
| background | string/string[] | 渲染器背景，传`color`只能传`rgb`色值，可以传一个`图片地址`作为背景，也可以传入一个`图片数量为6的数组`,表示`上下左右前后`<br />的`VR`视野，不传默认黑色背景 | `可选` |
| backgroundBlurriness | number | 模糊度：0-1 | `可选` |

### CameraType

### PointType

### AmbientType

## methods
## events