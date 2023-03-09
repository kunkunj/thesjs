import Tween from '@tweenjs/tween.js';
import CreateThree from '../../common/three';
export default (
    url:string
): ThreeConstruct.Object3D => {
  var krq = new CreateThree.THREE.Object3D();
  initFlame(krq,url);
  return krq;
};
function initFlame(krq: ThreeConstruct.Object3D, url: string) {
  var texture = new CreateThree.THREE.TextureLoader().load(url);
  //sprite材质
  var material = new CreateThree.THREE.SpriteMaterial({
    //以canvas作为纹理
    map: texture,
    //混合度 加法混合
    blending: CreateThree.THREE.AdditiveBlending,
  });

  //循环1000  添加粒子
  for (var i = 0; i < 2000; i++) {
    var particle = new CreateThree.THREE.Sprite(material);
    initParticle(particle, i);
    krq.add(particle);
    krq.name = 'particles_flame';
  }
  // scene.add(krq);
}

/**
 * 粒子 延迟发散
 * @param particle
 * @param delay
 */
function initParticle(particle: ThreeConstruct.Object3D, delay: number) {
  particle.position.set(5, Math.random() + 5, 0);
  particle.scale.x = particle.scale.y = Math.random() * 3;
  //下面是一系列的动画
  var xx = Math.random() * 10 - 5;
  var yy = Math.cos((Math.PI / 100) * xx) * 20;
  //位移
  new Tween.Tween(particle.position)
    .delay(delay)
    .to(
      {
        x: xx,
        y: yy,
        z: Math.random() * 10 - 5,
      },
      2000
    )
    .onComplete(function () {
      initParticle(particle, delay);
    })
    .start();
  // 大小
  new Tween.Tween(particle.scale)
    .delay(delay)
    .to(
      {
        x: 0.01,
        y: 0.01,
      },
      1000
    )
    .start();
}
