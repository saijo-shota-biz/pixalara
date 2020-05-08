<?php

namespace Tests\Feature;

use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LoginApiTest extends TestCase
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
  public function should_login_success()
  {
    $response = $this->json("POST", route("login"), [
      "email" => $this->user->email,
      "password" => "password"
    ]);

    $response->assertStatus(200)->assertJson(["id" => $this->user->id]);

    $this->assertAuthenticatedAs($this->user);
  }
}
