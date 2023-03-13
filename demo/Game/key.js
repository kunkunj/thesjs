function initKey() {
  xw.onKey('w', e => {
    e.translateZ(-1);
  });
  xw.onKey('s', e => {
    e.translateZ(1);
  });
  xw.onKey('a', e => {
    e.translateX(-1);
  });
  xw.onKey('d', e => {
    e.translateX(1);
  });
  xl.onKey('w', e => {
    e.translateZ(-1);
  });
  xw.offKey('w');
}
