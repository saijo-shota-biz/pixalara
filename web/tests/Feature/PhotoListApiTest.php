<?php

namespace Tests\Feature;

use App\Photo;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PhotoListApiTest extends TestCase
{
  use RefreshDatabase;

  /**
   * @test
   */
  public function should_return_valid_json()
  {
    factory(Photo::class, 5)->create();

    $response = $this->json('GET', route('photo.index'));

    $photos = Photo::with(["owner"])->orderBy("created_at", "desc")->get();

    $expected = $photos->map(fn($photo) => [
      "id" => $photo->id,
      "url" => $photo->url,
      "owner" => [
        "id" => $photo->owner->id,
        "name" => $photo->owner->name,
      ],
      "likes_count" => 0,
      "liked_by_user" => false,
    ])->all();

    $response
      ->assertJsonCount(5, "data")
      ->assertJsonFragment([
        "data" => $expected
      ]);
  }
}
