# WebTouch test job (UNDER CONSTRUCTION)

## Задание

---

### Описание

Необходимо написать приложение, которое в табличном виде отображает forks введенного в поисковую строку репозитория (для ввода используется имя репозитория вида :owner/:repositoryName). Можно использовать любые дополнительные библиотеки (в т.ч. библиотеки компонентов), любой дизайн.

### Требования:

1. проект выкладывается на github
2. проект должен использовать react, redux
3. приложение должно состоять из следующих экранов: главный экран с приветствием и полем ввода поисковой строки, экран результатов поиска с аналогичной поисковой строкой. Оба экрана доступны по ссылке
4. В таблице должны отображаться следующие колонки - полное название репозитория, владелец, количестов звезд, ссылка на репозиторий форка
5. В таблице должна быть постраничная навигация
6. По ссылке можно перейти к определенной странице результатов поиска для определенного репозитория (/seacrh&page=1?repository=someRepository)

### Плюсами будут:

7. добавление экрана/модального окна с формой добавления выбранного форка в избранное (избранное хранится в localstorage). Отображается избранное как еще одна колонка в таблице
8. Избранное из предыдущего пункта сохраняется на сервисе Firebase Realtime Database, а не в localStorage
9. выкладка на heroku
10. Использование какой-либо анимации
11. использование проксирующего сервера, который сам обращается к github api
