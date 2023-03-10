
let index = 0;
function startChat(time = 3000) {
  let chatArr = [
    {
      peo: xl,
      content: 'hello，小李',
    },
    {
      peo: xw,
      content: '你好啊，小王，有什么事情吗？',
    },
    {
      peo: xl,
      content: '我现在有点事情，你能帮我把这个货物拿到快递站吗？',
    },
    {
      peo: xw,
      content: '当然可以!',
    },
    {
      peo: xl,
      content: '谢谢啦!',
    },
  ];
  const popup = setChat(chatArr[index].peo, chatArr[index].content);
  setTimeout(() => {
    chatArr[index].peo.unBind(popup);
    index++;
    startChat(3000);
  }, time);
}
function setChat(peo, text) {
  let dom = document.createElement('div');
  dom.style = `width: 100px; height: 100px; background: #fff; border-radius: 10px; display: none`;
  dom.innerHTML = text;
  const popup = Thes.createPopup({
    content: dom,
    position: [0, 0, 0],
    offset: 10,
  });
  //   popup.addTo(th)
  peo.bind(popup);
  return popup;
}
