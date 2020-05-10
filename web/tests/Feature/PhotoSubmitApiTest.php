<?php

namespace Tests\Feature;

use App\Photo;
use App\User;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PhotoSubmitApiTest extends TestCase
{
  use RefreshDatabase;

  private $user;

  protected function setUp(): void
  {
    parent::setUp();

    $this->user = factory(User::class)->create();
  }

  /**
   * @test
   */
  public function should_can_upload_file()
  {
    Storage::fake();

    $response = $this->actingAs($this->user)
      ->json("POST", route("photo.create"), [
        "photo" => UploadedFile::fake()->image("photo.png"),
      ]);

    $response->assertStatus(201);

    $photo = Photo::first();

    $this->assertRegExp('/^[0-9a-zA-Z-_]{12}$/', $photo->id);
    Storage::disk("local")->assertExists($photo->filename);
  }

  /**
   * @test
   */
  public function if_db_error__no_save_photo()
  {
    Schema::drop('photos');

    Storage::fake();

    $response = $this->actingAs($this->user)
      ->json("POST", route("photo.create"), [
        "photo" => UploadedFile::fake()->image("photo.png"),
      ]);

    $response->assertStatus(500);

    $this->assertCount(0, Storage::disk("local")->files());
  }

  /**
   * @test
   */
  public function if_save_error__no_save_db()
  {
    Storage::shouldReceive()
      ->once()
      ->andReturnNull();

    $response = $this->actingAs($this->user)
      ->json("POST", route("photo.create"), [
        "photo" => UploadedFile::fake()->image("photo.png"),
      ]);

    $response->assertStatus(500);

    // データベースに何も挿入されていないこと
    $this->assertEmpty(Photo::all());
  }
}
