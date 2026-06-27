**Инструкция по запуску проекта Гео-D7**

**Предварительные требования**

- Node.js версии 18.x или выше
- npm версии 9.x или выше
- Git

**Установка**

Клонирование репозитория:
```
bash
git clone https://github.com/your-username/geo-d7.git
cd geo-d7
```

Установка зависимостей:
```
bash
npm install
```

**Запуск проекта**

Режим разработки
```
bash
npm run dev
Проект будет доступен по адресу: http://localhost:3000. Поддерживается горячая перезагрузка при изменении кода.
```

Production сборка
```
bash
npm run build
npm run start
```

**Доступные скрипты**

- npm run dev — запуск в режиме разработки
- npm run build — сборка production версии
- npm run start — запуск собранной production версии
- npm run lint — проверка кода линтером

**Структура проекта**

Основной код находится в директории src/:
app/ — страницы и маршрутизация (App Router)
components/ — React компоненты
lib/ — утилиты и сервисы
contexts/ — React контексты
hooks/ — кастомные хуки
styles/ — глобальные стили
types/ — TypeScript типы
locales/ — файлы переводов
