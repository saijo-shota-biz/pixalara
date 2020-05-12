<?php

use Illuminate\Http\Request;

// Auth
Route::post("/register", "Auth\RegisterController@register")->name("register");
Route::post('/login', 'Auth\LoginController@login')->name('login');
Route::post('/logout', 'Auth\LoginController@logout')->name('logout');
Route::get('/user', fn() => Auth::user())->name('user');

// Photo
Route::get('/photos', 'PhotoController@index')->name('photo.index');
Route::post('/photos', 'PhotoController@create')->name('photo.create');
