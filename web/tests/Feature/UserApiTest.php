<?php

namespace Tests\Feature;

use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserApiTest extends TestCase
{
  use RefreshDatabase;

  private $user;

  public function setUp(): void
  {
    parent::setUp();

    // テストユーザー作成
    $this->user = factory(User::class)->create();
  }

  public function if_user_is_login__return_login_user()
  {
    $response = $this->actingAs($this->user)->json('GET', route('user'));

    $response
      ->assertStatus(200)
      ->assertJson([
        'name' => $this->user->name,
      ]);
  }

  /**
   * @test
   */
  public function if_user_is_not_login__return_empty_string()
  {
    $response = $this->json('GET', route('user'));

    $response->assertStatus(200);
    $this->assertEquals("", $response->content());
  }
}
