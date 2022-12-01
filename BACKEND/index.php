<?php
use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;
use Slim\Factory\AppFactory;
use Tuupola\Middleware\HttpBasicAuthentication;
use \Firebase\JWT\JWT;

require __DIR__ . '/../vendor/autoload.php';

include_once './utils.php';
include_once './storage.php';

$app = AppFactory::create();

/*
 * Auth
 */
$app->get('/api/fucking-debug-because-i-cant-have-fucking-log-with-this-project-setup/all-users', function (Request $request, Response $response, $args) {
    $response = withHeader($response);
    $users = get_all_users();
    $response->getBody()->write(json_encode($users));
    return withHeader($response);
});

$app->post('/api/auth/login', function (Request $request, Response $response) {

    $err = false;
    // Thanks, Fanny, for the following line of code that I had to copy/paste from your project - need this hack because the framework doesn't work...
    $inputJSON = file_get_contents('php://input');
    $body = json_decode($inputJSON, TRUE);
    $email = $body['email'] ?? "";
    $pass = $body['passphrase'] ?? "";

    if (empty($email) || empty($pass)) {
        $err = "BAD_REQUEST";
    }

    if (!$err) {
        $find = false;

        $users = get_all_users();
        foreach ($users as $user) {
            if ($user['email'] == $email && password_verify($pass, $user['passphrase'])) {
                $jwt = createJwT($user['id'], $user['role']);
                $response = $response->withHeader("Authorization", "Bearer {$jwt}");
                $response->withStatus(200);
                $find = true;
            }
        }
        if (!$find) {
            $err = "NOT_FOUND";
        }
    }

    if ($err == "BAD_REQUEST") {
        $response = $response->withStatus(400);
    } else if ($err == "NOT_FOUND") {
        $response = $response->withStatus(404);
    }

    return withHeader($response);
});

$app->post('/api/auth/register', function (Request $request, Response $response) {
    $err = false;

    $inputJSON = file_get_contents('php://input');
    $body = json_decode($inputJSON, TRUE);

    $firstName = $body['firstName'] ?? "";
    $name = $body['name'] ?? "";
    $email = $body['email'] ?? "";
    $phone = $body['phone'] ?? "";
    $address = $body['address'] ?? "";
    $passphrase = $body['passphrase'] ?? "";
    $confirmPassphrase = $body['confirmPassphrase'] ?? "";

    if (is_null($firstName) || is_null($name) || is_null($email) || is_null($phone) || is_null($address) || is_null($passphrase)) {
        $err = "BAD_REQUEST";
    }
    if (!preg_match("/(0|\+33 ?)[1-9]([-. ]?[0-9]{2} ?){3}([-. ]?[0-9]{2})/", $phone)) {
        $err = "BAD_REQUEST";
    }
    if (strlen($passphrase) < 8 || $passphrase != $confirmPassphrase) {
        $err = "BAD_REQUEST";
    }

    $users = get_all_users();

    $count = count($users);
    if ($count > 0) {
        foreach ($users as $user) {
            if ($user['email'] == $email) {
                $err = "CONFLICT";
                break;
            }
        }
    }

    if (!$err) {
        $role = "user";
        $id = $count + 1;

        $user = array(
            "id" => $id,
            "firstname" => $firstName,
            "name" => $name,
            "email" => $email,
            "phone" => $phone,
            "address" => $address,
            "passphrase" => password_hash($passphrase, PASSWORD_DEFAULT),
            "role" => $role
        );
        add_user($user);
        $response = $response->withStatus(201);

    } else if ($err == "CONFLICT") {
        $response = $response->withStatus(409);

    } else if ($err == "BAD_REQUEST") {
        $response = $response->withStatus(400);

    } else {
        $response = $response->withStatus(500);
    }
    return withHeader($response);
});


/*
 * user
 */
$app->get('/api/user/profile', function (Request $request, Response $response, $args) {
    $err = false;

    // Php method because the framework doesn't work event with Access-Control-Expose-Headers... ... ... ... FML
    $headers = getallheaders();
    $authorization = $headers["Authorization"];

    if (!$authorization) {
        $err = "INTERNAL_SERVER_ERROR";
    }
    if (!$err) {
        $bearer = explode(" ", $authorization);

        if (count($bearer) < 2) {
            $err = "BAD_REQUEST";
        } else if ($bearer[0] != "Bearer") {
            $err = "BAD_REQUEST";
        }
    }

    if (!$err) {
        $jwt = $bearer[1];
        $jswDecoded = decodeJwT($jwt);

        $userid = $jswDecoded["userid"];

        $user = get_user_by_id($userid);

        if ($user) {
            $response = $response->withStatus(200);
            $response->getBody()->write(json_encode($user));
        } else {
            $err = "NOT_FOUND";
        }
    }

    if ($err == "BAD_REQUEST") {
        $response = $response->withStatus(400);
    } else if ($err == "NOT_FOUND") {
        $response = $response->withStatus(404);
    }
    else if ($err == "INTERNAL_SERVER_ERROR") {
        $response = $response->withStatus(500);
    }
    return withHeader($response);
});

/*
 * Product
 */
$app->get('/api/product', function (Request $request, Response $response, $args) {
    $json = file_get_contents("./data/products.json");
    $response->getBody()->write($json);
    return withHeader($response);
});

$options = [
    "attribute" => "token",
    "header" => "Authorization",
    "regexp" => "/Bearer\s+(.*)$/i",
    "secure" => false,
    "algorithm" => ["HS256"],
    "secret" => JWT_SECRET,
    "path" => ["/api"],
    "ignore" => ["/api/product", "/api/auth/login", "/api/auth/register"],
    "error" => function ($response, $arguments) {
        $data = array('ERROR' => 'An error as occurred');
        $response = $response->withStatus(401);
        return withHeader($response)->getBody()->write(json_encode($data));
    }
];

$app->run();