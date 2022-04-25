import replaceLink from './replaceLink';

export default function createMessage(body, date, position, id) {
  const message = document.createElement('div');
  message.classList.add('message');
  message.dataset.id = id;
  if (position) {
    message.insertAdjacentHTML('afterBegin', `<div class = 'message-header'> ${new Date(date).toLocaleDateString()}, ${new Date(date).toLocaleTimeString()} </div> <div class = 'message-body'> ${replaceLink(body)} </div> <div class = 'position'> 📍 ${position.latitude}, ${position.longtitude} </div><div class='is-favorite'></div>`);
  } else {
    message.insertAdjacentHTML('afterBegin', `<div class = 'message-header'> ${new Date(date).toLocaleDateString()}, ${new Date(date).toLocaleTimeString()} </div> <div class = 'message-body'> ${replaceLink(body)} </div> <div class='is-favorite'></div>`);
  }
  return message;
}
