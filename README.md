# diploma-organizer

## Выполнение обязательных задач

### Сохранение в истории ссылок и текстовых сообщений

При вводе в текста в поле ввода и его сабмите создается сообщение с соответствующим содержанием

![](https://imgur.com/9qFUgxv.png)

### Ссылки должны быть кликабельны и отображаться как ссылки

Веб-адреса и скачиваемые файлы отображаются как ссылки

![](https://imgur.com/wpSYPnH.png)


### Добавление файлов

При нажатии на иконку скрепки справа от поля ввода текста открывается окно для выбора файла для загрузки на сервер

![](https://imgur.com/UEeU89I.png)

### Скачивание файлов

Добавленный файл можно скачать на компьютер по ссылке

![](https://imgur.com/IghF4GG.png)

### Ленивая подгрузка: сначала подгружаются последние 10 сообщений, при прокрутке вверх подгружаются следующие 10 и т.д.

Реализовано, при скролле до верхней границы контейнера подгружается порция сообщений

## Выполнение факультативных задач

### Поиск по сообщениям (интерфейс + реализация на сервере)

В верхней части экрана находится строка поиска, при вводе в которой отображаются соответствующие по текстовому содержанию сообщения

![](https://imgur.com/b3Gfi8X.png)

### Запись видео и аудио (используя API браузера)

Справа от поля ввода текста реализованы кнопки записи видео и аудио сообщений (по аналогии с ДЗ Timeline)

![](https://imgur.com/a/Pe64D3e.png)

### Отправка геолокации 

При активации чекбокса справа от контейнера сообщений к телу сообщения прикрепляются координаты

![](https://imgur.com/kSKI9ZL.png)

### Воспроизведение видео\аудио

см. на 2 пункта выше, записанные аудио и видео сообщения проигрываются в браузере

### Добавление сообщения в избранное (тогда должен быть интерфейс для просмотра избранного)

В каждом сообщении есть звездочка, при нажатии на которую на сервер отправляется запрос и присваивается соответствующее свойство объекту сообщения, а в правой части экрана имеется кнопка для отображения только избранных сообщений

![](https://imgur.com/q7qYhHj.png)
