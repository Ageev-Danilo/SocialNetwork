# SocialNetwork — Frontend

**UA** · [EN](#en-version)

---

## Мета створення проєкту

Цей проєкт створено як навчальний застосунок для розвитку практичних навичок мобільної розробки. У процесі роботи над ним можна:

- Вивчити **React Native** та **Expo** на реальному проєкті з повноцінною архітектурою
- Отримати досвід роботи з **Android Studio** та запуском мобільних емуляторів
- Навчитись інтегрувати сторонні сервіси — **EmailJS** для відправки листів, **Socket.IO** для реального часу
- Зрозуміти принципи управління станом застосунку через **Redux Toolkit** та **RTK Query**
- Поглибити розуміння типізованого коду через **TypeScript**

---

## Склад команди

| Учасник | Роль | GitHub |
|---------|------|--------|
| Ageev Danilo | Teamlead | [@Ageev-Danilo](https://github.com/Ageev-Danilo) |
| Artem Svistun | Developer | [@asvistun5](https://github.com/asvistun5) |
| Daniil Kolomoec | Developer | [@Daniil-Kolomoec](https://github.com/Daniil-Kolomoec) |
| Artem Krivoruchko | Developer | [@Artem653](https://github.com/Artem653) |

---

## Зміст файлу

- [Мета створення проєкту](#мета-створення-проєкту)
- [Склад команди](#склад-команди)
- [Технології та модулі](#технології-та-модулі)
- [Структура проєкту](#структура-проєкту)
- [Як запустити проєкт](#як-запустити-проєкт)
- [Опис модулів](#опис-модулів)
- [Висновок](#висновок)

---

## Технології та модулі

### Основні технології

| Технологія | Опис |
|-----------|------|
| **React Native + Expo** | Основний фреймворк для мобільного застосунку |
| **TypeScript** | Типізація коду |
| **Expo Router** | Файлова навігація між екранами |
| **Redux Toolkit + RTK Query** | Управління станом та запити до API |
| **React Hook Form + Yup** | Форми та їх валідація |
| **Socket.IO Client** | Чат у реальному часі |
| **EmailJS** | Відправка листів без бекенду |
| **Android Studio** | Запуск Android-емулятора |
| **Expo Image Picker** | Вибір фото з галереї |
| **Expo Secure Store** | Безпечне зберігання токенів |
| **AsyncStorage** | Локальне зберігання даних |
| **React Native SVG** | Векторна графіка |

---

## Структура проєкту

```
src/
├── app/                  # Екрани та навігація (Expo Router)
│   ├── (album)/          # Екрани альбомів
│   ├── (auth)/           # Екрани авторизації
│   ├── (chat)/           # Екрани чату
│   ├── (friends)/        # Екрани друзів
│   ├── (modal)/          # Модальні вікна
│   ├── (posts)/          # Екрани публікацій
│   ├── (settings)/       # Екрани налаштувань
│   └── home/             # Головний екран
├── assets/               # Іконки та зображення (SVG, PNG)
├── components/           # Перевикористовувані компоненти
│   └── Settings/         # Компоненти для налаштувань
├── modules/              # Бізнес-логіка по модулях
│   ├── albums/           # Модуль альбомів
│   ├── auth/             # Модуль авторизації
│   ├── chat/             # Модуль чату
│   ├── friends/          # Модуль друзів
│   ├── posts/            # Модуль публікацій
│   └── settings/         # Модуль налаштувань
└── shared/               # Спільні утиліти
    ├── api/              # Базова конфігурація API та сокети
    ├── consts/           # Константи (кольори, поля, стилі)
    ├── store/            # Redux store
    ├── types/            # Загальні типи
    └── ui/               # UI-компоненти (Button, Input, Icon)
```

---

## Як запустити проєкт

### Вимоги

- Node.js
- Android Studio з налаштованим емулятором
- Запущений бекенд-сервер

### Кроки

**1. Клонування репозиторіїв**
```bash
# Бекенд
git clone <посилання на бекенд>
cd backend
npm install
npm run start

# Фронтенд
git clone <посилання на фронтенд>
cd SocialNetwork
npm install
```

**2. Запуск бекенду**
```bash
cd backend
npm run start
```

**3. Запуск емулятора**

Відкрийте **Android Studio → Device Manager** та запустіть емулятор.

**4. Запуск фронтенду**
```bash
npm start
```

**5. Відкрити застосунок**

Після запуску в консолі з'являться команди:

```
› Press a │ open Android      ← натисніть для відкриття на емуляторі
› Press w │ open web
› Press r │ reload app
```

Натисніть `a` для відкриття на Android-емуляторі.

---

## Опис модулів

### Auth — Авторизація
Реєстрація та вхід до застосунку через email. Токени зберігаються в Expo Secure Store.

### Posts — Публікації
Стрічка публікацій: перегляд, створення постів з фото, тегами та посиланнями. Підтримує завантаження зображень з галереї.

### Albums — Альбоми
Управління фотоальбомами: створення, редагування, завантаження фото, приховування зображень.

### Chat — Чат
Особисті та групові чати з обміном повідомленнями у реальному часі через Socket.IO. Підтримує надсилання фото.

### Friends — Друзі
Пошук та управління контактами: запити на дружбу, рекомендації, перегляд профілів.

### Settings — Налаштування
Редагування особистого профілю: ім'я, псевдонім, дата, підпис, аватар.

---

## Висновок

У процесі розробки команда опанувала повний цикл створення мобільного застосунку — від авторизації до реального часу через сокети. Проєкт дав практичний досвід роботи з сучасним стеком React Native та навички побудови масштабованої модульної архітектури.

**Напрями для подальшого розвитку:**
- Додати push-сповіщення
- Реалізувати пошук по користувачах та публікаціях
- Додати Stories-формат
- Оптимізувати завантаження медіафайлів

---
---

# EN Version

## Project Goal

This project was created as a learning application for developing practical mobile development skills:

- Learn **React Native** and **Expo** on a real project with full architecture
- Gain experience with **Android Studio** and mobile emulator setup
- Integrate third-party services — **EmailJS** for emails, **Socket.IO** for real-time features
- Understand state management with **Redux Toolkit** and **RTK Query**
- Deepen understanding of typed code with **TypeScript**

---

## Team

| Member | Role | GitHub |
|--------|------|--------|
| Ageev Danilo | Teamlead | [@Ageev-Danilo](https://github.com/Ageev-Danilo) |
| Artem Svistun | Developer | [@asvistun5](https://github.com/asvistun5) |
| Daniil Kolomoec | Developer | [@Daniil-Kolomoec](https://github.com/Daniil-Kolomoec) |
| Artem Krivoruchko | Developer | [@Artem653](https://github.com/Artem653) |

---

## Table of Contents

- [Project Goal](#project-goal)
- [Team](#team)
- [Technologies](#technologies)
- [Project Structure](#project-structure)
- [How to Run](#how-to-run)
- [Modules](#modules)
- [Conclusion](#conclusion)

---

## Technologies

| Technology | Description |
|-----------|-------------|
| **React Native + Expo** | Core mobile framework |
| **TypeScript** | Code typing |
| **Expo Router** | File-based navigation |
| **Redux Toolkit + RTK Query** | State management and API calls |
| **React Hook Form + Yup** | Forms and validation |
| **Socket.IO Client** | Real-time chat |
| **EmailJS** | Email sending without backend |
| **Android Studio** | Android emulator |
| **Expo Image Picker** | Gallery photo selection |
| **Expo Secure Store** | Secure token storage |
| **AsyncStorage** | Local data storage |
| **React Native SVG** | Vector graphics |

---

## Project Structure

```
src/
├── app/                  # Screens and navigation (Expo Router)
│   ├── (album)/          # Album screens
│   ├── (auth)/           # Auth screens
│   ├── (chat)/           # Chat screens
│   ├── (friends)/        # Friends screens
│   ├── (modal)/          # Modals
│   ├── (posts)/          # Post screens
│   ├── (settings)/       # Settings screens
│   └── home/             # Home screen
├── assets/               # Icons and images (SVG, PNG)
├── components/           # Reusable components
├── modules/              # Business logic by module
│   ├── albums/
│   ├── auth/
│   ├── chat/
│   ├── friends/
│   ├── posts/
│   └── settings/
└── shared/               # Shared utilities
    ├── api/              # Base API config and sockets
    ├── consts/           # Constants
    ├── store/            # Redux store
    ├── types/            # Shared types
    └── ui/               # UI components
```

---

## How to Run

### Requirements

- Node.js
- Android Studio with a configured emulator
- Running backend server

### Steps

**1. Clone repositories**
```bash
git clone <backend-repo-link>
git clone <frontend-repo-link>
```

**2. Start the backend**
```bash
cd backend
npm install
npm run start
```

**3. Launch the emulator**

Open **Android Studio → Device Manager** and start your emulator.

**4. Start the frontend**
```bash
cd SocialNetwork
npm install
npm start
```

**5. Open the app**

After launch, press `a` in the terminal to open on the Android emulator.

---

## Modules

| Module | Description |
|--------|-------------|
| **Auth** | Registration and login via email, token storage |
| **Posts** | Feed with photo posts, tags and links |
| **Albums** | Photo album management with upload support |
| **Chat** | Real-time personal and group chats via Socket.IO |
| **Friends** | Contact management: requests, recommendations, profiles |
| **Settings** | User profile editing: name, avatar, signature |

---

## Conclusion

During development the team mastered the full cycle of mobile app creation — from authentication to real-time features via sockets. The project provided hands-on experience with the modern React Native stack and skills for building a scalable modular architecture.

**Future development directions:**
- Add push notifications
- Implement search for users and posts
- Add Stories format
- Optimize media file loading