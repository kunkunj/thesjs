## Example

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
| background | string/string[] | 渲染器背景，传`color`只能传`rgb`色值，可以传一个`图片地址`作为背景，也可以传入一个`图片数量为6的数组`,表示`上下左右前后`<br />的`VR`视野（仅当camera为`PerspectiveCamera`时有效），不传默认黑色背景 | `可选` |
| backgroundBlurriness | number | 模糊度：0-1 | `可选` |

### CameraType

Thes的option参数内的camera相机参数详情;

`object` `可选`

| Name                     | Type   | Description                                                  |        |
| ------------------------ | ------ | ------------------------------------------------------------ | ------ |
| type                     | string | 相机类型，可选参数`OrthographicCamera`/`CubeCamera`/`PerspectiveCamera`。可不传camera，只要传了，此参数必传 | `必填` |
|                          |        | 正交相机（`OrthographicCamera`）: 在这种投影模式下，无论物体距离相机距离远或者近，在最终渲染的图片中物体的大小都保持不变 | `必填` |
|                          |        | 立方相机（`CubeCamera`）: threejs中的CubeCamera              | `必填` |
|                          |        | 透视相机（`PerspectiveCamera`）: 这一投影模式被用来模拟人眼所看到的景象，它是3D场景的渲染中使用得最普遍的投影模式。 | `必填` |
| position                 | object | 相机的位置。可不传camera，只要传了，此参数必传               | `必填` |
|                          |        | `x:number`相机的x方向上的位置                                | `必填` |
|                          |        | `y:number`相机的y方向上的位置                                | `必填` |
|                          |        | `z:number`相机的z方向上的位置                                | `必填` |
| PerspectiveCameraOption  | object | 当type为`PerspectiveCamera`时，配置相机的参数                | `可选` |
|                          |        | `fov: number` 摄像机视锥体垂直视野角度，从视图的底部到顶部，以角度来表示。默认值是**50**。 | `可选` |
|                          |        | `aspectRatio: number` 摄像机视锥体长宽比，通常是使用画布的宽/画布的高。默认值是**1**（正方形画布）。 | `可选` |
|                          |        | `near: number`  摄像机视锥体近端面，默认值是**0.1**          | `可选` |
|                          |        | `far: number` 摄像机视锥体远端面，默认值是**2000**。         | `可选` |
| OrthographicCameraOption | object | 当type为`OrthographicCamera`时，配置相机的参数               | `可选` |
|                          |        | `near: number`  摄像机视锥体近端面，默认值是**0.1**          | `可选` |
|                          |        | `far: number` 摄像机视锥体远端面，默认值是**2000**。         | `可选` |
| CubeCameraOption         | object | 当type为`CubeCamera`时，配置相机的参数                       | `可选` |
|                          |        | `near: number`  摄像机视锥体近端面，默认值是**0.1**          | `可选` |
|                          |        | `far: number`摄像机视锥体远端面，默认值是**2000**。          | `可选` |
|                          |        | `renderTarget`:[Thes.createWebGLCubeRenderTarget]()          | `可选` |

### PointType

Thes的option参数内的lights光源参数详情;

`object` `可选`

| Name                | Type   | Description                                                  |        |
| ------------------- | ------ | ------------------------------------------------------------ | ------ |
| type                | string | 光源类型，可选参数`PointLight`/`RectAreaLight`/`SpotLight`。可不传lights，只要传了，此参数必传 | `必填` |
|                     |        | 点光源（`PointLight`）: 从一个点向各个方向发射的光源。一个常见的例子是模拟一个灯泡发出的光。 | `必填` |
|                     |        | 平面光光源（`RectAreaLight`）: 平面光光源从一个矩形平面上均匀地发射光线。这种光源可以用来模拟像明亮的窗户或者条状灯光光源 | `必填` |
|                     |        | 聚光灯（`SpotLight`）: 光线从一个点沿一个方向射出，随着光线照射的变远，光线圆锥体的尺寸也逐渐增大。 | `必填` |
| position            | object | 光源位置。可不传lights，只要传了，此参数必传                 | `必填` |
|                     |        | `x:number`光源的x方向上的位置                                | `必填` |
|                     |        | `y:number`光源的y方向上的位置                                | `必填` |
|                     |        | `z:number`光源的z方向上的位置                                | `必填` |
| PointLightOption    | object | 当type为`PointLight`时，配置光源的参数                       | `可选` |
|                     |        | `color:string`只能传`rgb`色值                                | `可选` |
|                     |        | `intensity: number` 光照强度。 默认值 1。                    | `可选` |
|                     |        | `distance: number`  这个距离表示从光源到光照强度为0的位置。 当设置为0时，光永远不会消失(距离无穷大)。默认值 0. | `可选` |
|                     |        | `decay: number` 沿着光照距离的衰退量。默认值 2。             | `可选` |
| RectAreaLightOption | object | 当type为`RectAreaLight`时，配置光源的参数                    | `可选` |
|                     |        |                                                              |        |
|                     |        |                                                              |        |
|                     |        | `near: number`  摄像机视锥体近端面，默认值是**0.1**          | `可选` |
|                     |        | `far: number` 摄像机视锥体远端面，默认值是**2000**。         | `可选` |
| SpotLightOption     | object | 当type为`SpotLight`时，配置光源的参数                        | `可选` |
|                     |        | `near: number`  摄像机视锥体近端面，默认值是**0.1**          | `可选` |
|                     |        | `far: number`摄像机视锥体远端面，默认值是**2000**。          | `可选` |
|                     |        | `renderTarget`:[Thes.createWebGLCubeRenderTarget]()          | `可选` |

### AmbientType

## member
## methods
## events