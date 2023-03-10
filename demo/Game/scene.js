const createPlane = () => {
  let plane = Thes.createGeometry({
    geometry: 'box',
    material: 'basic',
    position: [0, 0, 0],
    geometryOption: {
      width: 800,
      height: 10,
      depth: 800,
    },
    materialOption: {
      color: 'rgb(136,137,131)',
    },
  });
  th.add(plane);
};
const initeBuild = pos => {
  let build1 = Thes.createGeometry({
    geometry: 'box',
    material: 'lamber',
    position: [-220, 30, 20],
    geometryOption: {
      width: 350,
      height: 50,
      depth: 150,
    },
    materialOption: {
      map: '../assets/qiang.jpg',
    },
  });
  let build2 = Thes.createGeometry({
    geometry: 'box',
    material: 'lamber',
    position: [220, 30, -270],
    geometryOption: {
      width: 350,
      height: 50,
      depth: 250,
    },
    materialOption: {
      map: '../assets/qiang.jpg',
    },
  });
  let build3 = Thes.createGeometry({
    geometry: 'box',
    material: 'lamber',
    position: [220, 6, -20],
    geometryOption: {
      width: 350,
      height: 2,
      depth: 250,
    },
    materialOption: {
      map: '../assets/cd.png',
    },
  });
  let build5 = Thes.createGeometry({
    geometry: 'box',
    material: 'lamber',
    position: [-220, 30, 290],
    geometryOption: {
      width: 350,
      height: 50,
      depth: 220,
    },
    materialOption: {
      map: '../assets/qiang.jpg',
    },
  });
  let build6 = Thes.createGeometry({
    geometry: 'box',
    material: 'lamber',
    position: [220, 30, 290],
    geometryOption: {
      width: 350,
      height: 50,
      depth: 220,
    },
    materialOption: {
      map: '../assets/qiang.jpg',
    },
  });
  let build7 = Thes.createGeometry({
    geometry: 'box',
    material: 'basic',
    position: [-350, 31, -270],
    geometryOption: {
      width: 100,
      height: 50,
      depth: 250,
    },
    materialOption: [
      {
        color: 'rgb(100,100,100)',
      },
      {
        color: 'rgb(100,100,100)',
      },
      {
        color: 'rgb(76,150,150)',
      },
      {
        color: 'rgb(76,0,150)',
      },
      {
        color: 'rgb(100,100,100)',
      },
      {
        color: 'rgb(100,100,100)',
      },
    ],
  });
  let build8 = Thes.createGeometry({
    geometry: 'box',
    material: 'basic',
    position: [-170, 55, -270],
    geometryOption: {
      width: 240,
      height: 100,
      depth: 250,
    },
    materialOption: [
      {
        color: 'rgb(255,100,150)',
      },
      {
        color: 'rgb(255,100,150)',
      },
      {
        color: 'rgb(200,0,200)',
      },
      {
        color: 'rgb(255,0,150)',
      },
      {
        color: 'rgb(255,100,150)',
      },
      {
        color: 'rgb(255,100,150)',
      },
    ],
  });
  let build9 = Thes.createGeometry({
    geometry: 'box',
    material: 'basic',
    position: [0, 1, 5],
    geometryOption: {
      width: 8,
      height: 8,
      depth: 8,
    },
    materialOption: {
      map: '../assets/mb.jpg',
    },
  });
  // const flame = Thes.createFlame([], '../assets/flamex.png');
  // flame.setPosition([-6,0,0])
  // build9.bind(flame)
  th.add(build1);
  th.add(build2);
  th.add(build3);
  th.add(build5);
  th.add(build6);
  th.add(build7);
  th.add(build8);
  Thes.createLoader({
    type: 'obj',
    url: '../assets/1/yassin.obj',
    mtlUrl: '../assets/1/yassin.mtl',
  }).then(res => {
    xw = res;
    xw.bind(build9);
    xw.setPosition([365, 32, 160]);
    xw.scale([2, 2, 2]);
    xw.rotateY(Math.PI);
    xw.isDrag = true;
    th.add(xw);
    // th.lookAt(res);
    // setTimeout(() => {
    //   th.moveAt(res);
    //   th.flyTo({ x: 365, y: 62, z: 159.95240000076592, time: 2525 });
    //   res.moveTo([
    //     { x: 365, y: 32, z: 150, time: 1000, deg: Math.PI / 2 },
    //     { x: 0, y: 32, z: 150, time: 10000, deg: -Math.PI / 2 },
    //     { x: 0, y: 32, z: -100, time: 5000, deg: Math.PI / 2 },
    //     { x: -350, y: 32, z: -100, time: 9000, deg: -Math.PI / 2 },
    //   ]);
    //   // th.flyTo({x: 400, y: 100, z: 200})
    //   // th.lookAt(res)
    // }, 5000);
  });
  Thes.createLoader({
    type: 'obj',
    url: '../assets/boy/boy.obj',
    mtlUrl: '../assets/boy/boy.mtl',
  }).then(res => {
    xl = res;
    xl.setPosition([365, 6, 125]);
    xl.scale([0.3, 0.3, 0.3]);
    //   res.rotateY(-Math.PI / 2);
    // xl.isDrag = true;
    th.add(xl);
  });
  const geo1 = Thes.createText({
    content: '快递站',
    style: {
      font: '../fonts/STXinwei_Regular.json',
      size: 18,
      height: 1,
    },
    material: 'basic',
    position: [-390, 65, -150],
    materialOption: {
      color: 'rgb(255,0,0)',
    },
  }).then(res => {
    th.add(res);
    //   res.rotateX(-Math.PI / 2);
  });
  console.log(build1);
};
createPlane();
initeBuild();

const tip = Thes.createTip({
  content: '欢迎来到帮帮忙场景小游戏',
  mask: false,
  mask: true,
  showCancle: false,
  sureText: '开始',
  onSure() {
    // console.log(tip.dispose());
    tip.dispose();
    th.lookAt(xw);
    th.flyTo({ x: 700, y: 200, z: 140, time: 1000 });
    // setTimeout(() => {
    //   th.moveAt(xw);
    //   th.flyTo({ x: 365, y: 62, z: 159.95240000076592, time: 2525 });
    //   xw.moveTo([
    //     { x: 365, y: 32, z: 150, time: 1000, deg: Math.PI / 2 },
    //     { x: 0, y: 32, z: 150, time: 10000, deg: -Math.PI / 2 },
    //     { x: 0, y: 32, z: -100, time: 5000, deg: Math.PI / 2 },
    //     { x: -350, y: 32, z: -100, time: 9000, deg: -Math.PI / 2 },
    //   ]);
    // }, 5000);
    startChat();
  },
  onCancle() {},
});
