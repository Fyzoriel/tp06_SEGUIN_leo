<?php

function get_all_users() {
    // read from file
    $users = file_get_contents("./data/users.json");

    // return json
    return json_decode($users, true);
}

function add_user($user) {
    $users = get_all_users();
    $users[] = $user;

    // Encode array to json and save to file
    file_put_contents("./data/users.json", json_encode($users, JSON_PRETTY_PRINT));
}

function get_user_by_id($id) {
    $users = get_all_users();

    foreach ($users as $user) {
        if ($user['id'] == $id) {
            return $user;
        }
    }
    return null;
}