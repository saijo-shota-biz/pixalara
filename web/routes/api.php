<?php

use Illuminate\Http\Request;

Route::post("/register", "Auth\RegisterController@register")->name("register");

Route::post('/login', 'Auth\LoginController@login')->name('login');

Route::post('/logout', 'Auth\LoginController@logout')->name('logout');

Route::get('/user', fn() => Auth::user())->name('user');

//Route::middleware('auth:api')->get('/user', function (Request $request) {
//    return $request->user();
//});
