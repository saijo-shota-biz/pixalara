<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

/**
 * App\Photo
 *
 * @property int $id
 * @property int $user_id
 * @property string $filename
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Photo newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Photo newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Photo query()
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Photo whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Photo whereFilename($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Photo whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Photo whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Photo whereUserId($value)
 * @mixin \Eloquent
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\Comment[] $comments
 * @property-read int|null $comments_count
 * @property-read mixed $url
 * @property-read \App\User $owner
 * @property-read int|null $likes_count
 * @property-read \Illuminate\Database\Eloquent\Collection|\App\User[] $likes
 */
class Photo extends Model
{
  protected $keyType = "string";

  public $incrementing = false;

  const ID_LENGTH = 12;

  public function __construct(array $attributes = [])
  {
    parent::__construct($attributes);

    if (!Arr::get($this->attributes, 'id')) {
      $this->setId();
    }
  }

  private function setId()
  {
    $this->attributes['id'] = $this->getRandomId();
  }

  private function getRandomId()
  {
    $characters = array_merge(
      range(0, 9), range('a', 'z'),
      range('A', 'Z'), ['-', '_']
    );

    $length = count($characters);

    $id = "";

    for ($i = 0; $i < self::ID_LENGTH; $i++) {
      $id .= $characters[random_int(0, $length - 1)];
    }

    return $id;
  }

  public function getUrlAttribute()
  {
    return asset('storage/' . $this->attributes['filename']);
  }

  protected $appends = [
    'url', 'likes_count', 'liked_by_user',
  ];

  protected $visible = [
    'id', 'owner', 'url', 'comments', 'likes_count', 'liked_by_user',
  ];

  protected $perPage = 9;

  public function owner()
  {
    return $this->belongsTo('App\User', 'user_id', 'id', 'users');
  }

  public function comments()
  {
    return $this->hasMany('App\Comment')->orderBy('id', 'desc');
  }

  public function likes()
  {
    return $this->belongsToMany('App\User', 'likes')->withTimestamps();
  }

  public function getLikesCountAttribute()
  {
    return $this->likes->count();
  }

  public function getLikedByUserAttribute()
  {
    if (Auth::guest()) {
      return false;
    }
    return $this->likes->contains(function ($user) {
      return $user->id === Auth::user()->id;
    });
  }
}
