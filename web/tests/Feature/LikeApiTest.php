<?php

namespace Tests\Feature;

use App\Photo;
use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class LikeApiTest extends TestCase
{
  use RefreshDatabase;

  private $user;
  private $photo;

  public function setUp(): void
  {
    parent::setUp();

    $this->user = factory(User::class)->create();

    factory(Photo::class)->create();
    $this->photo = Photo::first();
  }

  /**
   * @test
   */
  public function should_can_add_like()
  {
    $response = $this->actingAs($this->user)
      ->json('PUT', route('photo.like', [
        'id' => $this->photo->id,
      ]));

    $response->assertStatus(200)
      ->assertJsonFragment([
        'photo_id' => $this->photo->id,
      ]);

    $this->assertEquals(1, $this->photo->likes()->count());
  }

  /**
   * @test
   */
  public function if_like_two_times__add_one_like()
  {
    $param = ['id' => $this->photo->id];
    $this->actingAs($this->user)->json('PUT', route('photo.like', $param));
    $this->actingAs($this->user)->json('PUT', route('photo.like', $param));

    $this->assertEquals(1, $this->photo->likes()->count());
  }

  /**
   * @test
   */
  public function can_unlike()
  {
    $this->photo->likes()->attach($this->user->id);

    $response = $this->actingAs($this->user)
      ->json('DELETE', route('photo.like', [
        'id' => $this->photo->id,
      ]));

    $response->assertStatus(200)
      ->assertJsonFragment([
        'photo_id' => $this->photo->id,
      ]);

    $this->assertEquals(0, $this->photo->likes()->count());
  }
}
