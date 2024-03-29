[![Tests](../../actions/workflows/tests-13-sprint.yml/badge.svg)](../../actions/workflows/tests-13-sprint.yml) [![Tests](../../actions/workflows/tests-14-sprint.yml/badge.svg)](../../actions/workflows/tests-14-sprint.yml)
# Проект Mesto фронтенд + бэкенд

## Директории

`/routes` — папка с файлами роутера  
`/controllers` — папка с файлами контроллеров пользователя и карточки   
`/models` — папка с файлами описания схем пользователя и карточки  
  
## Запуск проекта

`npm run start` — запускает сервер   
`npm run dev` — запускает сервер с hot-reload

**Описание**

* Проект о красивых местах, которыми хотят поделиться пользователи.

**Технологии**

* Node.js
* Express.js
* Работа с базами данных. NoSQL MongoDB.
* Безопасность и тестирование
* Развертывание бэкенда на удалённой машине
* Централизованная обработка ошибок
* Валидация данных с использованием библиотеки Joi

**Функционал**

* Проверка токенов
* Регистрация и авторизация пользователей
* Сохранение и отдача карточки
* Сохранение в память, когда кто-то поставил лайк или передумал и убрал его
* Авторизация и регистрация пользователя
* Все роуты, кроме регистрации и авторизации, защищены авторизацией
* Пользователь может удалять только свои карточки

**Планы**
* вынести общую логику из контроллеров для обновления данных пользователя. Небольшая подсказка: На выходе у вас должна получится одна большая функция с общей логикой и две маленькие — функции-декораторы, которые будут выполнять роль контроллеров. Пример функции-декоратора можно найти здесь (часть “Прозрачное кэширование”).
* findUserByCredentials
* Безопасность приложения
* Попробовать куки

**Ссылка на проект**
https://github.com/Nadia-Seliankina/express-mesto-gha
