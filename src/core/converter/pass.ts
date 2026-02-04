import { GeometryContainer } from '../../../types/geometry';
import { PassContinar, SceneBoxType } from '../../../types/thesFull';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import CreateThree from '../../common/three';
import { addRenderFunction, composer, deleteRender, breathhook } from '../thes';
export class Pass implements PassContinar {
  pass: Record<string, any>;
  id: number = -1;
  renderScene: Record<string, any>;
  constructor(sceneBox: SceneBoxType, pdom: HTMLElement) {
    this.renderScene = new RenderPass(sceneBox.scene, sceneBox.camera);
    this.pass = new OutlinePass(
      new CreateThree.THREE.Vector2(pdom.offsetWidth, pdom.offsetHeight),
      sceneBox.scene,
      sceneBox.camera
    );
    this.pass.renderToScreen = true;
    this.pass.edgeStrength = 3; // 粗
    this.pass.edgeGlow = 5; // 发光
    this.pass.edgeThickness = 3; // 光晕粗
    this.pass.pulsePeriod = 0; // 闪烁
    this.pass.visibleEdgeColor.set('green'); // 设置显示的颜色
    breathhook.addPass(this.renderScene, this.pass);
  }
  setLightStrength(num: number) {
    this.pass.edgeStrength = num;
  }
  setLightGlow(num: number) {
    this.pass.edgeGlow = num;
  }
  setLightThickness(num: number) {
    this.pass.edgeThickness = num;
  }
  setPulsePeriod(num: number) {
    this.pass.pulsePeriod = num;
  }
  setColor(color: string) {
    this.pass.visibleEdgeColor.set(color);
  }
  push(thing: GeometryContainer) {
    if (
      this.pass.selectedObjects.find(
        (item: Record<string, any>) => item.uuid == thing.content.thing.uuid
      )
    ) {
      return;
    }
    this.pass.selectedObjects.push(thing.content.thing);
  }
  replace(arr: Array<GeometryContainer>) {
    this.pass.selectedObjects = arr.map((item: GeometryContainer) => item.content.thing);
  }
  open() {
    let clock = new CreateThree.THREE.Clock();
    this.id = addRenderFunction(composer.render, [clock.getDelta()], composer);
  }
  close() {
    deleteRender(this.id);
  }
  dispose() {
    deleteRender(this.id);
    composer.removePass(this.renderScene);
    composer.removePass(this.pass);
    this.pass.selectedObjects = [];
    this.renderScene.dispose();
    this.pass.dispose();
    this.pass = {};
    this.renderScene = {};
  }
}
