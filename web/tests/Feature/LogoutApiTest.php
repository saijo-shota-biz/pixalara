<?php

namespace Tests\Feature;

use App\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LogoutApiTest extends TestCase
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
  public function should_logout()
  {
    $response = $this->actingAs($this->user)->json("POST", route("logout"));

    $response->assertStatus(200);
    $this->assertGuest();
  }
}
