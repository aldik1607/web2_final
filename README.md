# Authentication & Security Project

Реализация критериев:
- **JWT** для безопасной аутентификации
- **Middleware** для защиты приватных endpoints
- **bcrypt** для хеширования паролей
- **Nodemailer** + SendGrid/Mailgun/Postmark для email

## Установка

```bash
npm install
```

## Настройка

1. Скопируйте `.env.example` в `.env`
2. Заполните переменные окружения (особенно `JWT_SECRET`, SMTP для email)

### Email (SendGrid example)

Для SendGrid: создайте API Key на sendgrid.com, затем:
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=ваш-sendgrid-api-key
SMTP_FROM=noreply@yourdomain.com
```

## Запуск

```bash
npm start
```

## API Endpoints

| Метод | Endpoint | Описание | Auth |
|-------|----------|----------|------|
| POST | /api/auth/register | Регистрация | нет |
| POST | /api/auth/login | Вход | нет |
| GET | /api/auth/me | Текущий пользователь | Bearer token |
| POST | /api/auth/forgot-password | Сброс пароля (отправка email) | нет |
| GET | /api/protected/profile | Приватный профиль | Bearer token |
| GET | /api/protected/dashboard | Dashboard | Bearer token |

### Пример запроса с JWT

```
Authorization: Bearer <your-jwt-token>
```
