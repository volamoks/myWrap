# Инструкция по редактированию

Этот сайт можно редактировать без программиста! Тексты, фото и цвета настраиваются в файле `public/config.json`.

## Где редактировать?
Откройте файл `public/config.json` в любом текстовом редакторе (Блокнот, VS Code, TextEdit).

## Структура файла
Каждый блок `{ ... }` — это отдельный слайд.

### Доступные типы слайдов:

**1. Титульный (welcome)**
```json
{
    "type": "welcome",
    "title": "2025", 
    "subtitle": "Готова? Тогда листай",
    "theme": "red",
    "duration": 5000
}
```

**2. Цифра с 3D эффектом (stat)**
```json
{
    "type": "stat",
    "title": "1464",
    "value": "1464",
    "description": "Часов вместе",
    "theme": "blue"
}
```

**3. Викторина (quiz)**
Новое! Позволяет задать вопрос и варианты ответа.
```json
{
    "type": "quiz",
    "title": "Угадаешь, сколько?",
    "options": [
      { "text": "150", "correct": false },
      { "text": "342", "correct": true },
      { "text": "89", "correct": false }
    ],
    "theme": "yellow"
}
```
* `correct`: поставьте `true` напротив правильного ответа.

**4. Список (list)**
Для вывода нескольких фактов на одном слайде.
```json
{
    "type": "list",
    "title": "Наши моменты",
    "items": [
      { "label": "Поездок", "value": "12" },
      { "label": "Фильмов", "value": "48" }
    ],
    "theme": "purple"
}
```

**5. Фото (photo-grid)**
```json
{
    "type": "photo-grid",
    "title": "Наши фото",
    "description": "Подпись",
    "images": [
        "https://link-to-photo.jpg",
        "https://link-to-photo-2.jpg"
    ],
    "theme": "blue"
}
```

**6. Цитата (quote)**
Красивый финальный экран с кнопкой перезапуска.
```json
{
    "type": "quote",
    "title": "Заголовок цитаты",
    "subtitle": "Подзаголовок",
    "theme": "black" 
}
```

**7. Итоги (summary)**
Финальный экран с крупными цифрами.
```json
{
    "type": "summary",
    "stats": [ 
        { "label": "Свиданий", "value": "42" },
        { "label": "Часов", "value": "1464" }
    ],
    "theme": "yellow"
}
```

## Темы (цвета)
Доступные значения для `theme`: `red`, `blue`, `green`, `yellow`, `purple`, `black`.

## Как сохранить?
Сохраните файл (`Ctrl+S`) и обновите страницу в браузере.
