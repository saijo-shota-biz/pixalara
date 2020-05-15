<?php

namespace Tests\Feature;

use App\Comment;
use App\Photo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class PhotoDetailApiTest extends TestCase
{
  use RefreshDatabase;

  /**
   * @test
   */
  public function should_return_valid_json()
  {
    factory(Photo::class)->create()->each(function ($photo) {
      $photo->comments()->saveMany(factory(Comment::class, 3)->make());
    });
    $photo = Photo::first();

    $response = $this->json('GET', route('photo.show', [
      'id' => $photo->id,
    ]));

    $response->assertStatus(200)
      ->assertJsonFragment([
        'id' => $photo->id,
        'url' => $photo->url,
        'owner' => [
          "id" => $photo->owner->id,
          'name' => $photo->owner->name,
        ],
        "likes_count" => 0,
        "liked_by_user" => false,
        'comments' => $photo->comments
          ->sortByDesc('id')
          ->map(function ($comment) {
            return [
              'author' => [
                'id' => $comment->author->id,
                'name' => $comment->author->name,
              ],
              'content' => $comment->content,
            ];
          })
          ->all(),
      ]);
  }
}
