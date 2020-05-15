<?php

use Illuminate\Http\Request;

// Auth
Route::post("/register", "Auth\RegisterController@register")->name("register");
Route::post('/login', 'Auth\LoginController@login')->name('login');
Route::post('/logout', 'Auth\LoginController@logout')->name('logout');
Route::get('/user', fn() => Auth::user())->name('user');

// Photo
Route::get('/photos', 'PhotoController@index')->name('photo.index');
Route::get('/photos/{id}', 'PhotoController@show')->name('photo.show');
Route::post('/photos', 'PhotoController@create')->name('photo.create');

// Comments
Route::post('/photos/{photo}/comments', 'PhotoController@addComment')->name('photo.comment');

// Likes
Route::put('/photos/{id}/like', 'PhotoController@like')->name('photo.like');
Route::delete('/photos/{id}/like', 'PhotoController@unlike');
