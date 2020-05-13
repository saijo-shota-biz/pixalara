<?php

namespace Tests\Feature;

use App\Photo;
use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AddCommentApiTest extends TestCase
{
  use RefreshDatabase;

  private $user;

  public function setUp(): void
  {
    parent::setUp();

    $this->user = factory(User::class)->create();
  }

    /**
     * @test
     */
    public function should_can_add_comment()
  {
    factory(Photo::class)->create();
    $photo = Photo::first();

    $content = 'sample content';

    $response = $this->actingAs($this->user)
      ->json('POST', route('photo.comment', [
        'photo' => $photo->id,
      ]), compact('content'));

    $comments = $photo->comments()->get();

    $response->assertStatus(201)
      ->assertJsonFragment([
        "author" => [
          "id"=>$this->user->id,
          "name" => $this->user->name,
        ],
        "content" => $content,
      ]);

    $this->assertEquals(1, $comments->count());
    $this->assertEquals($content, $comments[0]->content);
  }
}
