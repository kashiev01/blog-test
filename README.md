# Эндпоинты для сущности User 
http://eb-dev2-env.eba-atcyfjwk.eu-north-1.elasticbeanstalk.com/user/signup  
Эндпоинт для регистрации юзеров. В запросе передаются поля 'full_name', 'email', 'password'. Сначала идет проверка есть ли в базе юзер с таким email, если есть возвращает ответ "Email уже используется", если нет - в коллекции User создается пользователь. Пароль в базе не сохранется в оригинальном виде, а в захэшированном виде для безопасности. В ответе возвращется документ созданного пользователя
Пример запроса 

```
 {
     "email": "user@gmail.com",
     "full_name": "John Doe",
     "password": "asdfdgdfgdfg123123"
 }
```


http://eb-dev2-env.eba-atcyfjwk.eu-north-1.elasticbeanstalk.com/user/login  
Эндпоинт для авторизации пользователя. В запросе передаются поля 'email', 'password'. Идет проверка email на соответствие email в базе. Если указанный email найден, хэшируется введенный пароль и сравнивается с паролем в базе. Если данные совпали, для пользователю выдается JWT токен. В ответе приходит JWT токен

```
 {
    "email": "user@gmail.com",
    "password": "asdfdgdfgdfg123123"
 }
```


# Эндпоинты для сущности Blog
http://eb-dev2-env.eba-atcyfjwk.eu-north-1.elasticbeanstalk.com/blog/create  
Создает новый документ в коллекции Blog. В запросе надо передать form-data, в поле Key добавить значение 'content'. Можно передавать как текст, так и файл. Поле 'author' заполняется ObjectId, полученным из JWT токена, в поле 'content' сохранется текст, если передали текст или base64 формат файла, если передали файл, 'created_at' генерируется автоматически. В ответе возвращется документ созданного поста


http://eb-dev2-env.eba-atcyfjwk.eu-north-1.elasticbeanstalk.com/blog/all?page=1  
Возвращает все записи с коллеции Blog c пагинацией. На каждой странице отображается по 20 записей. Необхидмо, указывать номер страницы в query param для получения следующих записей

http://eb-dev2-env.eba-atcyfjwk.eu-north-1.elasticbeanstalk.com/blog/update/{id_поста}  
Редактирование поста по _id документа Blog. В запросе надо передать form-data, в поле Key добавить значение 'content'. Можно передавать как текст, так и файл. Стоит проверка, что только автор поста может редактировать указанную запись. При попытке отредактировать не свой пост, вернет сообщение "Вы не можете редактировать чужую запись"

http://eb-dev2-env.eba-atcyfjwk.eu-north-1.elasticbeanstalk.com/blog/{_id_поста}  
Удаление поста в коллеции Blog по _id поста. Стоит проверка, что только автор поста может удалить указанную запись. При попытке удалить не свой пост, вернет сообщение "Вы не можете удалить чужую запись"
