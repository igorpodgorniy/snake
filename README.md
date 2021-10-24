# Snake / Змейка

В результат прочтения книжки JS for Kids была сделана игра "Змейка".
В книге рассматривался только один уровень (в моей реализации он второй). Добавил ещё три уровня, счётчики жизней, очков и уровней.
Реализовал экраны старта игры и перехода на следующий уровень.<br/>
С каждым съеденным яблоком скорость змейки увеличивается.
При столкновении змейки с препятсвием или своим телом игра останавливается. Для продолжения необходимо выбрать направление змейки и нажать пробел.<br/>
Уровень продолжается до 20-ти съеденных яблок.

## Управление
При помощи обработчика событий отслеживаются нажатия на клавиши:
- &#8592; &#8593; &#8594; &#8595; (для управления змейкой)
- `space` (для начала игры)

## Уровни
![Уровень №1](https://github.com/igorpodgorniy/snake/raw/main/screenshots/lvl_1.JPG)
![Уровень №2](https://github.com/igorpodgorniy/snake/raw/main/screenshots/lvl_2.JPG)
![Уровень №3](https://github.com/igorpodgorniy/snake/raw/main/screenshots/lvl_3.JPG)
![Уровень №4](https://github.com/igorpodgorniy/snake/raw/main/screenshots/lvl_4.JPG)

## Демо
![Демонстрация процесса игры](https://github.com/igorpodgorniy/snake/raw/main/screenshots/snake.gif)
