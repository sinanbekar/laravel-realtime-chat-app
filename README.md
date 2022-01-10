### Laravel Real-time Chat App

You can build yours from scratch with the following Medium article

[https://medium.com/@sinan.bekar/build-a-real-time-chat-app-with-laravel-and-react-5cae5a7c22d4](https://medium.com/@sinan.bekar/build-a-real-time-chat-app-with-laravel-and-react-5cae5a7c22d4)

#### Installation with Docker (Laravel Sail)

Install composer packages:
```bash
docker run --rm \
    -u "$(id -u):$(id -g)" \
    -v $(pwd):/var/www/html \
    -w /var/www/html \
    laravelsail/php81-composer:latest \
    composer install --ignore-platform-reqs
```

Create .env:
```bash
cp .env.example .env
```

Sail up:

```bash
./vendor/bin/sail up -d
```

Generate app key:

```bash
./vendor/bin/sail artisan key:generate
```

Clean cache and migrate:

```bash
./vendor/bin/sail artisan cache:clear && ./vendor/bin/sail artisan migrate
```

Run tinker:
```bash
./vendor/bin/sail artisan tinker
```

Create users and rooms:

```php
\App\Models\User::factory(5)->create();
```

```php
DB::table('rooms')->insert(array_map(function ($room) {
            return ['name' => $room];
        }, ['general', 'room1', 'room2', 'room3', 'room4']));
}
```

Install npm packages and compile assets:

```bash
npm install && npm run dev
```


You can access the chat page by visiting http://localhost/chat after login.
