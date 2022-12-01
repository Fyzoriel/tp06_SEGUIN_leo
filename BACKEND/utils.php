<?php
use Psr\Http\Message\ResponseInterface as Response;
use \Firebase\JWT\JWT;

function withHeader(Response $response): Response {
    return $response
        ->withHeader("Content-Type", "application/json")
        ->withHeader("Access-Control-Allow-Origin", "http://localhost:4200");
}

const JWT_SECRET = "ezrdfyughirojtpkgh";

function createJwT(int $userId, string $role): string {
    $issuedAt = time();
    $expirationTime = $issuedAt + 60000;
    $payload = array(
        "userid" => $userId,
        "role" => $role,
        "iat" => $issuedAt,
        "exp" => $expirationTime
    );

    return JWT::encode($payload, JWT_SECRET, "HS256");
}

function decodeJwT(string $token): array {
    return (array) JWT::decode($token, JWT_SECRET, array("HS256"));
}