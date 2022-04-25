/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
import createTextMessage from './createTextMessage';

const uniqid = require('uniqid');

export default class Organizer {
  constructor() {
    this.organiser = document.querySelector('.organiser');
    this.searcher = document.querySelector('.search');
    this.container = document.querySelector('.content');
    this.messageForm = document.querySelector('.message-form');
    this.input = document.querySelector('.message-input');
    this.favorites = document.querySelector('.favorites');
    this.getAll = document.querySelector('.get-all');
    this.files = document.querySelector('.files');
    this.audiorecorder = document.querySelector('.record-audio');
    this.videorecorder = document.querySelector('.record-video');
    this.attachments = document.querySelector('.attachment');
    this.geocheck = document.querySelector('.geo-check');
    this.loader = document.querySelector('.loader');
    this.URL = 'http://localhost:7070';
    this.messages = [];
    this.audioTimer = document.createElement('div');
    this.audioTimer.classList.add('audio-recorder');
    this.audioTimer.innerHTML = '<div class = \'save-record\'> </div> <div class = \'record-timer\'> 0:00 </div> <div class = \'cancel-record\'></div>';
  }

  init() {
    this.addTextMessage();
    this.getAllMessages();
    this.getFavorites();
    this.findMessage();
    this.audiorecorder.addEventListener('click', () => {
      this.recordAudio();
    });
    this.videorecorder.addEventListener('click', () => {
      this.recordVideo();
    });
  }

  async getAllMessages() {
    this.container.innerHTML = '';
    const response = await fetch(`${this.URL}/all`);
    this.messages = await response.json();
    this.get10(this.messages);
    setTimeout(() => this.container.lastChild.scrollIntoView(true), 2000);
    this.container.addEventListener('scroll', (evt) => {
      if (evt.target.scrollTop === 0) {
        this.get10(this.messages);
      }
    });
  }

  getFavorites() {
    this.favorites.addEventListener('click', () => {
      this.showFavorites();
    });
    this.getAll.addEventListener('click', () => {
      this.getAllMessages();
      this.getAll.style.display = 'none';
      this.favorites.style.display = 'block';
    });
    this.container.addEventListener('scroll', (evt) => {
      if (evt.target.scrollTop === 0) {
        if (this.favorites.style.display === 'none') {
          this.get10(this.favoriteMessages);
        }
        if (this.favorites.style.display === 'block') {
          this.get10(this.messages);
        }
      }
    });
  }

  async get10(messages) {
    if (messages.length > 10) {
      const ten = messages.splice(messages.length - 10, 10);
      for (let i = 9; i > -1; i -= 1) {
        if (ten[i].path) {
          const response = await fetch(`${this.URL}/${ten[i].path}`);
          const blob = await response.blob();
          const source = URL.createObjectURL(blob);
          if (ten[i].type === 'voice') {
            ten[i].value = `<audio controls src = '${source}'> </audio>`;
          }
          if (ten[i].type === 'video') {
            ten[i].value = `<video heigth = '200' width = '360' controls src = '${source}'> </video>`;
          }
        }
        const newMessage = createTextMessage(ten[i].value, ten[i].timestamp, ten[i].position,
          ten[i].id);
        if (ten[i].isFavorite === true) {
          newMessage.querySelector('.is-favorite').classList.add('fav-active');
        }
        newMessage.querySelector('.is-favorite').addEventListener('click', (evt) => this.addToFavorites(evt));
        this.container.insertAdjacentElement('afterbegin', newMessage);
      }
    } else {
      for (let i = messages.length - 1; i > -1; i -= 1) {
        if (messages[i].path) {
          const response = await fetch(`${this.URL}/${messages[i].path}`);
          const blob = await response.blob();
          const source = URL.createObjectURL(blob);
          if (messages[i].type === 'voice') {
            messages[i].value = `<audio controls src = '${source}'> </audio>`;
          }
          if (messages[i].type === 'video') {
            messages[i].value = `<video heigth = '200' width = '360' controls src = '${source}'> </video>`;
          }
        }
        const newMessage = createTextMessage(messages[i].value, messages[i].timestamp,
          messages[i].position, messages[i].id);
        if (messages[i].isFavorite === true) {
          newMessage.querySelector('.is-favorite').classList.add('fav-active');
        }
        newMessage.querySelector('.is-favorite').addEventListener('click', (evt) => this.addToFavorites(evt));
        this.container.insertAdjacentElement('afterbegin', newMessage);
      }
      this.messages = [];
    }
  }

  async showFavorites() {
    this.container.innerHTML = '';
    const response = await fetch(`${this.URL}/all`);
    this.messages = await response.json();
    this.messages = this.messages.filter((message) => message.isFavorite === true);
    this.get10(this.messages);
    this.favorites.style.display = 'none';
    this.getAll.style.display = 'block';
    this.container.lastChild.scrollIntoView();
  }

  addTextMessage() {
    this.messageForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const { value } = this.input;
      if (value) {
        if (this.geocheck.checked) {
          this.getPosition();
        } else {
          this.position = null;
        }
        this.loader.style.display = 'block';
        setTimeout(() => {
          const timestamp = new Date().getTime();
          this.loader.style.display = 'none';
          const id = uniqid();
          const isFavorite = false;
          const message = {
            timestamp,
            value,
            id,
            isFavorite,
            position: this.position,
          };
          try {
            this.postData(`${this.URL}/new`, JSON.stringify(message));
          } catch (e) {
            return;
          }
          const newMessage = createTextMessage(value, timestamp, this.position, id);
          newMessage.querySelector('.is-favorite').addEventListener('click', (evt) => this.addToFavorites(evt));
          document.querySelector('.content').appendChild(newMessage);
          newMessage.scrollIntoView();
        }, 3000);
        this.input.value = '';
      }
    });
  }

  getPosition() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.position = {
        latitude: position.coords.latitude,
        longtitude: position.coords.longitude,
      };
    },
    // eslint-disable-next-line no-return-assign
    () => this.position = null,
    { timeout: 5000 });
  }

  // eslint-disable-next-line class-methods-use-this
  async postData(url, data) {
    // eslint-disable-next-line no-unused-vars
    const response = await fetch(url, {
      method: 'POST',
      body: data,
    });
    const text = await response.text();
    if (text !== 'ok') {
      throw Error('Что-то пошло не так');
    }
  }

  addToFavorites(evt) {
    const { id } = evt.target.closest('.message').dataset;
    if (evt.target.classList.contains('fav-active')) {
      evt.target.classList.remove('fav-active');
      this.postData(`${this.URL}/addtofavs`, JSON.stringify({
        id,
        isFavorite: false,
      }));
    } else {
      evt.target.classList.add('fav-active');
      this.postData(`${this.URL}/addtofavs`, JSON.stringify({
        id,
        isFavorite: true,
      }));
    }
  }

  async findMessage() {
    this.searcher.addEventListener('input', async () => {
      this.container.innerHTML = '';
      const response = await fetch(`${this.URL}/all`);
      this.messages = await response.json();
      const found = [];
      this.messages.forEach((message) => {
        if (message.value.indexOf(this.searcher.value) > -1) {
          found.push(message);
        }
      });
      this.get10(found);
    });
  }

  async recordAudio() {
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });
    let recorder = new MediaRecorder(this.stream);
    this.chunks = [];
    recorder.addEventListener('start', () => {
      document.querySelector('.organizer').appendChild(this.audioTimer);
      this.recorderTimer(document.querySelector('.record-timer'));
    });
    recorder.addEventListener('dataavailable', (evt) => {
      this.chunks.push(evt.data);
    });
    recorder.addEventListener('stop', () => {
      this.sourse = URL.createObjectURL(this.chunks[0]);
      const value = `<audio controls src = '${this.sourse}'> </audio>`;
      setTimeout(() => {
        if (this.geocheck.checked) {
          this.getPosition();
        } else {
          this.position = null;
        }
      }, 3000);
      this.loader.style.display = 'block';
      setTimeout(() => {
        const timestamp = new Date().getTime();
        this.loader.style.display = 'none';
        const id = uniqid();
        const fd = new FormData();
        fd.append('value', new Blob(this.chunks), id);
        fd.append('id', id);
        const isFavorite = false;
        const message = {
          timestamp,
          id,
          isFavorite,
          position: this.position,
          type: 'voice',
        };
        try {
          this.postData(`${this.URL}/new`, JSON.stringify(message));
        } catch (e) {
          return;
        }
        const newMessage = createTextMessage(value, timestamp, this.position, id);
        newMessage.querySelector('.is-favorite').addEventListener('click', (evt) => this.addToFavorites(evt));
        document.querySelector('.content').appendChild(newMessage);
        newMessage.scrollIntoView();
      }, 3000);
    });
    recorder.start();
    this.audioTimer.querySelector('.save-record').addEventListener('click', () => {
      this.audioTimer.remove();
      recorder.stop();
      clearInterval(this.timer);
    });
    this.audioTimer.querySelector('.cancel-record').addEventListener('click', () => {
      this.audioTimer.remove();
      recorder = null;
      clearInterval(this.timer);
    });
  }

  async recordVideo() {
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true,
    });
    let recorder = new MediaRecorder(this.stream);
    this.chunks = [];
    recorder.addEventListener('start', () => {
      document.querySelector('.organizer').appendChild(this.audioTimer);
      this.recorderTimer(document.querySelector('.record-timer'));
    });
    recorder.addEventListener('dataavailable', (evt) => {
      this.chunks.push(evt.data);
    });
    recorder.addEventListener('stop', () => {
      this.sourse = URL.createObjectURL(this.chunks[0]);
      const value = `<video heigth = '200' width = '360' controls src = '${this.sourse}'> </video>`;
      setTimeout(() => {
        if (this.geocheck.checked) {
          this.getPosition();
        } else {
          this.position = null;
        }
      }, 3000);
      this.loader.style.display = 'block';
      setTimeout(() => {
        const timestamp = new Date().getTime();
        this.loader.style.display = 'none';
        const id = uniqid();
        const fd = new FormData();
        fd.append('value', new Blob(this.chunks), id);
        fd.append('id', id);
        const isFavorite = false;
        const message = {
          timestamp,
          id,
          isFavorite,
          position: this.position,
          type: 'video',
        };
        try {
          this.postData(`${this.URL}/new`, JSON.stringify(message));
          fetch(`${this.URL}/upload`, {
            method: 'POST',
            body: fd,
          });
        } catch (e) {
          return;
        }
        const newMessage = createTextMessage(value, timestamp, this.position, id);
        newMessage.querySelector('.is-favorite').addEventListener('click', (evt) => this.addToFavorites(evt));
        document.querySelector('.content').appendChild(newMessage);
        newMessage.scrollIntoView();
      }, 3000);
    });
    recorder.start();
    this.audioTimer.querySelector('.save-record').addEventListener('click', () => {
      this.audioTimer.remove();
      recorder.stop();
      clearInterval(this.timer);
    });
    this.audioTimer.querySelector('.cancel-record').addEventListener('click', () => {
      this.audioTimer.remove();
      recorder = null;
      clearInterval(this.timer);
      navigator.mediaDevices.getUserMedia({ audio: false, video: false });
    });
  }

  // eslint-disable-next-line class-methods-use-this
  recorderTimer(element) {
    let minutes = 0;
    let seconds = 0;
    this.timer = setInterval(() => {
      seconds += 1;
      if (seconds === 60) {
        minutes += 1;
        seconds = 0;
      }
      if (seconds < 10) {
        // eslint-disable-next-line no-param-reassign
        element.innerText = `${minutes}:0${seconds}`;
        return;
      }
      // eslint-disable-next-line no-param-reassign
      element.innerText = `${minutes}:${seconds}`;
    }, 1000);
  }

  async getFile(source) {
    const response = await fetch(`${this.URL}/${source}`);
    const file = await response.blob();
    return file;
  }
}
